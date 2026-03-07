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
            licenseType: data.licenseType ?? "CDL",
            cdlNumber: data.cdlNumber || null,
            cdlState: data.cdlState?.toUpperCase() || null,
            cdlClass: data.cdlClass || null,
            cdlExpiration: data.cdlExpiration ? new Date(data.cdlExpiration) : null,
            medicalCardExpiration: data.medicalCardExpiration ? new Date(data.medicalCardExpiration) : null,
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
            ...(data.licenseType !== undefined && { licenseType: data.licenseType }),
            ...(data.cdlNumber !== undefined && { cdlNumber: data.cdlNumber || null }),
            ...(data.cdlState !== undefined && { cdlState: data.cdlState?.toUpperCase() || null }),
            ...(data.cdlClass !== undefined && { cdlClass: data.cdlClass || null }),
            ...(data.cdlExpiration !== undefined && { cdlExpiration: data.cdlExpiration ? new Date(data.cdlExpiration) : null }),
            ...(data.medicalCardExpiration !== undefined && { medicalCardExpiration: data.medicalCardExpiration ? new Date(data.medicalCardExpiration) : null }),
            ...(data.hireDate !== undefined && { hireDate: new Date(data.hireDate) }),
            ...(data.clearinghouseQueryDate !== undefined && { clearinghouseQueryDate: data.clearinghouseQueryDate ? new Date(data.clearinghouseQueryDate) : null }),
            ...(data.lastDrugTestDate !== undefined && { lastDrugTestDate: data.lastDrugTestDate ? new Date(data.lastDrugTestDate) : null }),
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
