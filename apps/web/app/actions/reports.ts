"use server";

import { prisma } from "@repo/database";
import { requireCompanyUser } from "../../lib/session";

// ---------------------------------------------------------------------------
// Report Data Fetching
// ---------------------------------------------------------------------------

export interface DriverReportRow {
    id: string;
    name: string;
    status: string;
    cdlNumber: string | null;
    cdlState: string | null;
    cdlExpiration: string | null;
    cdlDaysLeft: number | null;
    medicalExpiration: string | null;
    medicalDaysLeft: number | null;
    hireDate: string;
    documentCount: number;
    missingDocs: string[];
}

export interface VehicleReportRow {
    id: string;
    unitNumber: string;
    yearMakeModel: string;
    vin: string | null;
    status: string;
    inspectionDue: string | null;
    inspectionDaysLeft: number | null;
    nextPmDue: string | null;
    pmDaysLeft: number | null;
    documentCount: number;
    missingDocs: string[];
}

export interface ReportData {
    companyName: string;
    generatedAt: string;
    drivers: DriverReportRow[];
    vehicles: VehicleReportRow[];
    documentCounts: {
        total: number;
        driverDocs: number;
        vehicleDocs: number;
        companyDocs: number;
        expiringSoon: number;
        expired: number;
    };
    complianceSummary: {
        overall: number;
        driverQualification: number;
        vehicleMaintenance: number;
        drugAlcohol: number;
        companyAuthority: number;
    };
}

function daysUntil(date: Date): number {
    return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export async function getReportData(): Promise<ReportData> {
    const { companyId } = await requireCompanyUser();

    const [company, drivers, vehicles, documents] = await Promise.all([
        prisma.company.findUnique({
            where: { id: companyId },
            select: { name: true },
        }),
        prisma.driver.findMany({
            where: { companyId, status: "ACTIVE" },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                status: true,
                cdlNumber: true,
                cdlState: true,
                cdlExpiration: true,
                medicalCardExpiration: true,
                hireDate: true,
                documents: {
                    select: { documentType: true },
                },
            },
            orderBy: { lastName: "asc" },
        }),
        prisma.vehicle.findMany({
            where: { companyId, status: { in: ["ACTIVE", "MAINTENANCE"] } },
            select: {
                id: true,
                unitNumber: true,
                make: true,
                model: true,
                year: true,
                vin: true,
                status: true,
                annualInspectionDue: true,
                nextPmDue: true,
                documents: {
                    select: { documentType: true },
                },
            },
            orderBy: { unitNumber: "asc" },
        }),
        prisma.document.findMany({
            where: {
                OR: [
                    { companyId },
                    { driver: { companyId } },
                    { vehicle: { companyId } },
                ],
            },
            select: {
                driverId: true,
                vehicleId: true,
                companyId: true,
                expirationDate: true,
            },
        }),
    ]);

    const now = new Date();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    const requiredDriverDocs = ["CDL", "MEDICAL_CERTIFICATE", "EMPLOYMENT_APPLICATION", "MVR", "DRUG_TEST_RESULT"];
    const requiredVehicleDocs = ["REGISTRATION", "INSURANCE", "ANNUAL_INSPECTION"];

    const driverRows: DriverReportRow[] = drivers.map(d => {
        const docTypes = new Set(d.documents.map(doc => doc.documentType as string));
        const missing = requiredDriverDocs.filter(t => !docTypes.has(t));
        const missingLabels = missing.map(t => {
            switch (t) {
                case "CDL": return "License copy";
                case "MEDICAL_CERTIFICATE": return "DOT physical card";
                case "EMPLOYMENT_APPLICATION": return "Employment application";
                case "MVR": return "MVR / Driving record";
                case "DRUG_TEST_RESULT": return "Drug test result";
                default: return t;
            }
        });

        return {
            id: d.id,
            name: `${d.firstName} ${d.lastName}`,
            status: d.status,
            cdlNumber: d.cdlNumber,
            cdlState: d.cdlState,
            cdlExpiration: d.cdlExpiration?.toISOString() ?? null,
            cdlDaysLeft: d.cdlExpiration ? daysUntil(d.cdlExpiration) : null,
            medicalExpiration: d.medicalCardExpiration?.toISOString() ?? null,
            medicalDaysLeft: d.medicalCardExpiration ? daysUntil(d.medicalCardExpiration) : null,
            hireDate: d.hireDate.toISOString(),
            documentCount: d.documents.length,
            missingDocs: missingLabels,
        };
    });

    const vehicleRows: VehicleReportRow[] = vehicles.map(v => {
        const docTypes = new Set(v.documents.map(doc => doc.documentType as string));
        const missing = requiredVehicleDocs.filter(t => !docTypes.has(t));
        const missingLabels = missing.map(t => {
            switch (t) {
                case "REGISTRATION": return "Registration";
                case "INSURANCE": return "Insurance";
                case "ANNUAL_INSPECTION": return "Inspection report";
                default: return t;
            }
        });

        return {
            id: v.id,
            unitNumber: v.unitNumber,
            yearMakeModel: [v.year, v.make, v.model].filter(Boolean).join(" "),
            vin: v.vin,
            status: v.status,
            inspectionDue: v.annualInspectionDue?.toISOString() ?? null,
            inspectionDaysLeft: v.annualInspectionDue ? daysUntil(v.annualInspectionDue) : null,
            nextPmDue: v.nextPmDue?.toISOString() ?? null,
            pmDaysLeft: v.nextPmDue ? daysUntil(v.nextPmDue) : null,
            documentCount: v.documents.length,
            missingDocs: missingLabels,
        };
    });

    // Count document stats
    const expiringSoon = documents.filter(d =>
        d.expirationDate && d.expirationDate > now && (d.expirationDate.getTime() - now.getTime()) < thirtyDays
    ).length;
    const expired = documents.filter(d => d.expirationDate && d.expirationDate < now).length;

    // Simple compliance scores
    const dqItems = driverRows.flatMap(d => {
        const items: boolean[] = [];
        if (d.cdlExpiration) items.push(d.cdlDaysLeft !== null && d.cdlDaysLeft > 0);
        if (d.medicalExpiration) items.push(d.medicalDaysLeft !== null && d.medicalDaysLeft > 0);
        items.push(d.missingDocs.length === 0);
        return items;
    });
    const vmItems = vehicleRows.map(v => {
        return (v.inspectionDaysLeft === null || v.inspectionDaysLeft > 0) && v.missingDocs.length === 0;
    });

    const dqScore = dqItems.length > 0 ? Math.round((dqItems.filter(Boolean).length / dqItems.length) * 100) : 100;
    const vmScore = vmItems.length > 0 ? Math.round((vmItems.filter(Boolean).length / vmItems.length) * 100) : 100;
    const overall = dqItems.length + vmItems.length > 0
        ? Math.round(([...dqItems, ...vmItems].filter(Boolean).length / [...dqItems, ...vmItems].length) * 100)
        : 100;

    return {
        companyName: company?.name ?? "Your Company",
        generatedAt: now.toISOString(),
        drivers: driverRows,
        vehicles: vehicleRows,
        documentCounts: {
            total: documents.length,
            driverDocs: documents.filter(d => d.driverId).length,
            vehicleDocs: documents.filter(d => d.vehicleId).length,
            companyDocs: documents.filter(d => d.companyId).length,
            expiringSoon,
            expired,
        },
        complianceSummary: {
            overall,
            driverQualification: dqScore,
            vehicleMaintenance: vmScore,
            drugAlcohol: 100,
            companyAuthority: 100,
        },
    };
}
