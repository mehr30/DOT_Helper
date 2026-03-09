import { getServerSession } from "../../lib/session";
import { prisma } from "@repo/database";
import DashboardContent from "./DashboardContent";
import type { SearchableEntity, UpcomingItem } from "./DashboardContent";
import type { DashboardStats } from "../actions/dashboard";
import { generateAlerts } from "../actions/alerts";
import { getComplianceScores, type ComplianceScores } from "../actions/compliance";
import { getComplianceReviewStatus } from "../actions/company";

export default async function DashboardPage() {
    const session = await getServerSession();
    let stats: DashboardStats | null = null;
    let complianceScores: ComplianceScores | null = null;
    let reviewDue = false;
    const searchEntities: SearchableEntity[] = [];
    const upcomingItems: UpcomingItem[] = [];

    if (session?.user) {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { companyId: true },
        });

        if (user?.companyId) {
            const companyId = user.companyId;

            // Refresh auto-generated alerts from current data
            try { await generateAlerts(); } catch { /* ok */ }

            const now = new Date();
            const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

            const [driverCount, vehicleCount, activeAlerts, expiringDrivers, expiringVehicles, allDrivers, allVehicles] =
                await Promise.all([
                    prisma.driver.count({ where: { companyId, status: "ACTIVE" } }),
                    prisma.vehicle.count({ where: { companyId, status: "ACTIVE" } }),
                    prisma.alert.count({ where: { companyId, status: "ACTIVE" } }),
                    prisma.driver.findMany({
                        where: {
                            companyId,
                            status: "ACTIVE",
                            OR: [
                                { cdlExpiration: { lte: ninetyDaysFromNow } },
                                { medicalCardExpiration: { lte: ninetyDaysFromNow } },
                            ],
                        },
                        select: {
                            id: true, firstName: true, lastName: true,
                            cdlExpiration: true, medicalCardExpiration: true,
                        },
                    }),
                    prisma.vehicle.findMany({
                        where: {
                            companyId,
                            status: "ACTIVE",
                            annualInspectionDue: { lte: ninetyDaysFromNow },
                        },
                        select: { id: true, unitNumber: true, annualInspectionDue: true },
                    }),
                    // For dashboard search
                    prisma.driver.findMany({
                        where: { companyId, status: "ACTIVE" },
                        select: { id: true, firstName: true, lastName: true, cdlNumber: true },
                        orderBy: { firstName: "asc" },
                    }),
                    prisma.vehicle.findMany({
                        where: { companyId, status: "ACTIVE" },
                        select: { id: true, unitNumber: true, make: true, model: true, year: true },
                        orderBy: { unitNumber: "asc" },
                    }),
                ]);

            const upcomingExpirations: DashboardStats["upcomingExpirations"] = [];

            for (const d of expiringDrivers) {
                if (d.cdlExpiration) {
                    const cdlDays = Math.ceil((d.cdlExpiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    if (cdlDays <= 90) {
                        upcomingExpirations.push({
                            id: `cdl-${d.id}`, title: `License Expiration — ${d.firstName} ${d.lastName}`,
                            date: d.cdlExpiration.toISOString(), type: "driver", daysLeft: cdlDays,
                        });
                    }
                }
                if (d.medicalCardExpiration) {
                    const medDays = Math.ceil((d.medicalCardExpiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    if (medDays <= 90) {
                        upcomingExpirations.push({
                            id: `med-${d.id}`, title: `DOT Physical — ${d.firstName} ${d.lastName}`,
                            date: d.medicalCardExpiration.toISOString(), type: "driver", daysLeft: medDays,
                        });
                    }
                }
            }

            for (const v of expiringVehicles) {
                if (v.annualInspectionDue) {
                    const days = Math.ceil((v.annualInspectionDue.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    upcomingExpirations.push({
                        id: `insp-${v.id}`, title: `Annual Inspection — Unit ${v.unitNumber}`,
                        date: v.annualInspectionDue.toISOString(), type: "vehicle", daysLeft: days,
                    });
                }
            }

            upcomingExpirations.sort((a, b) => a.daysLeft - b.daysLeft);

            stats = { driverCount, vehicleCount, activeAlerts, upcomingExpirations };

            // Build "upcoming deadlines" — items due in 30-90 days (currently fine)
            for (const exp of upcomingExpirations) {
                if (exp.daysLeft > 30 && exp.daysLeft <= 90) {
                    upcomingItems.push({
                        id: exp.id,
                        title: exp.title,
                        date: exp.date,
                        daysLeft: exp.daysLeft,
                        href: exp.type === "driver" ? "/dashboard/drivers" : "/dashboard/vehicles",
                    });
                }
            }

            // Build searchable entities for dashboard search
            for (const d of allDrivers) {
                searchEntities.push({
                    id: d.id,
                    name: `${d.firstName} ${d.lastName}`,
                    type: "driver",
                    subtitle: d.cdlNumber ? `CDL: ${d.cdlNumber}` : undefined,
                });
            }
            for (const v of allVehicles) {
                const desc = [v.year, v.make, v.model].filter(Boolean).join(" ");
                searchEntities.push({
                    id: v.id,
                    name: `Unit ${v.unitNumber}`,
                    type: "vehicle",
                    subtitle: desc || undefined,
                });
            }

            // Fetch compliance scores for the dashboard snapshot
            try {
                complianceScores = await getComplianceScores();
            } catch {
                // ok — compliance data may not be available yet
            }

            // Check if compliance review is due
            try {
                const reviewStatus = await getComplianceReviewStatus();
                reviewDue = reviewStatus.isDue;
            } catch {
                // ok
            }
        }
    }

    const hasCompany = !!session?.user && stats !== null;

    // Extract user display name for greeting
    const userName = session?.user?.name
        || session?.user?.email?.split("@")[0]
        || "there";

    return (
        <DashboardContent
            stats={stats}
            hasCompany={hasCompany}
            complianceScores={complianceScores}
            userName={userName}
            searchEntities={searchEntities}
            upcomingItems={upcomingItems}
            reviewDue={reviewDue}
        />
    );
}
