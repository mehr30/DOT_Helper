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
    driverName: string | null;
    vehicleName: string | null;
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
        include: {
            driver: { select: { firstName: true, lastName: true } },
            vehicle: { select: { unitNumber: true, make: true, model: true } },
        },
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
        driverName: d.driver ? `${d.driver.firstName} ${d.driver.lastName}` : null,
        vehicleName: d.vehicle ? `Unit ${d.vehicle.unitNumber}${d.vehicle.make ? ` — ${d.vehicle.make} ${d.vehicle.model ?? ""}`.trim() : ""}` : null,
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

// Save a wizard-completed form as a Document in the database
// so the compliance engine can see it
export async function saveWizardFormAsDocument(data: {
    formId: string;
    title: string;
    documentType: string;
    category: "driver" | "vehicle" | "company" | "safety";
    driverId?: string;
    vehicleId?: string;
}) {
    const { companyId, userId } = await requireCompanyUser();

    // Build a unique file name that includes the driver/vehicle association
    const suffix = data.driverId ? `_d_${data.driverId}` : data.vehicleId ? `_v_${data.vehicleId}` : "";
    const fileName = `wizard_${data.formId}${suffix}`;

    // Check if we already have this wizard form saved for this entity
    const existing = await prisma.document.findFirst({
        where: {
            fileName,
            OR: [
                { companyId },
                { driver: { companyId } },
                { vehicle: { companyId } },
            ],
        },
    });

    if (existing) {
        // Update existing record
        await prisma.document.update({
            where: { id: existing.id },
            data: {
                name: data.title,
                documentType: data.documentType as never,
            },
        });
    } else {
        await prisma.document.create({
            data: {
                name: data.title,
                documentType: data.documentType as never,
                fileName,
                fileUrl: "", // No physical file — wizard-generated
                category: data.category,
                driverId: data.driverId || null,
                vehicleId: data.vehicleId || null,
                companyId: !data.driverId && !data.vehicleId ? companyId : null,
                uploadedById: userId,
            },
        });
    }

    revalidatePath("/dashboard/documents");
    revalidatePath("/dashboard/compliance");
    revalidatePath("/dashboard");
    if (data.driverId) revalidatePath(`/dashboard/drivers/${data.driverId}`);
    if (data.vehicleId) revalidatePath(`/dashboard/vehicles/${data.vehicleId}`);
}

// Lightweight driver/vehicle lookups for the wizard auto-fill

export interface WizardDriverOption {
    id: string;
    name: string;
    cdlNumber: string | null;
    cdlState: string | null;
    cdlClass: string | null;
    cdlExpiration: string | null;
    medicalCardExpiration: string | null;
    email: string | null;
    phone: string | null;
    hireDate: string | null;
    endorsements: string[];
}

export interface WizardVehicleOption {
    id: string;
    label: string;
    unitNumber: string;
    vin: string | null;
    make: string | null;
    model: string | null;
    year: number | null;
    licensePlate: string | null;
    licensePlateState: string | null;
}

export async function getDriversForWizard(): Promise<WizardDriverOption[]> {
    const { companyId } = await requireCompanyUser();

    const drivers = await prisma.driver.findMany({
        where: { companyId, status: "ACTIVE" },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            cdlNumber: true,
            cdlState: true,
            cdlClass: true,
            cdlExpiration: true,
            medicalCardExpiration: true,
            email: true,
            phone: true,
            hireDate: true,
            endorsements: true,
        },
        orderBy: { lastName: "asc" },
    });

    return drivers.map(d => ({
        id: d.id,
        name: `${d.firstName} ${d.lastName}`,
        cdlNumber: d.cdlNumber,
        cdlState: d.cdlState,
        cdlClass: d.cdlClass,
        cdlExpiration: d.cdlExpiration?.toISOString().split("T")[0] ?? null,
        medicalCardExpiration: d.medicalCardExpiration?.toISOString().split("T")[0] ?? null,
        email: d.email,
        phone: d.phone,
        hireDate: d.hireDate?.toISOString().split("T")[0] ?? null,
        endorsements: d.endorsements as string[],
    }));
}

export async function getVehiclesForWizard(): Promise<WizardVehicleOption[]> {
    const { companyId } = await requireCompanyUser();

    const vehicles = await prisma.vehicle.findMany({
        where: { companyId, status: { in: ["ACTIVE", "MAINTENANCE"] } },
        select: {
            id: true,
            unitNumber: true,
            vin: true,
            make: true,
            model: true,
            year: true,
            licensePlate: true,
            licensePlateState: true,
        },
        orderBy: { unitNumber: "asc" },
    });

    return vehicles.map(v => ({
        id: v.id,
        label: `Unit ${v.unitNumber}${v.make ? ` — ${v.year ?? ""} ${v.make} ${v.model ?? ""}`.trim() : ""}`,
        unitNumber: v.unitNumber,
        vin: v.vin,
        make: v.make,
        model: v.model,
        year: v.year,
        licensePlate: v.licensePlate,
        licensePlateState: v.licensePlateState,
    }));
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
