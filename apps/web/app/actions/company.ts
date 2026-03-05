"use server";

import { prisma } from "@repo/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "../../lib/session";
import { companyOnboardingSchema } from "../../lib/validations/company";

export async function createCompany(formData: unknown) {
    const session = await getServerSession();
    if (!session?.user) {
        return { error: "Not authenticated" };
    }

    const parsed = companyOnboardingSchema.safeParse(formData);
    if (!parsed.success) {
        return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const data = parsed.data;

    // Check for duplicate USDOT (only if one was provided)
    const usdot = data.usdotNumber?.trim() || null;
    if (usdot) {
        const existing = await prisma.company.findUnique({
            where: { usdotNumber: usdot },
        });
        if (existing) {
            return { error: "A company with this USDOT number already exists" };
        }
    }

    // Create company and connect user
    await prisma.$transaction(async (tx) => {
        const company = await tx.company.create({
            data: {
                name: data.name,
                usdotNumber: usdot,
                fleetSizeRange: data.fleetSizeRange,
                mcNumber: data.mcNumber || null,
                address: data.address || null,
                city: data.city || null,
                state: data.state || null,
                zip: data.zip || null,
                phone: data.phone || null,
                email: data.email || null,
            },
        });

        await tx.user.update({
            where: { id: session.user.id },
            data: {
                companyId: company.id,
                role: data.userRole,
            },
        });
    });

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

export async function getCompanyForUser() {
    const session = await getServerSession();
    if (!session?.user) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            companyId: true,
            company: {
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
                },
            },
        },
    });

    return user?.company ?? null;
}
