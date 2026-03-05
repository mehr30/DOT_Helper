"use server";

import { prisma } from "@repo/database";
import { revalidatePath } from "next/cache";
import { requireCompanyUser } from "../../lib/session";
import { driverCreateSchema, driverUpdateSchema } from "../../lib/validations/driver";

export async function getDrivers() {
    const { companyId } = await requireCompanyUser();

    return prisma.driver.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { documents: true, violations: true },
            },
        },
    });
}

export async function getDriver(id: string) {
    const { companyId } = await requireCompanyUser();

    return prisma.driver.findFirst({
        where: { id, companyId },
        include: {
            documents: { orderBy: { createdAt: "desc" }, take: 10 },
            violations: { orderBy: { violationDate: "desc" }, take: 10 },
        },
    });
}

export async function createDriver(formData: unknown) {
    const { companyId } = await requireCompanyUser();

    const parsed = driverCreateSchema.safeParse(formData);
    if (!parsed.success) {
        return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const data = parsed.data;

    await prisma.driver.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email || null,
            phone: data.phone || null,
            cdlNumber: data.cdlNumber,
            cdlState: data.cdlState.toUpperCase(),
            cdlClass: data.cdlClass,
            cdlExpiration: new Date(data.cdlExpiration),
            medicalCardExpiration: new Date(data.medicalCardExpiration),
            hireDate: new Date(data.hireDate),
            endorsements: data.endorsements,
            companyId,
        },
    });

    revalidatePath("/dashboard/drivers");
    return { success: true };
}

export async function updateDriver(formData: unknown) {
    const { companyId } = await requireCompanyUser();

    const parsed = driverUpdateSchema.safeParse(formData);
    if (!parsed.success) {
        return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const { id, ...data } = parsed.data;

    // Verify ownership
    const existing = await prisma.driver.findFirst({
        where: { id, companyId },
    });
    if (!existing) {
        return { error: "Driver not found" };
    }

    await prisma.driver.update({
        where: { id },
        data: {
            ...(data.firstName !== undefined && { firstName: data.firstName }),
            ...(data.lastName !== undefined && { lastName: data.lastName }),
            ...(data.email !== undefined && { email: data.email || null }),
            ...(data.phone !== undefined && { phone: data.phone || null }),
            ...(data.cdlNumber !== undefined && { cdlNumber: data.cdlNumber }),
            ...(data.cdlState !== undefined && { cdlState: data.cdlState.toUpperCase() }),
            ...(data.cdlClass !== undefined && { cdlClass: data.cdlClass }),
            ...(data.cdlExpiration !== undefined && { cdlExpiration: new Date(data.cdlExpiration) }),
            ...(data.medicalCardExpiration !== undefined && { medicalCardExpiration: new Date(data.medicalCardExpiration) }),
            ...(data.hireDate !== undefined && { hireDate: new Date(data.hireDate) }),
            ...(data.endorsements !== undefined && { endorsements: data.endorsements }),
        },
    });

    revalidatePath("/dashboard/drivers");
    revalidatePath(`/dashboard/drivers/${id}`);
    return { success: true };
}

export async function deleteDriver(id: string) {
    const { companyId } = await requireCompanyUser();

    // Verify ownership
    const existing = await prisma.driver.findFirst({
        where: { id, companyId },
    });
    if (!existing) {
        return { error: "Driver not found" };
    }

    await prisma.driver.delete({ where: { id } });

    revalidatePath("/dashboard/drivers");
    return { success: true };
}
