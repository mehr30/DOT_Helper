"use server";

import { prisma } from "@repo/database";
import { requireCompanyUser } from "../../lib/session";
import { revalidatePath } from "next/cache";

// ---------------------------------------------------------------------------
// Magic Signing Link System
// Admin creates a signing request → driver opens a unique link → signs → done
// ---------------------------------------------------------------------------

export interface SigningRequestData {
    formId: string;
    formTitle: string;
    formData: Record<string, string | boolean>;
    driverId?: string;
    vehicleId?: string;
    driverEmail?: string;
    driverPhone?: string;
}

export async function createSigningRequest(data: SigningRequestData) {
    const { companyId, userId } = await requireCompanyUser();

    // Verify driver belongs to company if provided
    if (data.driverId) {
        const driver = await prisma.driver.findFirst({
            where: { id: data.driverId, companyId },
            select: { id: true },
        });
        if (!driver) return { error: "Driver not found" };
    }

    // Expire in 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const request = await prisma.signingRequest.create({
        data: {
            formId: data.formId,
            formTitle: data.formTitle,
            formData: data.formData as unknown as import("@prisma/client").Prisma.InputJsonValue,
            driverId: data.driverId || null,
            vehicleId: data.vehicleId || null,
            companyId,
            createdById: userId,
            expiresAt,
        },
    });

    const baseUrl = process.env.BETTER_AUTH_URL || "https://dot-helper-web.vercel.app";
    const signingUrl = `${baseUrl}/sign/${request.token}`;

    // Send email if driver has an email
    if (data.driverEmail) {
        try {
            await sendSigningEmail(data.driverEmail, data.formTitle, signingUrl);
        } catch (e) {
            console.error("Failed to send signing email:", e);
            // Don't fail — admin can still copy the link
        }
    }

    return { success: true, url: signingUrl, token: request.token };
}

// Fetch signing request by token (public — no auth required)
export async function getSigningRequest(token: string) {
    const request = await prisma.signingRequest.findUnique({
        where: { token },
        include: {
            company: { select: { name: true } },
            driver: { select: { firstName: true, lastName: true } },
        },
    });

    if (!request) return { error: "not_found" as const };
    if (request.status === "SIGNED") return { error: "already_signed" as const, signedAt: request.signedAt };
    if (request.expiresAt < new Date()) return { error: "expired" as const };

    return {
        id: request.id,
        formTitle: request.formTitle,
        formData: request.formData as Record<string, string | boolean>,
        companyName: request.company.name,
        driverName: request.driver ? `${request.driver.firstName} ${request.driver.lastName}` : null,
        expiresAt: request.expiresAt.toISOString(),
    };
}

// Complete signing (public — no auth required)
export async function completeSigningRequest(token: string, signatureDataUrl: string) {
    const request = await prisma.signingRequest.findUnique({
        where: { token },
    });

    if (!request) return { error: "Signing request not found" };
    if (request.status === "SIGNED") return { error: "Already signed" };
    if (request.expiresAt < new Date()) return { error: "This signing link has expired" };

    // Update signing request
    await prisma.signingRequest.update({
        where: { id: request.id },
        data: {
            status: "SIGNED",
            signature: signatureDataUrl,
            signedAt: new Date(),
        },
    });

    // Map wizard form IDs to document types
    const formToDocType: Record<string, string> = {
        mcs150: "OTHER",
        driverApp: "EMPLOYMENT_APPLICATION",
        annualCertViolations: "OTHER",
        dvir: "OTHER",
        drugAlcoholPolicy: "CLEARINGHOUSE_CONSENT",
        roadTestCert: "ROAD_TEST_CERTIFICATE",
        annualMVRReview: "MVR",
        boc3: "BOC3",
    };

    // Create a Document record so the compliance engine picks it up
    const suffix = request.driverId ? `_d_${request.driverId}` : request.vehicleId ? `_v_${request.vehicleId}` : "";
    const fileName = `wizard_${request.formId}${suffix}`;

    // Check if doc already exists
    const existing = await prisma.document.findFirst({
        where: {
            fileName,
            OR: [
                { companyId: request.companyId },
                { driver: { companyId: request.companyId } },
                { vehicle: { companyId: request.companyId } },
            ],
        },
    });

    if (existing) {
        await prisma.document.update({
            where: { id: existing.id },
            data: { name: request.formTitle },
        });
    } else {
        await prisma.document.create({
            data: {
                name: request.formTitle,
                documentType: (formToDocType[request.formId] ?? "OTHER") as never,
                fileName,
                fileUrl: "",
                category: request.driverId ? "driver" : request.vehicleId ? "vehicle" : "company",
                driverId: request.driverId,
                vehicleId: request.vehicleId,
                companyId: !request.driverId && !request.vehicleId ? request.companyId : null,
                uploadedById: request.createdById,
            },
        });
    }

    revalidatePath("/dashboard/documents");
    revalidatePath("/dashboard/compliance");
    revalidatePath("/dashboard");

    return { success: true };
}

// ---------------------------------------------------------------------------
// Email helper
// ---------------------------------------------------------------------------

async function sendSigningEmail(to: string, formTitle: string, signingUrl: string) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn(`[signing] RESEND_API_KEY not set — skipping email to ${to}`);
        return;
    }
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const from = process.env.EMAIL_FROM ?? "Greenlight USDOT <noreply@greenlightdot.com>";

    await resend.emails.send({
        from,
        to,
        subject: `Action Required: Sign "${formTitle}"`,
        html: `
            <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:2rem">
                <div style="text-align:center;margin-bottom:1.5rem">
                    <h2 style="color:#0f172a;margin:0">Signature Required</h2>
                </div>
                <p style="color:#475569;line-height:1.6">
                    Your employer has prepared a DOT compliance document that requires your signature:
                </p>
                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:1rem;margin:1rem 0">
                    <strong style="color:#15803d">${formTitle}</strong>
                </div>
                <p style="color:#475569;line-height:1.6">
                    Click the button below to review and sign. No account or login required.
                </p>
                <div style="text-align:center;margin:1.5rem 0">
                    <a href="${signingUrl}"
                       style="display:inline-block;padding:0.75rem 2rem;background:#16a34a;color:white;
                              text-decoration:none;border-radius:8px;font-weight:600;font-size:1rem">
                        Review &amp; Sign Document
                    </a>
                </div>
                <p style="color:#94a3b8;font-size:0.8rem;line-height:1.5">
                    This link expires in 7 days. If you have questions about this document, contact your employer directly.
                </p>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:1.5rem 0" />
                <p style="color:#94a3b8;font-size:0.75rem;text-align:center">
                    Sent via Greenlight USDOT &mdash; DOT Compliance Made Simple
                </p>
            </div>
        `,
    });
}
