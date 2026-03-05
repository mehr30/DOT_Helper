"use server";

import { prisma } from "@repo/database";
import { requireCompanyUser } from "../../lib/session";
import { revalidatePath } from "next/cache";

// ---------------------------------------------------------------------------
// Alert Generation Engine
// Scans drivers & vehicles for upcoming expirations and creates Alert records.
// Uses sourceKey for deduplication — safe to call repeatedly.
// ---------------------------------------------------------------------------

interface AlertCandidate {
    sourceKey: string;
    alertType: "EXPIRATION_WARNING" | "COMPLIANCE_ISSUE" | "MISSING_DOCUMENT" | "UPCOMING_DEADLINE";
    title: string;
    message: string;
    dueDate: Date;
    severity: "INFO" | "WARNING" | "URGENT" | "CRITICAL";
    entityType: "driver" | "vehicle" | "company";
    entityId: string;
}

function getSeverity(daysLeft: number): "INFO" | "WARNING" | "URGENT" | "CRITICAL" {
    if (daysLeft <= 0) return "CRITICAL";
    if (daysLeft <= 14) return "URGENT";
    if (daysLeft <= 30) return "WARNING";
    return "INFO";
}

function daysUntil(date: Date): number {
    const now = new Date();
    return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export async function generateAlerts(): Promise<{ generated: number }> {
    const { companyId } = await requireCompanyUser();
    const now = new Date();
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const candidates: AlertCandidate[] = [];

    // --- Driver expirations ---
    const drivers = await prisma.driver.findMany({
        where: {
            companyId,
            status: "ACTIVE",
            OR: [
                { cdlExpiration: { lte: ninetyDaysFromNow } },
                { medicalCardExpiration: { lte: ninetyDaysFromNow } },
            ],
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            cdlNumber: true,
            cdlState: true,
            cdlExpiration: true,
            medicalCardExpiration: true,
            clearinghouseQueryDate: true,
        },
    });

    for (const d of drivers) {
        const cdlDays = daysUntil(d.cdlExpiration);
        if (cdlDays <= 60) {
            const expired = cdlDays <= 0;
            candidates.push({
                sourceKey: `cdl-exp:${d.id}`,
                alertType: "EXPIRATION_WARNING",
                title: expired
                    ? `CDL Expired — ${d.firstName} ${d.lastName}`
                    : `CDL Expiring — ${d.firstName} ${d.lastName}`,
                message: expired
                    ? `CDL ${d.cdlNumber} (${d.cdlState}) expired ${Math.abs(cdlDays)} days ago. Driver is non-compliant and cannot operate a CMV until renewed.`
                    : `CDL ${d.cdlNumber} (${d.cdlState}) expires in ${cdlDays} days. Schedule renewal to avoid compliance lapse.`,
                dueDate: d.cdlExpiration,
                severity: getSeverity(cdlDays),
                entityType: "driver",
                entityId: d.id,
            });
        }

        const medDays = daysUntil(d.medicalCardExpiration);
        if (medDays <= 60) {
            const expired = medDays <= 0;
            candidates.push({
                sourceKey: `med-exp:${d.id}`,
                alertType: "EXPIRATION_WARNING",
                title: expired
                    ? `Medical Card Expired — ${d.firstName} ${d.lastName}`
                    : `Medical Card Expiring — ${d.firstName} ${d.lastName}`,
                message: expired
                    ? `Medical examiner's certificate expired ${Math.abs(medDays)} days ago. Driver cannot operate a CMV until a new certificate is filed.`
                    : `Medical examiner's certificate expires in ${medDays} days. Schedule a DOT physical to avoid a compliance gap.`,
                dueDate: d.medicalCardExpiration,
                severity: getSeverity(medDays),
                entityType: "driver",
                entityId: d.id,
            });
        }

        // Clearinghouse annual query check
        if (!d.clearinghouseQueryDate) {
            candidates.push({
                sourceKey: `ch-query:${d.id}`,
                alertType: "MISSING_DOCUMENT",
                title: `Clearinghouse Query Missing — ${d.firstName} ${d.lastName}`,
                message: `No FMCSA Clearinghouse query on file for ${d.firstName} ${d.lastName}. Annual queries are required for all CDL drivers under 49 CFR 382.701.`,
                dueDate: now,
                severity: "WARNING",
                entityType: "driver",
                entityId: d.id,
            });
        } else {
            const daysSinceQuery = Math.ceil(
                (now.getTime() - d.clearinghouseQueryDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (daysSinceQuery >= 335) {
                // Annual query due within 30 days or overdue
                const overdue = daysSinceQuery >= 365;
                candidates.push({
                    sourceKey: `ch-query:${d.id}`,
                    alertType: "COMPLIANCE_ISSUE",
                    title: overdue
                        ? `Clearinghouse Query Overdue — ${d.firstName} ${d.lastName}`
                        : `Clearinghouse Query Due Soon — ${d.firstName} ${d.lastName}`,
                    message: overdue
                        ? `Annual FMCSA Clearinghouse query is overdue by ${daysSinceQuery - 365} days. Run a new query immediately.`
                        : `Annual FMCSA Clearinghouse query is due within ${365 - daysSinceQuery} days.`,
                    dueDate: new Date(d.clearinghouseQueryDate.getTime() + 365 * 24 * 60 * 60 * 1000),
                    severity: overdue ? "URGENT" : "INFO",
                    entityType: "driver",
                    entityId: d.id,
                });
            }
        }
    }

    // --- Vehicle expirations ---
    const vehicles = await prisma.vehicle.findMany({
        where: {
            companyId,
            status: { in: ["ACTIVE", "MAINTENANCE"] },
            OR: [
                { annualInspectionDue: { lte: ninetyDaysFromNow } },
                { nextPmDue: { lte: ninetyDaysFromNow } },
                { registrationExpiration: { lte: ninetyDaysFromNow } },
            ],
        },
        select: {
            id: true,
            unitNumber: true,
            make: true,
            model: true,
            annualInspectionDue: true,
            nextPmDue: true,
            registrationExpiration: true,
        },
    });

    for (const v of vehicles) {
        if (v.annualInspectionDue) {
            const days = daysUntil(v.annualInspectionDue);
            if (days <= 60) {
                const overdue = days <= 0;
                candidates.push({
                    sourceKey: `insp-due:${v.id}`,
                    alertType: overdue ? "COMPLIANCE_ISSUE" : "EXPIRATION_WARNING",
                    title: overdue
                        ? `Annual Inspection Overdue — Unit ${v.unitNumber}`
                        : `Annual Inspection Due — Unit ${v.unitNumber}`,
                    message: overdue
                        ? `${v.make ?? ""} ${v.model ?? ""} (Unit ${v.unitNumber}) annual DOT inspection is ${Math.abs(days)} days overdue. Vehicle must be taken out of service until inspected.`
                        : `${v.make ?? ""} ${v.model ?? ""} (Unit ${v.unitNumber}) annual DOT inspection due in ${days} days. Schedule inspection to maintain compliance.`,
                    dueDate: v.annualInspectionDue,
                    severity: getSeverity(days),
                    entityType: "vehicle",
                    entityId: v.id,
                });
            }
        }

        if (v.nextPmDue) {
            const days = daysUntil(v.nextPmDue);
            if (days <= 45) {
                candidates.push({
                    sourceKey: `pm-due:${v.id}`,
                    alertType: "UPCOMING_DEADLINE",
                    title: days <= 0
                        ? `PM Service Overdue — Unit ${v.unitNumber}`
                        : `PM Service Due — Unit ${v.unitNumber}`,
                    message: days <= 0
                        ? `Preventive maintenance for Unit ${v.unitNumber} is ${Math.abs(days)} days overdue.`
                        : `Preventive maintenance for Unit ${v.unitNumber} is due in ${days} days.`,
                    dueDate: v.nextPmDue,
                    severity: days <= 0 ? "WARNING" : "INFO",
                    entityType: "vehicle",
                    entityId: v.id,
                });
            }
        }

        if (v.registrationExpiration) {
            const days = daysUntil(v.registrationExpiration);
            if (days <= 60) {
                const expired = days <= 0;
                candidates.push({
                    sourceKey: `reg-exp:${v.id}`,
                    alertType: "EXPIRATION_WARNING",
                    title: expired
                        ? `Registration Expired — Unit ${v.unitNumber}`
                        : `Registration Expiring — Unit ${v.unitNumber}`,
                    message: expired
                        ? `Vehicle registration for Unit ${v.unitNumber} expired ${Math.abs(days)} days ago. Vehicle cannot legally operate.`
                        : `Vehicle registration for Unit ${v.unitNumber} expires in ${days} days. Begin renewal process.`,
                    dueDate: v.registrationExpiration,
                    severity: getSeverity(days),
                    entityType: "vehicle",
                    entityId: v.id,
                });
            }
        }
    }

    // --- Company-level alerts ---
    const company = await prisma.company.findUnique({
        where: { id: companyId },
        select: { mcs150DueDate: true, ucrDueDate: true },
    });

    if (company?.mcs150DueDate) {
        const days = daysUntil(company.mcs150DueDate);
        if (days <= 60) {
            candidates.push({
                sourceKey: `mcs150:${companyId}`,
                alertType: "UPCOMING_DEADLINE",
                title: days <= 0 ? "MCS-150 Update Overdue" : "MCS-150 Biennial Update Due",
                message: days <= 0
                    ? `FMCSA MCS-150 Biennial Update is ${Math.abs(days)} days overdue. Update immediately to avoid penalties.`
                    : `FMCSA MCS-150 Biennial Update is due in ${days} days. Gather vehicle counts and mileage data.`,
                dueDate: company.mcs150DueDate,
                severity: getSeverity(days),
                entityType: "company",
                entityId: companyId,
            });
        }
    }

    if (company?.ucrDueDate) {
        const days = daysUntil(company.ucrDueDate);
        if (days <= 60) {
            candidates.push({
                sourceKey: `ucr:${companyId}`,
                alertType: "UPCOMING_DEADLINE",
                title: days <= 0 ? "UCR Registration Overdue" : "UCR Registration Due",
                message: days <= 0
                    ? `Unified Carrier Registration is ${Math.abs(days)} days overdue.`
                    : `Unified Carrier Registration is due in ${days} days.`,
                dueDate: company.ucrDueDate,
                severity: getSeverity(days),
                entityType: "company",
                entityId: companyId,
            });
        }
    }

    // --- Upsert alerts ---
    let generated = 0;
    for (const c of candidates) {
        // Check if a RESOLVED or DISMISSED alert already exists for this key
        const existing = await prisma.alert.findUnique({
            where: { companyId_sourceKey: { companyId, sourceKey: c.sourceKey } },
            select: { id: true, status: true, severity: true },
        });

        if (existing) {
            if (existing.status === "RESOLVED") {
                // Already handled, skip
                continue;
            }
            // Update severity/message if changed (e.g., went from WARNING to CRITICAL)
            if (existing.severity !== c.severity || existing.status === "DISMISSED") {
                await prisma.alert.update({
                    where: { id: existing.id },
                    data: {
                        severity: c.severity,
                        title: c.title,
                        message: c.message,
                        dueDate: c.dueDate,
                        // Re-activate dismissed alerts if severity escalated
                        ...(existing.status === "DISMISSED" && existing.severity !== c.severity
                            ? { status: "ACTIVE", dismissedAt: null, dismissedBy: null }
                            : {}),
                    },
                });
            }
        } else {
            await prisma.alert.create({
                data: {
                    alertType: c.alertType,
                    title: c.title,
                    message: c.message,
                    dueDate: c.dueDate,
                    severity: c.severity,
                    entityType: c.entityType,
                    entityId: c.entityId,
                    sourceKey: c.sourceKey,
                    autoGenerated: true,
                    companyId,
                },
            });
            generated++;
        }
    }

    // Clean up auto-generated ACTIVE alerts whose sourceKey is no longer in candidates
    const validKeys = candidates.map((c) => c.sourceKey);
    if (validKeys.length > 0) {
        await prisma.alert.deleteMany({
            where: {
                companyId,
                autoGenerated: true,
                status: "ACTIVE",
                sourceKey: { notIn: validKeys },
            },
        });
    } else {
        // No candidates at all — delete all auto-generated active alerts
        await prisma.alert.deleteMany({
            where: {
                companyId,
                autoGenerated: true,
                status: "ACTIVE",
            },
        });
    }

    return { generated };
}

// ---------------------------------------------------------------------------
// Fetch alerts for current company
// ---------------------------------------------------------------------------

export interface AlertData {
    id: string;
    alertType: string;
    title: string;
    message: string;
    dueDate: string | null;
    severity: string;
    status: string;
    entityType: string | null;
    entityId: string | null;
    createdAt: string;
}

export async function getAlerts(): Promise<AlertData[]> {
    const { companyId } = await requireCompanyUser();

    const alerts = await prisma.alert.findMany({
        where: { companyId },
        orderBy: [{ severity: "desc" }, { createdAt: "desc" }],
        take: 100,
    });

    return alerts.map((a) => ({
        id: a.id,
        alertType: a.alertType,
        title: a.title,
        message: a.message,
        dueDate: a.dueDate?.toISOString() ?? null,
        severity: a.severity,
        status: a.status,
        entityType: a.entityType,
        entityId: a.entityId,
        createdAt: a.createdAt.toISOString(),
    }));
}

// ---------------------------------------------------------------------------
// Resolve / Dismiss actions
// ---------------------------------------------------------------------------

export async function resolveAlert(alertId: string) {
    const { companyId } = await requireCompanyUser();

    await prisma.alert.updateMany({
        where: { id: alertId, companyId },
        data: { status: "RESOLVED" },
    });

    revalidatePath("/dashboard/alerts");
    revalidatePath("/dashboard");
}

export async function dismissAlert(alertId: string) {
    const { companyId } = await requireCompanyUser();

    await prisma.alert.updateMany({
        where: { id: alertId, companyId },
        data: {
            status: "DISMISSED",
            dismissedAt: new Date(),
        },
    });

    revalidatePath("/dashboard/alerts");
    revalidatePath("/dashboard");
}
