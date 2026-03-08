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
            select: { documentType: true, driverId: true, vehicleId: true, companyId: true, expirationDate: true },
        }),
        prisma.company.findUnique({
            where: { id: companyId },
            select: { mcs150DueDate: true, ucrDueDate: true, ifta: true, hazmat: true },
        }),
        prisma.company.findUnique({
            where: { id: companyId },
            select: { createdAt: true },
        }),
    ]);

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

    // ── Driver Qualification ──
    const dqItems: ComplianceItem[] = [];

    for (const d of drivers) {
        const name = `${d.firstName} ${d.lastName}`;
        const isCDL = d.licenseType === "CDL";
        // 3-tier: CDL (26,001+ lbs) → everything | CMV (10,001-26,000 lbs) → DOT physical, MVR, app | Regular → license only
        const needsDOTPhysical = isCDL || d.operatesCMV;

        // CDL / License validity — check driver record date OR uploaded document
        const hasCDLDoc = hasDoc("CDL", { driverId: d.id });
        if (d.cdlExpiration) {
            const cdlDays = daysUntil(d.cdlExpiration);
            dqItems.push({
                label: `License Current — ${name}`,
                regulation: "49 CFR 391.11",
                status: cdlDays <= 0 ? "expired" : cdlDays <= 30 ? "action_needed" : "compliant",
                detail: cdlDays <= 0 ? `Expired ${Math.abs(cdlDays)} days ago` : `${cdlDays} days remaining`,
                driverId: d.id,
            });
        } else {
            dqItems.push({
                label: `License Current — ${name}`,
                regulation: "49 CFR 391.11",
                status: hasCDLDoc ? "compliant" : "action_needed",
                detail: hasCDLDoc ? "On file" : "Missing — set expiration on driver profile or upload CDL copy",
                driverId: d.id,
            });
        }

        // Medical certificate — required for CDL and CMV operators (49 CFR 391.43)
        if (needsDOTPhysical) {
            const hasMedDoc = hasDoc("MEDICAL_CERTIFICATE", { driverId: d.id });
            if (d.medicalCardExpiration) {
                const medDays = daysUntil(d.medicalCardExpiration);
                dqItems.push({
                    label: `DOT Physical — ${name}`,
                    regulation: "49 CFR 391.43",
                    status: medDays <= 0 ? "expired" : medDays <= 30 ? "action_needed" : "compliant",
                    detail: medDays <= 0 ? `Expired ${Math.abs(medDays)} days ago` : `${medDays} days remaining`,
                    driverId: d.id,
                });
            } else {
                dqItems.push({
                    label: `DOT Physical — ${name}`,
                    regulation: "49 CFR 391.43",
                    status: hasMedDoc ? "compliant" : "action_needed",
                    detail: hasMedDoc ? "On file" : "Missing — set expiration on driver profile or upload DOT physical card",
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
                driverId: d.id,
            });
        }

        // Clearinghouse query — CDL drivers only (49 CFR 382.701)
        if (isCDL) {
            if (!d.clearinghouseQueryDate) {
                dqItems.push({
                    label: `Clearinghouse Query — ${name}`,
                    regulation: "49 CFR 382.701",
                    status: "action_needed",
                    detail: "No query on file",
                    driverId: d.id,
                });
            } else {
                const daysSince = Math.ceil((now.getTime() - d.clearinghouseQueryDate.getTime()) / (1000 * 60 * 60 * 24));
                dqItems.push({
                    label: `Clearinghouse Query — ${name}`,
                    regulation: "49 CFR 382.701",
                    status: daysSince >= 365 ? "expired" : daysSince >= 335 ? "action_needed" : "compliant",
                    detail: daysSince >= 365 ? `Overdue by ${daysSince - 365} days` : `${365 - daysSince} days until next required`,
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
                driverId: d.id,
            });
        }
    }

    if (drivers.length === 0) {
        dqItems.push({
            label: "No active drivers",
            regulation: "49 CFR 391",
            status: "not_applicable",
            detail: "Add drivers to track DQ compliance",
        });
    }

    // ── Vehicle Maintenance ──
    const vmItems: ComplianceItem[] = [];

    for (const v of vehicles) {
        // Annual inspection
        if (v.annualInspectionDue) {
            const days = daysUntil(v.annualInspectionDue);
            vmItems.push({
                label: `Annual Inspection — Unit ${v.unitNumber}`,
                regulation: "49 CFR 396.17",
                status: days <= 0 ? "expired" : days <= 30 ? "action_needed" : "compliant",
                detail: days <= 0 ? `Overdue by ${Math.abs(days)} days` : `${days} days remaining`,
                vehicleId: v.id,
            });
        } else {
            vmItems.push({
                label: `Annual Inspection — Unit ${v.unitNumber}`,
                regulation: "49 CFR 396.17",
                status: "action_needed",
                detail: "No inspection date set",
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
                vehicleId: v.id,
            });
        }
    }

    if (vehicles.length === 0) {
        vmItems.push({
            label: "No active vehicles",
            regulation: "49 CFR 396",
            status: "not_applicable",
            detail: "Add vehicles to track maintenance compliance",
        });
    }

    // ── Drug & Alcohol (CDL drivers only — 49 CFR 382) ──
    const daItems: ComplianceItem[] = [];
    const cdlDrivers = drivers.filter(d => d.licenseType === "CDL");

    for (const d of cdlDrivers) {
        const name = `${d.firstName} ${d.lastName}`;

        // Pre-employment test — distinguish new hires from existing employees
        const hasPreEmployment = hasDoc("DRUG_TEST_RESULT", { driverId: d.id });
        const isExistingEmployee = d.hireDate && d.hireDate < companyCreatedAt;
        if (hasPreEmployment) {
            daItems.push({
                label: `Pre-Employment Test — ${name}`,
                regulation: "49 CFR 382.301",
                status: "compliant",
                detail: "On file",
                driverId: d.id,
            });
        } else if (isExistingEmployee) {
            daItems.push({
                label: `Pre-Employment Test — ${name}`,
                regulation: "49 CFR 382.301",
                status: "compliant",
                detail: "Existing employee — upload if available",
                driverId: d.id,
            });
        } else {
            daItems.push({
                label: `Pre-Employment Test — ${name}`,
                regulation: "49 CFR 382.301",
                status: "action_needed",
                detail: "Missing pre-employment drug test result",
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
            driverId: d.id,
        });
    }

    if (cdlDrivers.length === 0) {
        daItems.push({
            label: "No CDL drivers",
            regulation: "49 CFR 382",
            status: "not_applicable",
            detail: "Drug & alcohol testing only applies to CDL drivers",
        });
    }

    // ── Company & Authority ──
    const caItems: ComplianceItem[] = [];

    // Operating authority doc
    const hasOA = hasDoc("OPERATING_AUTHORITY");
    caItems.push({
        label: "Operating Authority on File",
        regulation: "49 CFR 365",
        status: hasOA ? "compliant" : "action_needed",
        detail: hasOA ? "On file" : "Upload your operating authority document",
    });

    // BOC-3
    const hasBOC3 = hasDoc("BOC3");
    caItems.push({
        label: "BOC-3 Process Agent",
        regulation: "49 CFR 366",
        status: hasBOC3 ? "compliant" : "action_needed",
        detail: hasBOC3 ? "On file" : "Upload BOC-3 filing",
    });

    // UCR
    const hasUCR = hasDoc("UCR");
    if (company?.ucrDueDate) {
        const days = daysUntil(company.ucrDueDate);
        caItems.push({
            label: "Unified Carrier Registration (UCR)",
            regulation: "49 CFR 367",
            status: days <= 0 ? "expired" : days <= 30 ? "action_needed" : "compliant",
            detail: days <= 0 ? `Overdue by ${Math.abs(days)} days` : `${days} days remaining`,
        });
    } else {
        caItems.push({
            label: "Unified Carrier Registration (UCR)",
            regulation: "49 CFR 367",
            status: hasUCR ? "compliant" : "action_needed",
            detail: hasUCR ? "On file" : "Upload UCR registration",
        });
    }

    // MCS-150
    if (company?.mcs150DueDate) {
        const days = daysUntil(company.mcs150DueDate);
        caItems.push({
            label: "MCS-150 Biennial Update",
            regulation: "49 CFR 390.19",
            status: days <= 0 ? "expired" : days <= 60 ? "action_needed" : "compliant",
            detail: days <= 0 ? `Overdue by ${Math.abs(days)} days` : `Due in ${days} days`,
        });
    } else {
        caItems.push({
            label: "MCS-150 Biennial Update",
            regulation: "49 CFR 390.19",
            status: "action_needed",
            detail: "Set your MCS-150 due date in company settings",
        });
    }

    // Insurance
    const hasInsurance = hasDoc("INSURANCE_POLICY");
    caItems.push({
        label: "Insurance Policy on File",
        regulation: "49 CFR 387",
        status: hasInsurance ? "compliant" : "action_needed",
        detail: hasInsurance ? "On file" : "Upload insurance policy",
    });

    // IFTA
    if (company?.ifta) {
        const hasIFTA = hasDoc("IFTA_LICENSE");
        caItems.push({
            label: "IFTA License",
            regulation: "IFTA Agreement",
            status: hasIFTA ? "compliant" : "action_needed",
            detail: hasIFTA ? "On file" : "Upload IFTA license",
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
