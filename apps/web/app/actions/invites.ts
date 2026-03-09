"use server";

import { prisma } from "@repo/database";
import { revalidatePath } from "next/cache";
import { requireCompanyRole, requireCompanyUser, getServerSession } from "../../lib/session";
import { sendEmail } from "../../lib/email";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Invite a user to the current company by email.
 * Only OWNER and ADMIN roles can invite.
 */
export async function inviteUser(email: string, role: "ADMIN" | "DISPATCHER" | "DRIVER") {
    const { userId, companyId } = await requireCompanyRole("OWNER", "ADMIN");

    if (!email || !email.includes("@")) {
        return { error: "Please enter a valid email address." };
    }

    // Check if user is already a member
    const existingMember = await prisma.companyMember.findFirst({
        where: {
            companyId,
            user: { email: email.toLowerCase() },
        },
    });
    if (existingMember) {
        return { error: "This person is already a member of your company." };
    }

    // Check for existing pending invite
    const existingInvite = await prisma.companyInvite.findUnique({
        where: { email_companyId: { email: email.toLowerCase(), companyId } },
    });
    if (existingInvite && existingInvite.status === "PENDING") {
        return { error: "An invite has already been sent to this email." };
    }

    // Get company name for the email
    const company = await prisma.company.findUnique({
        where: { id: companyId },
        select: { name: true },
    });

    // Create or upsert the invite
    const invite = await prisma.companyInvite.upsert({
        where: { email_companyId: { email: email.toLowerCase(), companyId } },
        create: {
            email: email.toLowerCase(),
            role,
            companyId,
            invitedBy: userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
        update: {
            role,
            status: "PENDING",
            invitedBy: userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            token: undefined, // Prisma will generate a new cuid
        },
    });

    // Send invite email
    const inviteUrl = `${APP_URL}/invite/${invite.token}`;
    await sendEmail(
        email,
        `You've been invited to ${company?.name ?? "a company"} on Greenlight USDOT`,
        `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #1a1a1a;">You're invited!</h2>
            <p style="color: #4a4a4a; line-height: 1.6;">
                You've been invited to join <strong>${company?.name ?? "a company"}</strong> on Greenlight USDOT
                as a <strong>${role.charAt(0) + role.slice(1).toLowerCase()}</strong>.
            </p>
            <a href="${inviteUrl}" style="
                display: inline-block; padding: 12px 24px;
                background: #16a34a; color: white; text-decoration: none;
                border-radius: 8px; font-weight: 600; margin: 16px 0;
            ">Accept Invite</a>
            <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
                This invite expires in 7 days. If you didn't expect this, you can safely ignore it.
            </p>
        </div>
        `,
    );

    revalidatePath("/dashboard/settings/team");
    return { success: true };
}

/**
 * Accept an invite by token. Creates a CompanyMember and sets activeCompanyId.
 */
export async function acceptInvite(token: string) {
    const session = await getServerSession();
    if (!session?.user) {
        return { error: "Please sign in first to accept this invite.", requireAuth: true };
    }

    const invite = await prisma.companyInvite.findUnique({
        where: { token },
        include: { company: { select: { name: true } } },
    });

    if (!invite) {
        return { error: "This invite link is invalid." };
    }

    if (invite.status === "ACCEPTED") {
        return { error: "This invite has already been accepted." };
    }

    if (invite.status === "EXPIRED" || invite.expiresAt < new Date()) {
        // Mark as expired if not already
        if (invite.status !== "EXPIRED") {
            await prisma.companyInvite.update({
                where: { id: invite.id },
                data: { status: "EXPIRED" },
            });
        }
        return { error: "This invite has expired. Please ask the company admin to send a new one." };
    }

    // Check if already a member
    const existingMember = await prisma.companyMember.findUnique({
        where: {
            userId_companyId: {
                userId: session.user.id,
                companyId: invite.companyId,
            },
        },
    });

    if (existingMember) {
        // Already a member — just mark invite as accepted
        await prisma.companyInvite.update({
            where: { id: invite.id },
            data: { status: "ACCEPTED" },
        });
        return { success: true, companyName: invite.company.name, alreadyMember: true };
    }

    // Create membership and accept invite in a transaction
    await prisma.$transaction(async (tx) => {
        await tx.companyMember.create({
            data: {
                userId: session.user.id,
                companyId: invite.companyId,
                role: invite.role,
                invitedBy: invite.invitedBy,
            },
        });

        await tx.companyInvite.update({
            where: { id: invite.id },
            data: { status: "ACCEPTED" },
        });

        // Set this as the user's active company
        await tx.user.update({
            where: { id: session.user.id },
            data: {
                activeCompanyId: invite.companyId,
                companyId: invite.companyId,
                role: invite.role,
            },
        });
    });

    return { success: true, companyName: invite.company.name };
}

/**
 * Get pending invites for the current company.
 */
export async function getCompanyInvites() {
    const { companyId } = await requireCompanyUser();

    return prisma.companyInvite.findMany({
        where: { companyId, status: "PENDING" },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            expiresAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
}

/**
 * Get current members of the company.
 */
export async function getCompanyMembers() {
    const { companyId } = await requireCompanyUser();

    return prisma.companyMember.findMany({
        where: { companyId },
        select: {
            id: true,
            role: true,
            joinedAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
        orderBy: { joinedAt: "asc" },
    });
}

/**
 * Revoke a pending invite.
 */
export async function revokeInvite(inviteId: string) {
    const { companyId } = await requireCompanyRole("OWNER", "ADMIN");

    const invite = await prisma.companyInvite.findUnique({
        where: { id: inviteId },
    });

    if (!invite || invite.companyId !== companyId) {
        return { error: "Invite not found." };
    }

    await prisma.companyInvite.delete({
        where: { id: inviteId },
    });

    revalidatePath("/dashboard/settings/team");
    return { success: true };
}

/**
 * Remove a member from the company. Only OWNER can remove members.
 */
export async function removeMember(memberId: string) {
    const { userId, companyId } = await requireCompanyRole("OWNER");

    const member = await prisma.companyMember.findUnique({
        where: { id: memberId },
    });

    if (!member || member.companyId !== companyId) {
        return { error: "Member not found." };
    }

    if (member.userId === userId) {
        return { error: "You cannot remove yourself." };
    }

    await prisma.companyMember.delete({
        where: { id: memberId },
    });

    revalidatePath("/dashboard/settings/team");
    return { success: true };
}

/**
 * Get invite details by token (public — no auth required).
 */
export async function getInviteByToken(token: string) {
    const invite = await prisma.companyInvite.findUnique({
        where: { token },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            expiresAt: true,
            company: {
                select: { name: true },
            },
        },
    });

    if (!invite) return null;

    return {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        status: invite.status,
        expired: invite.expiresAt < new Date() || invite.status === "EXPIRED",
        companyName: invite.company.name,
    };
}
