"use server";

import { prisma } from "@repo/database";
import { revalidatePath } from "next/cache";
import { requireCompanyUser } from "../../lib/session";
import { vehicleCreateSchema, vehicleUpdateSchema } from "../../lib/validations/vehicle";

export async function getVehicles() {
    const { companyId } = await requireCompanyUser();

    return prisma.vehicle.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { documents: true, inspections: true } },
        },
    });
}

export async function getVehicle(id: string) {
    const { companyId } = await requireCompanyUser();

    return prisma.vehicle.findFirst({
        where: { id, companyId },
        include: {
            documents: { orderBy: { createdAt: "desc" }, take: 10 },
            inspections: { orderBy: { inspectionDate: "desc" }, take: 10 },
        },
    });
}

export async function createVehicle(formData: unknown) {
    const { companyId } = await requireCompanyUser();

    const parsed = vehicleCreateSchema.safeParse(formData);
    if (!parsed.success) {
        return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const data = parsed.data;

    await prisma.vehicle.create({
        data: {
            unitNumber: data.unitNumber,
            vehicleType: data.vehicleType,
            make: data.make,
            model: data.model,
            year: data.year,
            vin: data.vin || null,
            licensePlate: data.licensePlate || null,
            licensePlateState: data.licensePlateState?.toUpperCase() || null,
            annualInspectionDue: data.annualInspectionDue ? new Date(data.annualInspectionDue) : null,
            nextPmDue: data.nextPmDue ? new Date(data.nextPmDue) : null,
            companyId,
        },
    });

    revalidatePath("/dashboard/vehicles");
    return { success: true };
}

export async function updateVehicle(formData: unknown) {
    const { companyId } = await requireCompanyUser();

    const parsed = vehicleUpdateSchema.safeParse(formData);
    if (!parsed.success) {
        return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const { id, ...data } = parsed.data;

    const existing = await prisma.vehicle.findFirst({
        where: { id, companyId },
    });
    if (!existing) {
        return { error: "Vehicle not found" };
    }

    await prisma.vehicle.update({
        where: { id },
        data: {
            ...(data.unitNumber !== undefined && { unitNumber: data.unitNumber }),
            ...(data.vehicleType !== undefined && { vehicleType: data.vehicleType }),
            ...(data.make !== undefined && { make: data.make }),
            ...(data.model !== undefined && { model: data.model }),
            ...(data.year !== undefined && { year: data.year }),
            ...(data.vin !== undefined && { vin: data.vin || null }),
            ...(data.licensePlate !== undefined && { licensePlate: data.licensePlate || null }),
            ...(data.licensePlateState !== undefined && { licensePlateState: data.licensePlateState?.toUpperCase() || null }),
            ...(data.annualInspectionDue !== undefined && { annualInspectionDue: data.annualInspectionDue ? new Date(data.annualInspectionDue) : null }),
            ...(data.nextPmDue !== undefined && { nextPmDue: data.nextPmDue ? new Date(data.nextPmDue) : null }),
        },
    });

    revalidatePath("/dashboard/vehicles");
    revalidatePath(`/dashboard/vehicles/${id}`);
    return { success: true };
}

export async function deleteVehicle(id: string) {
    const { companyId } = await requireCompanyUser();

    const existing = await prisma.vehicle.findFirst({
        where: { id, companyId },
    });
    if (!existing) {
        return { error: "Vehicle not found" };
    }

    await prisma.vehicle.delete({ where: { id } });

    revalidatePath("/dashboard/vehicles");
    return { success: true };
}
