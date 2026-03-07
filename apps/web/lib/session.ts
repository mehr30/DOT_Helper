import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { prisma } from "@repo/database";
import type { UserRole } from "@prisma/client";

/**
 * Get the current server-side session (or null if not authenticated).
 */
export async function getServerSession() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return session;
}

/**
 * Require an authenticated user with at least one company membership.
 * Returns { userId, companyId, role } or redirects to login / onboarding.
 *
 * Resolution order:
 * 1. Check user.activeCompanyId — if it matches a valid membership, use it.
 * 2. Fall back to user.companyId (legacy single-company field).
 * 3. Fall back to first membership.
 * 4. If no memberships at all → redirect to onboarding.
 *
 * Always fetches fresh from DB for multi-tenant safety.
 */
export async function requireCompanyUser(): Promise<{
    userId: string;
    companyId: string;
    role: UserRole;
}> {
    const session = await getServerSession();
    if (!session?.user) {
        redirect("/login");
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            companyId: true,
            activeCompanyId: true,
            role: true,
            memberships: {
                select: {
                    companyId: true,
                    role: true,
                },
            },
        },
    });

    if (!user) {
        redirect("/login");
    }

    // If user has memberships, use multi-org logic
    if (user.memberships.length > 0) {
        // Try activeCompanyId first
        let membership = user.activeCompanyId
            ? user.memberships.find(m => m.companyId === user.activeCompanyId)
            : null;

        // Fall back to legacy companyId
        if (!membership && user.companyId) {
            membership = user.memberships.find(m => m.companyId === user.companyId);
        }

        // Fall back to first membership
        if (!membership) {
            membership = user.memberships[0]!;
        }

        // Keep activeCompanyId in sync (fire-and-forget)
        if (user.activeCompanyId !== membership.companyId) {
            prisma.user.update({
                where: { id: userId },
                data: { activeCompanyId: membership.companyId },
            }).catch(() => {}); // non-blocking
        }

        return { userId, companyId: membership.companyId, role: membership.role };
    }

    // Legacy path: no memberships yet, use companyId directly
    if (user.companyId) {
        return { userId, companyId: user.companyId, role: user.role };
    }

    // No company at all
    redirect("/dashboard/onboarding");
}

/**
 * Require an authenticated user with a specific role in the current company.
 * Redirects or throws if the user lacks the required role.
 */
export async function requireCompanyRole(...allowedRoles: UserRole[]): Promise<{
    userId: string;
    companyId: string;
    role: UserRole;
}> {
    const result = await requireCompanyUser();
    if (!allowedRoles.includes(result.role)) {
        throw new Error("You don't have permission to perform this action.");
    }
    return result;
}
