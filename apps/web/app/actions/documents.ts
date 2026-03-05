"use server";

import { prisma } from "@repo/database";
import { requireCompanyUser } from "../../lib/session";
import { revalidatePath } from "next/cache";

export interface DocumentData {
    id: string;
    name: string;
    description: string | null;
    documentType: string;
    category: string | null;
    fileName: string;
    fileUrl: string;
    fileSize: number | null;
    mimeType: string | null;
    issueDate: string | null;
    expirationDate: string | null;
    driverId: string | null;
    vehicleId: string | null;
    companyId: string | null;
    createdAt: string;
}

export async function getDocuments(opts?: {
    driverId?: string;
    vehicleId?: string;
    companyOnly?: boolean;
}): Promise<DocumentData[]> {
    const { companyId } = await requireCompanyUser();

    const where: Record<string, unknown> = {};

    if (opts?.driverId) {
        // Verify driver belongs to company
        const driver = await prisma.driver.findFirst({
            where: { id: opts.driverId, companyId },
            select: { id: true },
        });
        if (!driver) return [];
        where.driverId = opts.driverId;
    } else if (opts?.vehicleId) {
        const vehicle = await prisma.vehicle.findFirst({
            where: { id: opts.vehicleId, companyId },
            select: { id: true },
        });
        if (!vehicle) return [];
        where.vehicleId = opts.vehicleId;
    } else if (opts?.companyOnly) {
        where.companyId = companyId;
        where.driverId = null;
        where.vehicleId = null;
    } else {
        // All documents for the company (through driver/vehicle/company relations)
        where.OR = [
            { companyId },
            { driver: { companyId } },
            { vehicle: { companyId } },
        ];
    }

    const docs = await prisma.document.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 200,
    });

    return docs.map((d) => ({
        id: d.id,
        name: d.name,
        description: d.description,
        documentType: d.documentType,
        category: d.category,
        fileName: d.fileName,
        fileUrl: d.fileUrl,
        fileSize: d.fileSize,
        mimeType: d.mimeType,
        issueDate: d.issueDate?.toISOString() ?? null,
        expirationDate: d.expirationDate?.toISOString() ?? null,
        driverId: d.driverId,
        vehicleId: d.vehicleId,
        companyId: d.companyId,
        createdAt: d.createdAt.toISOString(),
    }));
}

export async function createDocumentRecord(data: {
    name: string;
    documentType: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    driverId?: string;
    vehicleId?: string;
    expirationDate?: string;
}) {
    const { companyId, userId } = await requireCompanyUser();

    await prisma.document.create({
        data: {
            name: data.name,
            documentType: data.documentType as never,
            fileName: data.fileName,
            fileUrl: data.fileUrl,
            fileSize: data.fileSize,
            mimeType: data.mimeType,
            driverId: data.driverId || null,
            vehicleId: data.vehicleId || null,
            companyId: !data.driverId && !data.vehicleId ? companyId : null,
            uploadedById: userId,
            expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
        },
    });

    revalidatePath("/dashboard/documents");
    if (data.driverId) revalidatePath(`/dashboard/drivers/${data.driverId}`);
    if (data.vehicleId) revalidatePath(`/dashboard/vehicles/${data.vehicleId}`);
    revalidatePath("/dashboard");
}

export async function deleteDocumentRecord(documentId: string) {
    const { companyId } = await requireCompanyUser();

    // Verify ownership through relations
    const doc = await prisma.document.findFirst({
        where: {
            id: documentId,
            OR: [
                { companyId },
                { driver: { companyId } },
                { vehicle: { companyId } },
            ],
        },
    });

    if (!doc) return { error: "Document not found" };

    await prisma.document.delete({ where: { id: documentId } });

    revalidatePath("/dashboard/documents");
    revalidatePath("/dashboard");
}
