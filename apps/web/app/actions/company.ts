"use server";

import { prisma } from "@repo/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession, requireCompanyUser } from "../../lib/session";
import { companyOnboardingSchema, companyUpdateSchema } from "../../lib/validations/company";

type CompanyActionResult = { success?: boolean; error?: string };

export async function createCompany(formData: unknown): Promise<CompanyActionResult> {
    const session = await getServerSession();
    if (!session?.user) {
        return { error: "Not authenticated" };
    }

    const parsed = companyOnboardingSchema.safeParse(formData);
    if (!parsed.success) {
        return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const data = parsed.data;

    // Check for duplicate USDOT (only if one was provided, skip soft-deleted)
    const usdot = data.usdotNumber?.trim() || null;
    if (usdot) {
        const existing = await prisma.company.findFirst({
            where: { usdotNumber: usdot, deletedAt: null },
        });
        if (existing) {
            return { error: "A company with this USDOT number already exists" };
        }
    }

    // Create company, CompanyMember, and set activeCompanyId
    await prisma.$transaction(async (tx) => {
        const company = await tx.company.create({
            data: {
                name: data.name,
                usdotNumber: usdot,
                fleetSizeRange: data.fleetSizeRange,
                operationType: data.operationType || null,
                operationScope: data.operationScope || null,
                mcNumber: data.mcNumber || null,
                address: data.address || null,
                city: data.city || null,
                state: data.state || null,
                zip: data.zip || null,
                phone: data.phone || null,
                email: data.email || null,
            },
        });

        // Create membership record
        await tx.companyMember.create({
            data: {
                userId: session.user.id,
                companyId: company.id,
                role: data.userRole,
            },
        });

        // Set this as the active company (and keep legacy companyId in sync)
        await tx.user.update({
            where: { id: session.user.id },
            data: {
                companyId: company.id,
                activeCompanyId: company.id,
                role: data.userRole,
            },
        });
    });

    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateCompany(formData: unknown) {
    const session = await getServerSession();
    if (!session?.user) {
        return { error: "Not authenticated" };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { activeCompanyId: true, companyId: true },
    });

    const companyId = user?.activeCompanyId || user?.companyId;
    if (!companyId) {
        return { error: "No company found" };
    }

    const parsed = companyUpdateSchema.safeParse(formData);
    if (!parsed.success) {
        return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const data = parsed.data;
    const usdot = data.usdotNumber?.trim() || null;

    // Check for duplicate USDOT (only if changed and provided, skip soft-deleted)
    if (usdot) {
        const existing = await prisma.company.findFirst({
            where: { usdotNumber: usdot, deletedAt: null },
        });
        if (existing && existing.id !== companyId) {
            return { error: "A different company already has this USDOT number" };
        }
    }

    await prisma.company.update({
        where: { id: companyId },
        data: {
            name: data.name,
            usdotNumber: usdot,
            mcNumber: data.mcNumber || null,
            address: data.address || null,
            city: data.city || null,
            state: data.state || null,
            zip: data.zip || null,
            phone: data.phone || null,
            email: data.email || null,
            operationType: data.operationType || null,
            operationScope: data.operationScope || null,
        },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
    return { success: true };
}

export async function getCompanyForUser() {
    const session = await getServerSession();
    if (!session?.user) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            activeCompanyId: true,
            companyId: true,
        },
    });

    const companyId = user?.activeCompanyId || user?.companyId;
    if (!companyId) return null;

    return prisma.company.findFirst({
        where: { id: companyId, deletedAt: null },
        select: {
            id: true,
            name: true,
            usdotNumber: true,
            mcNumber: true,
            address: true,
            city: true,
            state: true,
            zip: true,
            phone: true,
            email: true,
            fleetSizeRange: true,
            operationType: true,
            operationScope: true,
        },
    });
}

/**
 * Switch the user's active company. Validates membership before switching.
 */
export async function switchCompany(companyId: string) {
    const session = await getServerSession();
    if (!session?.user) {
        return { error: "Not authenticated" };
    }

    // Verify the user is a member of this company
    const membership = await prisma.companyMember.findUnique({
        where: {
            userId_companyId: {
                userId: session.user.id,
                companyId,
            },
        },
    });

    if (!membership) {
        return { error: "You are not a member of this company" };
    }

    // Update activeCompanyId and legacy companyId
    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            activeCompanyId: companyId,
            companyId: companyId,
            role: membership.role,
        },
    });

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

/**
 * Get all companies the current user is a member of.
 */
export async function getUserCompanies() {
    const session = await getServerSession();
    if (!session?.user) return [];

    const memberships = await prisma.companyMember.findMany({
        where: {
            userId: session.user.id,
            company: { deletedAt: null },
        },
        select: {
            role: true,
            company: {
                select: {
                    id: true,
                    name: true,
                    usdotNumber: true,
                    city: true,
                    state: true,
                },
            },
        },
        orderBy: { joinedAt: "asc" },
    });

    return memberships.map(m => ({
        id: m.company.id,
        name: m.company.name,
        usdotNumber: m.company.usdotNumber,
        location: [m.company.city, m.company.state].filter(Boolean).join(", ") || null,
        role: m.role,
    }));
}

/**
 * Delete the current company. Only the OWNER can do this.
 * Requires typing the company name as confirmation.
 */
export async function deleteCompany(confirmName: string): Promise<CompanyActionResult> {
    const { userId, companyId } = await requireCompanyUser();

    // Verify the user is OWNER
    const membership = await prisma.companyMember.findUnique({
        where: {
            userId_companyId: { userId, companyId },
        },
    });

    if (!membership || membership.role !== "OWNER") {
        return { error: "Only the company owner can delete a company" };
    }

    // Verify company name matches
    const company = await prisma.company.findUnique({
        where: { id: companyId },
        select: { name: true },
    });

    if (!company) {
        return { error: "Company not found" };
    }

    if (company.name.trim().toLowerCase() !== confirmName.trim().toLowerCase()) {
        return { error: "Company name does not match" };
    }

    // Soft-delete: mark as deleted (retained 30 days for recovery)
    // Null out usdotNumber to free the unique constraint for re-creation
    await prisma.company.update({
        where: { id: companyId },
        data: {
            deletedAt: new Date(),
            usdotNumber: null,
        },
    });

    // Remove all memberships so the company disappears from user lists
    await prisma.companyMember.deleteMany({ where: { companyId } });

    // Find another company the user belongs to
    const remaining = await prisma.companyMember.findFirst({
        where: { userId },
        select: { companyId: true, role: true },
    });

    if (remaining) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                activeCompanyId: remaining.companyId,
                companyId: remaining.companyId,
                role: remaining.role,
            },
        });
    } else {
        await prisma.user.update({
            where: { id: userId },
            data: {
                activeCompanyId: null,
                companyId: null,
            },
        });
    }

    revalidatePath("/dashboard");
    return { success: true };
}
