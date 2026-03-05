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
                select: { companyId: true },
            });
            if (!user?.companyId) {
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
