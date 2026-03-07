import { notFound } from "next/navigation";
import { getServerSession } from "../../../../lib/session";
import { prisma } from "@repo/database";
import DriverDetail from "./DriverDetail";

export default async function DriverPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await getServerSession();

    if (!session?.user) {
        notFound();
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { companyId: true },
    });

    if (!user?.companyId) {
        notFound();
    }

    const driver = await prisma.driver.findFirst({
        where: { id, companyId: user.companyId },
        include: {
            documents: {
                orderBy: { createdAt: "desc" },
                take: 50,
                select: {
                    id: true,
                    name: true,
                    documentType: true,
                    expirationDate: true,
                    fileUrl: true,
                    fileName: true,
                    mimeType: true,
                    _count: { select: { signatures: true } },
                },
            },
            violations: {
                orderBy: { violationDate: "desc" },
                take: 10,
                select: { id: true, description: true, violationDate: true, severity: true, resolved: true },
            },
        },
    });

    if (!driver) {
        notFound();
    }

    const serialized = {
        id: driver.id,
        firstName: driver.firstName,
        lastName: driver.lastName,
        email: driver.email,
        phone: driver.phone,
        licenseType: driver.licenseType,
        cdlNumber: driver.cdlNumber,
        cdlState: driver.cdlState,
        cdlClass: driver.cdlClass,
        cdlExpiration: driver.cdlExpiration?.toISOString() ?? null,
        medicalCardExpiration: driver.medicalCardExpiration?.toISOString() ?? null,
        hireDate: driver.hireDate.toISOString(),
        status: driver.status,
        endorsements: driver.endorsements,
        documents: driver.documents.map(d => ({
            id: d.id,
            name: d.name,
            documentType: d.documentType,
            expirationDate: d.expirationDate?.toISOString() ?? null,
            fileUrl: d.fileUrl,
            fileName: d.fileName,
            mimeType: d.mimeType,
            signatureCount: d._count.signatures,
        })),
        violations: driver.violations.map(v => ({
            ...v,
            violationDate: v.violationDate.toISOString(),
        })),
    };

    return <DriverDetail driver={serialized} />;
}
