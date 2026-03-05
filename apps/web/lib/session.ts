import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { prisma } from "@repo/database";

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
 * Require an authenticated user with a linked company.
 * Returns { userId, companyId } or redirects to login / onboarding.
 * Always fetches companyId from DB (not session cache) for multi-tenant safety.
 */
export async function requireCompanyUser(): Promise<{
    userId: string;
    companyId: string;
}> {
    const session = await getServerSession();
    if (!session?.user) {
        redirect("/login");
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { companyId: true },
    });

    if (!user?.companyId) {
        redirect("/dashboard/onboarding");
    }

    return { userId, companyId: user.companyId };
}
