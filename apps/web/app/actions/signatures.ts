"use server";

import { prisma } from "@repo/database";
import { requireCompanyUser } from "../../lib/session";
import { put } from "@vercel/blob";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface SignatureData {
    id: string;
    signerName: string;
    signerEmail: string | null;
    signerRole: string | null;
    signatureImageUrl: string;
    signedAt: string;
}

export async function signDocument(data: {
    documentId: string;
    signerName: string;
    signerEmail?: string;
    signerRole?: string;
    signatureDataUrl: string;
}): Promise<{ error?: string }> {
    const { companyId, userId } = await requireCompanyUser();

    // Verify document belongs to this company
    const doc = await prisma.document.findFirst({
        where: {
            id: data.documentId,
            OR: [
                { companyId },
                { driver: { companyId } },
                { vehicle: { companyId } },
            ],
        },
        select: { id: true },
    });

    if (!doc) {
        return { error: "Document not found" };
    }

    // Convert data URL to blob and upload for permanent storage
    let signatureUrl = data.signatureDataUrl;
    try {
        const base64Data = data.signatureDataUrl.split(",")[1];
        if (base64Data) {
            const buffer = Buffer.from(base64Data, "base64");
            const blob = await put(
                `signatures/${userId}/${Date.now()}.png`,
                buffer,
                { access: "public", contentType: "image/png" },
            );
            signatureUrl = blob.url;
        }
    } catch {
        // Fall back to storing data URL if blob upload fails
    }

    // Get IP address for audit trail
    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        hdrs.get("x-real-ip") ?? "unknown";

    await prisma.documentSignature.create({
        data: {
            documentId: data.documentId,
            signerName: data.signerName,
            signerEmail: data.signerEmail || null,
            signerRole: data.signerRole || null,
            signatureImageUrl: signatureUrl,
            ipAddress: ip,
        },
    });

    revalidatePath("/dashboard/documents");
    revalidatePath("/dashboard/drivers");
    revalidatePath("/dashboard/vehicles");

    return {};
}

export async function getDocumentSignatures(documentId: string): Promise<SignatureData[]> {
    const { companyId } = await requireCompanyUser();

    // Verify document belongs to this company
    const doc = await prisma.document.findFirst({
        where: {
            id: documentId,
            OR: [
                { companyId },
                { driver: { companyId } },
                { vehicle: { companyId } },
            ],
        },
        select: { id: true },
    });

    if (!doc) return [];

    const sigs = await prisma.documentSignature.findMany({
        where: { documentId },
        orderBy: { signedAt: "desc" },
    });

    return sigs.map((s) => ({
        id: s.id,
        signerName: s.signerName,
        signerEmail: s.signerEmail,
        signerRole: s.signerRole,
        signatureImageUrl: s.signatureImageUrl,
        signedAt: s.signedAt.toISOString(),
    }));
}
