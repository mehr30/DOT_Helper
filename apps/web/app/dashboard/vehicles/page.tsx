import { getServerSession } from "../../../lib/session";
import { prisma } from "@repo/database";
import VehiclesTable from "./VehiclesTable";

export default async function VehiclesPage() {
    const session = await getServerSession();
    let vehicles: Array<{
        id: string;
        unitNumber: string;
        make: string | null;
        model: string | null;
        year: number | null;
        vin: string | null;
        licensePlate: string | null;
        licensePlateState: string | null;
        vehicleType: string;
        status: string;
        annualInspectionDue: string | null;
        nextPmDue: string | null;
    }> = [];

    if (session?.user) {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { companyId: true },
        });

        if (user?.companyId) {
            const dbVehicles = await prisma.vehicle.findMany({
                where: { companyId: user.companyId },
                orderBy: { createdAt: "desc" },
            });

            vehicles = dbVehicles.map((v) => ({
                id: v.id,
                unitNumber: v.unitNumber,
                make: v.make,
                model: v.model,
                year: v.year,
                vin: v.vin,
                licensePlate: v.licensePlate,
                licensePlateState: v.licensePlateState,
                vehicleType: v.vehicleType,
                status: v.status,
                annualInspectionDue: v.annualInspectionDue?.toISOString() ?? null,
                nextPmDue: v.nextPmDue?.toISOString() ?? null,
            }));
        }
    }

    return <VehiclesTable vehicles={vehicles} />;
}
