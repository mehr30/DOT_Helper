import { notFound } from "next/navigation";
import { getServerSession } from "../../../../lib/session";
import { prisma } from "@repo/database";
import VehicleDetail from "./VehicleDetail";

export default async function VehiclePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await getServerSession();

    if (!session?.user) {
        notFound();
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { companyId: true },
    });

    if (!user?.companyId) {
        notFound();
    }

    const vehicle = await prisma.vehicle.findFirst({
        where: { id, companyId: user.companyId },
        include: {
            documents: {
                orderBy: { createdAt: "desc" },
                take: 10,
                select: { id: true, name: true, documentType: true, expirationDate: true },
            },
            inspections: {
                orderBy: { inspectionDate: "desc" },
                take: 10,
                select: { id: true, inspectionType: true, inspectionDate: true, passed: true, defectsFound: true },
            },
        },
    });

    if (!vehicle) {
        notFound();
    }

    const serialized = {
        id: vehicle.id,
        unitNumber: vehicle.unitNumber,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        vin: vehicle.vin,
        licensePlate: vehicle.licensePlate,
        licensePlateState: vehicle.licensePlateState,
        vehicleType: vehicle.vehicleType,
        status: vehicle.status,
        annualInspectionDue: vehicle.annualInspectionDue?.toISOString() ?? null,
        lastPmDate: vehicle.lastPmDate?.toISOString() ?? null,
        nextPmDue: vehicle.nextPmDue?.toISOString() ?? null,
        documents: vehicle.documents.map(d => ({
            ...d,
            expirationDate: d.expirationDate?.toISOString() ?? null,
        })),
        inspections: vehicle.inspections.map(i => ({
            ...i,
            inspectionDate: i.inspectionDate.toISOString(),
        })),
    };

    return <VehicleDetail vehicle={serialized} />;
}
