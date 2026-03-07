import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import { prisma } from "@repo/database";
import DashboardShell from "./DashboardShell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        const headersList = await headers();
        const pathname = headersList.get("x-pathname") || "";
        const session = await auth.api.getSession({ headers: headersList });

        // If user is logged in and has no company, redirect to onboarding
        // (skip if already on onboarding page or in demo mode)
        const isOnboardingPage = pathname.startsWith("/dashboard/onboarding");
        if (session?.user && !isOnboardingPage) {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: {
                    companyId: true,
                    activeCompanyId: true,
                    memberships: { select: { id: true }, take: 1 },
                },
            });

            // Redirect to onboarding if user has no memberships AND no legacy companyId
            const hasCompany = (user?.memberships?.length ?? 0) > 0 || !!user?.companyId;
            if (!hasCompany) {
                redirect("/dashboard/onboarding");
            }
        }
    } catch (e: unknown) {
        // Re-throw redirect errors (Next.js uses thrown responses for redirects)
        if (e && typeof e === "object" && "digest" in e) throw e;
        // Swallow other errors during build or when DB is unavailable
    }

    return <DashboardShell>{children}</DashboardShell>;
}
