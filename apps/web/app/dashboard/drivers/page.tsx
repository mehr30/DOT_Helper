import { getServerSession } from "../../../lib/session";
import { prisma } from "@repo/database";
import DriversTable from "./DriversTable";

export default async function DriversPage() {
    const session = await getServerSession();
    let drivers: Array<{
        id: string;
        firstName: string;
        lastName: string;
        email: string | null;
        phone: string | null;
        cdlNumber: string;
        cdlState: string;
        cdlExpiration: string;
        medicalCardExpiration: string;
        status: string;
        _count: { documents: number; violations: number };
    }> = [];

    if (session?.user) {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { companyId: true },
        });

        if (user?.companyId) {
            const dbDrivers = await prisma.driver.findMany({
                where: { companyId: user.companyId },
                orderBy: { createdAt: "desc" },
                include: {
                    _count: { select: { documents: true, violations: true } },
                },
            });

            drivers = dbDrivers.map((d) => ({
                id: d.id,
                firstName: d.firstName,
                lastName: d.lastName,
                email: d.email,
                phone: d.phone,
                cdlNumber: d.cdlNumber,
                cdlState: d.cdlState,
                cdlExpiration: d.cdlExpiration.toISOString(),
                medicalCardExpiration: d.medicalCardExpiration.toISOString(),
                status: d.status,
                _count: d._count,
            }));
        }
    }

    return <DriversTable drivers={drivers} />;
}
