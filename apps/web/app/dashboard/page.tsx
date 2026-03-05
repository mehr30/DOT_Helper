import { getServerSession } from "../../lib/session";
import { prisma } from "@repo/database";
import DashboardContent from "./DashboardContent";
import type { DashboardStats } from "../actions/dashboard";
import { generateAlerts } from "../actions/alerts";

export default async function DashboardPage() {
    const session = await getServerSession();
    let stats: DashboardStats | null = null;

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
            const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

            const [driverCount, vehicleCount, activeAlerts, expiringDrivers, expiringVehicles] =
                await Promise.all([
                    prisma.driver.count({ where: { companyId, status: "ACTIVE" } }),
                    prisma.vehicle.count({ where: { companyId, status: "ACTIVE" } }),
                    prisma.alert.count({ where: { companyId, status: "ACTIVE" } }),
                    prisma.driver.findMany({
                        where: {
                            companyId,
                            status: "ACTIVE",
                            OR: [
                                { cdlExpiration: { lte: sixtyDaysFromNow } },
                                { medicalCardExpiration: { lte: sixtyDaysFromNow } },
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
                            annualInspectionDue: { lte: sixtyDaysFromNow },
                        },
                        select: { id: true, unitNumber: true, annualInspectionDue: true },
                    }),
                ]);

            const upcomingExpirations: DashboardStats["upcomingExpirations"] = [];

            for (const d of expiringDrivers) {
                if (d.cdlExpiration) {
                    const cdlDays = Math.ceil((d.cdlExpiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    if (cdlDays <= 60) {
                        upcomingExpirations.push({
                            id: `cdl-${d.id}`, title: `CDL Expiration — ${d.firstName} ${d.lastName}`,
                            date: d.cdlExpiration.toISOString(), type: "driver", daysLeft: cdlDays,
                        });
                    }
                }
                if (d.medicalCardExpiration) {
                    const medDays = Math.ceil((d.medicalCardExpiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    if (medDays <= 60) {
                        upcomingExpirations.push({
                            id: `med-${d.id}`, title: `Medical Card — ${d.firstName} ${d.lastName}`,
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
        }
    }

    const hasCompany = !!session?.user && stats !== null;

    return <DashboardContent stats={stats} hasCompany={hasCompany} />;
}
