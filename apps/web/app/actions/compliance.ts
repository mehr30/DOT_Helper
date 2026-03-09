"use server";

import { prisma } from "@repo/database";
import { requireCompanyUser } from "../../lib/session";

// ---------------------------------------------------------------------------
// Compliance Scoring Engine
// Calculates real compliance scores from driver, vehicle, and document data.
// ---------------------------------------------------------------------------

export interface ComplianceItem {
    label: string;
    regulation: string;
    status: "compliant" | "action_needed" | "expired" | "not_applicable";
    detail?: string;
    reason?: string; // Plain-English explanation of WHY this item is required
    driverId?: string;
    vehicleId?: string;
}

export interface ComplianceCategory {
    name: string;
    score: number;
    items: ComplianceItem[];
}

export interface ComplianceScores {
    overall: number;
    categories: ComplianceCategory[];
    summary: {
        totalItems: number;
        compliant: number;
        actionNeeded: number;
        expired: number;
    };
}

function daysUntil(date: Date): number {
    return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export async function getComplianceScores(): Promise<ComplianceScores> {
    const { companyId } = await requireCompanyUser();
    const now = new Date();

    const [drivers, vehicles, documents, company, companyRecord] = await Promise.all([
        prisma.driver.findMany({
            where: { companyId, status: "ACTIVE" },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                licenseType: true,
                operatesCMV: true,
                cdlExpiration: true,
                medicalCardExpiration: true,
                clearinghouseQueryDate: true,
                lastDrugTestDate: true,
                hireDate: true,
                _count: { select: { documents: true } },
            },
        }),
        prisma.vehicle.findMany({
            where: { companyId, status: { in: ["ACTIVE", "MAINTENANCE"] } },
            select: {
                id: true,
                unitNumber: true,
                annualInspectionDue: true,
                nextPmDue: true,
                registrationExpiration: true,
                _count: { select: { documents: true, inspections: true } },
            },
        }),
        prisma.document.findMany({
            where: {
                OR: [
                    { companyId },
                    { driver: { companyId } },
                    { vehicle: { companyId } },
                ],
            },
            select: { documentType: true, fileName: true, driverId: true, vehicleId: true, companyId: true, expirationDate: true, createdAt: true },
        }),
        prisma.company.findUnique({
            where: { id: companyId },
            select: { mcs150DueDate: true, ucrDueDate: true, ifta: true, hazmat: true, operationType: true, operationScope: true },
        }),
        prisma.company.findUnique({
            where: { id: companyId },
            select: { createdAt: true },
        }),
    ]);

    // Conditional compliance: determine which items this carrier actually needs
    // Only show interstate-specific items when the user has explicitly confirmed they cross state lines
    const opType = company?.operationType ?? "PRIVATE"; // default to private (most small businesses)
    const opScope = company?.operationScope ?? null;
    const isIntrastate = opScope === "INTRASTATE";
    const isInterstate = opScope === "INTERSTATE" || opScope === "BOTH";
    const isForHire = opType === "FOR_HIRE";
    const needsBOC3 = isForHire && isInterstate;
    const needsOperatingAuthority = isForHire && isInterstate;
    const needsUCR = isInterstate;
    const needsIFTA = isInterstate || !!company?.ifta;

    const companyCreatedAt = companyRecord?.createdAt ?? now;

    // Helper: check if a document type exists for a specific entity
    // Documents with a past expiration date are not counted as valid
    const hasDoc = (type: string, opts?: { driverId?: string; vehicleId?: string }) => {
        return documents.some((d) => {
            if (d.documentType !== type) return false;
            // If the document has an expiration date and it's in the past, skip it
            if (d.expirationDate && d.expirationDate < now) return false;
            if (opts?.driverId) return d.driverId === opts.driverId;
            if (opts?.vehicleId) return d.vehicleId === opts.vehicleId;
            return d.companyId === companyId;
        });
    };

    // Helper: check if a wizard-generated document exists by fileName prefix
    const hasWizardDoc = (formId: string, opts?: { driverId?: string; currentYear?: boolean }) => {
        const prefix = `wizard_${formId}`;
        return documents.some((d) => {
            if (!d.fileName?.startsWith(prefix)) return false;
            if (opts?.driverId && d.driverId !== opts.driverId) return false;
            if (opts?.currentYear && d.createdAt) {
                return d.createdAt.getFullYear() === now.getFullYear();
            }
            return true;
        });
    };

    // ── Driver Qualification ──
    const dqItems: ComplianceItem[] = [];

    for (const d of drivers) {
        const name = `${d.firstName} ${d.lastName}`;
        const isCDL = d.licenseType === "CDL";
        // 3-tier: CDL (26,001+ lbs) → everything | CMV (10,001-26,000 lbs) → DOT physical, MVR, app | Regular → license only
        const needsDOTPhysical = isCDL || d.operatesCMV;

        // CDL / License validity — check driver record date OR uploaded document
        const hasCDLDoc = hasDoc("CDL", { driverId: d.id });
        const licenseReason = isCDL
            ? `${name} holds a CDL — a valid license must be on file at all times`
            : `${name} operates a commercial vehicle — a valid license is required`;
        if (d.cdlExpiration) {
            const cdlDays = daysUntil(d.cdlExpiration);
            dqItems.push({
                label: `License Current — ${name}`,
                regulation: "49 CFR 391.11",
                status: cdlDays <= 0 ? "expired" : cdlDays <= 30 ? "action_needed" : "compliant",
                detail: cdlDays <= 0 ? `Expired ${Math.abs(cdlDays)} days ago` : `${cdlDays} days remaining`,
                reason: licenseReason,
                driverId: d.id,
            });
        } else {
            dqItems.push({
                label: `License Current — ${name}`,
                regulation: "49 CFR 391.11",
                status: hasCDLDoc ? "compliant" : "action_needed",
                detail: hasCDLDoc ? "On file" : "Missing — set expiration on driver profile or upload CDL copy",
                reason: licenseReason,
                driverId: d.id,
            });
        }

        // Medical certificate — required for CDL and CMV operators (49 CFR 391.43)
        if (needsDOTPhysical) {
            const medReason = isCDL
                ? `${name} holds a CDL — DOT physical exam is required every 2 years`
                : `${name} operates a vehicle over 10,001 lbs — DOT physical is required`;
            const hasMedDoc = hasDoc("MEDICAL_CERTIFICATE", { driverId: d.id });
            if (d.medicalCardExpiration) {
                const medDays = daysUntil(d.medicalCardExpiration);
                dqItems.push({
                    label: `DOT Physical — ${name}`,
                    regulation: "49 CFR 391.43",
                    status: medDays <= 0 ? "expired" : medDays <= 30 ? "action_needed" : "compliant",
                    detail: medDays <= 0 ? `Expired ${Math.abs(medDays)} days ago` : `${medDays} days remaining`,
                    reason: medReason,
                    driverId: d.id,
                });
            } else {
                dqItems.push({
                    label: `DOT Physical — ${name}`,
                    regulation: "49 CFR 391.43",
                    status: hasMedDoc ? "compliant" : "action_needed",
                    detail: hasMedDoc ? "On file" : "Missing — set expiration on driver profile or upload DOT physical card",
                    reason: medReason,
                    driverId: d.id,
                });
            }
        }

        // MVR on file — required for CDL and CMV operators
        if (needsDOTPhysical) {
            const hasMVR = hasDoc("MVR", { driverId: d.id });
            dqItems.push({
                label: `MVR on File — ${name}`,
                regulation: "49 CFR 391.25",
                status: hasMVR ? "compliant" : "action_needed",
                detail: hasMVR ? "On file" : "Missing — annual MVR required",
                reason: `${name} operates a commercial vehicle — you must pull their driving record (MVR) once a year`,
                driverId: d.id,
            });
        }

        // Clearinghouse query — CDL drivers only (49 CFR 382.701)
        if (isCDL) {
            const chReason = `${name} holds a CDL — you must check the FMCSA Drug & Alcohol Clearinghouse once a year`;
            if (!d.clearinghouseQueryDate) {
                dqItems.push({
                    label: `Clearinghouse Query — ${name}`,
                    regulation: "49 CFR 382.701",
                    status: "action_needed",
                    detail: "No query on file",
                    reason: chReason,
                    driverId: d.id,
                });
            } else {
                const daysSince = Math.ceil((now.getTime() - d.clearinghouseQueryDate.getTime()) / (1000 * 60 * 60 * 24));
                dqItems.push({
                    label: `Clearinghouse Query — ${name}`,
                    regulation: "49 CFR 382.701",
                    status: daysSince >= 365 ? "expired" : daysSince >= 335 ? "action_needed" : "compliant",
                    detail: daysSince >= 365 ? `Overdue by ${daysSince - 365} days` : `${365 - daysSince} days until next required`,
                    reason: chReason,
                    driverId: d.id,
                });
            }
        }

        // Employment application on file — required for CDL and CMV operators
        if (needsDOTPhysical) {
            const hasApp = hasDoc("EMPLOYMENT_APPLICATION", { driverId: d.id });
            dqItems.push({
                label: `Employment Application — ${name}`,
                regulation: "49 CFR 391.21",
                status: hasApp ? "compliant" : "action_needed",
                detail: hasApp ? "On file" : "Missing",
                reason: `${name} operates a commercial vehicle — DOT requires a signed employment application on file`,
                driverId: d.id,
            });
        }

        // Road Test Certificate — required for CDL and CMV operators (49 CFR 391.31)
        if (needsDOTPhysical) {
            const hasRoadTest = hasDoc("ROAD_TEST_CERTIFICATE", { driverId: d.id }) ||
                hasWizardDoc("roadTestCert", { driverId: d.id });
            dqItems.push({
                label: `Road Test Certificate — ${name}`,
                regulation: "49 CFR 391.31",
                status: hasRoadTest ? "compliant" : "action_needed",
                detail: hasRoadTest ? "On file" : "Missing",
                reason: `${name} operates a commercial vehicle — a road test certificate must be on file`,
                driverId: d.id,
            });
        }

        // Annual Certification of Violations — required for CDL and CMV operators (49 CFR 391.27)
        if (needsDOTPhysical) {
            const hasAnnualCert = hasWizardDoc("annualCertViolations", { driverId: d.id, currentYear: true });
            dqItems.push({
                label: `Annual Certification of Violations — ${name}`,
                regulation: "49 CFR 391.27",
                status: hasAnnualCert ? "compliant" : "action_needed",
                detail: hasAnnualCert ? "Completed this year" : "Not completed this year",
                reason: `${name} must certify their violations (or lack of) once per year`,
                driverId: d.id,
            });
        }
    }

    if (drivers.length === 0) {
        dqItems.push({
            label: "No active drivers",
            regulation: "49 CFR 391",
            status: "not_applicable",
            detail: "Add your drivers to start tracking their compliance",
        });
    }

    // ── Vehicle Maintenance ──
    const vmItems: ComplianceItem[] = [];

    for (const v of vehicles) {
        // Annual inspection
        const inspReason = `Unit ${v.unitNumber} is a commercial vehicle — DOT requires an annual inspection by a certified mechanic`;
        if (v.annualInspectionDue) {
            const days = daysUntil(v.annualInspectionDue);
            vmItems.push({
                label: `Annual Inspection — Unit ${v.unitNumber}`,
                regulation: "49 CFR 396.17",
                status: days <= 0 ? "expired" : days <= 30 ? "action_needed" : "compliant",
                detail: days <= 0 ? `Overdue by ${Math.abs(days)} days` : `${days} days remaining`,
                reason: inspReason,
                vehicleId: v.id,
            });
        } else {
            vmItems.push({
                label: `Annual Inspection — Unit ${v.unitNumber}`,
                regulation: "49 CFR 396.17",
                status: "action_needed",
                detail: "No inspection date set",
                reason: inspReason,
                vehicleId: v.id,
            });
        }

        // PM schedule
        if (v.nextPmDue) {
            const days = daysUntil(v.nextPmDue);
            vmItems.push({
                label: `Preventive Maintenance — Unit ${v.unitNumber}`,
                regulation: "49 CFR 396.3",
                status: days <= 0 ? "action_needed" : "compliant",
                detail: days <= 0 ? `Overdue by ${Math.abs(days)} days` : `${days} days until next PM`,
                reason: `Unit ${v.unitNumber} needs regular maintenance to stay safe and pass inspections`,
                vehicleId: v.id,
            });
        }

        // Registration
        if (v.registrationExpiration) {
            const days = daysUntil(v.registrationExpiration);
            vmItems.push({
                label: `Registration — Unit ${v.unitNumber}`,
                regulation: "State Law",
                status: days <= 0 ? "expired" : days <= 30 ? "action_needed" : "compliant",
                detail: days <= 0 ? `Expired ${Math.abs(days)} days ago` : `${days} days remaining`,
                reason: `Unit ${v.unitNumber} must have current registration — expired registration can lead to fines or being put out of service`,
                vehicleId: v.id,
            });
        }
    }

    if (vehicles.length === 0) {
        vmItems.push({
            label: "No active vehicles",
            regulation: "49 CFR 396",
            status: "not_applicable",
            detail: "Add your vehicles to start tracking inspections and maintenance",
        });
    }

    // ── Drug & Alcohol (CDL drivers only — 49 CFR 382) ──
    const daItems: ComplianceItem[] = [];
    const cdlDrivers = drivers.filter(d => d.licenseType === "CDL");

    for (const d of cdlDrivers) {
        const name = `${d.firstName} ${d.lastName}`;
        const cdlDrugReason = `${name} holds a CDL — federal law requires drug & alcohol testing for all CDL holders`;

        // Pre-employment test — distinguish new hires from existing employees
        const hasPreEmployment = hasDoc("DRUG_TEST_RESULT", { driverId: d.id });
        const isExistingEmployee = d.hireDate && d.hireDate < companyCreatedAt;
        if (hasPreEmployment) {
            daItems.push({
                label: `Pre-Employment Test — ${name}`,
                regulation: "49 CFR 382.301",
                status: "compliant",
                detail: "On file",
                reason: cdlDrugReason,
                driverId: d.id,
            });
        } else if (isExistingEmployee) {
            daItems.push({
                label: `Pre-Employment Test — ${name}`,
                regulation: "49 CFR 382.301",
                status: "compliant",
                detail: "Existing employee — upload if available",
                reason: cdlDrugReason,
                driverId: d.id,
            });
        } else {
            daItems.push({
                label: `Pre-Employment Test — ${name}`,
                regulation: "49 CFR 382.301",
                status: "action_needed",
                detail: "Missing pre-employment drug test result",
                reason: cdlDrugReason,
                driverId: d.id,
            });
        }

        // Clearinghouse consent
        const hasConsent = hasDoc("CLEARINGHOUSE_CONSENT", { driverId: d.id });
        daItems.push({
            label: `Clearinghouse Consent — ${name}`,
            regulation: "49 CFR 382.703",
            status: hasConsent ? "compliant" : "action_needed",
            detail: hasConsent ? "On file" : "Missing signed consent form",
            reason: `${name} holds a CDL — you need their signed consent to run Clearinghouse queries`,
            driverId: d.id,
        });

        // D&A Policy Acknowledgment — 49 CFR 382.601
        const hasDAPolicyAck = hasWizardDoc("drugAlcoholPolicy", { driverId: d.id });
        daItems.push({
            label: `D&A Policy Acknowledgment — ${name}`,
            regulation: "49 CFR 382.601",
            status: hasDAPolicyAck ? "compliant" : "action_needed",
            detail: hasDAPolicyAck ? "On file" : "Missing signed policy acknowledgment",
            reason: `${name} holds a CDL — they must sign acknowledging your drug & alcohol policy`,
            driverId: d.id,
        });
    }

    if (cdlDrivers.length === 0) {
        daItems.push({
            label: "No CDL drivers",
            regulation: "49 CFR 382",
            status: "not_applicable",
            detail: "Drug & alcohol testing applies when you add CDL holders",
        });
    }

    // ── Company & Authority ──
    const caItems: ComplianceItem[] = [];

    // Operating authority doc — only for-hire interstate carriers
    if (needsOperatingAuthority) {
        const hasOA = hasDoc("OPERATING_AUTHORITY");
        caItems.push({
            label: "Operating Authority on File",
            regulation: "49 CFR 365",
            status: hasOA ? "compliant" : "action_needed",
            detail: hasOA ? "On file" : "Upload your operating authority document",
            reason: "Because you haul for other businesses across state lines, you need FMCSA operating authority",
        });
    }

    // BOC-3 — only for-hire interstate carriers
    if (needsBOC3) {
        const hasBOC3 = hasDoc("BOC3");
        caItems.push({
            label: "BOC-3 Process Agent",
            regulation: "49 CFR 366",
            status: hasBOC3 ? "compliant" : "action_needed",
            detail: hasBOC3 ? "On file" : "Upload BOC-3 filing",
            reason: "Because you operate interstate for-hire, you must designate a legal process agent in each state",
        });
    }

    // UCR — not required for intrastate-only carriers
    if (needsUCR) {
        const hasUCR = hasDoc("UCR");
        const ucrReason = "Because you operate across state lines, you must register and pay the annual UCR fee";
        if (company?.ucrDueDate) {
            const days = daysUntil(company.ucrDueDate);
            caItems.push({
                label: "Unified Carrier Registration (UCR)",
                regulation: "49 CFR 367",
                status: days <= 0 ? "expired" : days <= 30 ? "action_needed" : "compliant",
                detail: days <= 0 ? `Overdue by ${Math.abs(days)} days` : `${days} days remaining`,
                reason: ucrReason,
            });
        } else {
            caItems.push({
                label: "Unified Carrier Registration (UCR)",
                regulation: "49 CFR 367",
                status: hasUCR ? "compliant" : "action_needed",
                detail: hasUCR ? "On file" : "Upload UCR registration",
                reason: ucrReason,
            });
        }
    }

    // MCS-150 — everyone with a USDOT
    const mcs150Reason = "Every company with a USDOT number must update their federal business info every 2 years";
    if (company?.mcs150DueDate) {
        const days = daysUntil(company.mcs150DueDate);
        caItems.push({
            label: "MCS-150 Biennial Update",
            regulation: "49 CFR 390.19",
            status: days <= 0 ? "expired" : days <= 60 ? "action_needed" : "compliant",
            detail: days <= 0 ? `Overdue by ${Math.abs(days)} days` : `Due in ${days} days`,
            reason: mcs150Reason,
        });
    } else {
        caItems.push({
            label: "MCS-150 Biennial Update",
            regulation: "49 CFR 390.19",
            status: "action_needed",
            detail: "Set your MCS-150 due date in company settings",
            reason: mcs150Reason,
        });
    }

    // Insurance — everyone
    const hasInsurance = hasDoc("INSURANCE_POLICY");
    caItems.push({
        label: "Insurance Policy on File",
        regulation: "49 CFR 387",
        status: hasInsurance ? "compliant" : "action_needed",
        detail: hasInsurance ? "On file" : "Upload insurance policy",
        reason: "All commercial vehicle operators must carry liability insurance — keep a copy on file",
    });

    // IFTA — not required for intrastate-only carriers (unless explicitly flagged)
    if (needsIFTA) {
        const hasIFTA = hasDoc("IFTA_LICENSE");
        caItems.push({
            label: "IFTA License",
            regulation: "IFTA Agreement",
            status: hasIFTA ? "compliant" : "action_needed",
            detail: hasIFTA ? "On file" : "Upload IFTA license",
            reason: "Because you operate across state lines, you need an IFTA fuel tax license to report fuel tax in each state",
        });
    }

    // Build categories
    const buildCategory = (name: string, items: ComplianceItem[]): ComplianceCategory => {
        const applicable = items.filter((i) => i.status !== "not_applicable");
        if (applicable.length === 0) return { name, score: 100, items };
        const compliant = applicable.filter((i) => i.status === "compliant").length;
        return { name, score: Math.round((compliant / applicable.length) * 100), items };
    };

    const categories = [
        buildCategory("Driver Qualification", dqItems),
        buildCategory("Vehicle Maintenance", vmItems),
        buildCategory("Drug & Alcohol", daItems),
        buildCategory("Company & Authority", caItems),
    ];

    const allItems = [...dqItems, ...vmItems, ...daItems, ...caItems];
    const applicable = allItems.filter((i) => i.status !== "not_applicable");
    const compliantCount = applicable.filter((i) => i.status === "compliant").length;
    const actionCount = applicable.filter((i) => i.status === "action_needed").length;
    const expiredCount = applicable.filter((i) => i.status === "expired").length;
    const overall = applicable.length === 0 ? 100 : Math.round((compliantCount / applicable.length) * 100);

    return {
        overall,
        categories,
        summary: {
            totalItems: applicable.length,
            compliant: compliantCount,
            actionNeeded: actionCount,
            expired: expiredCount,
        },
    };
}
