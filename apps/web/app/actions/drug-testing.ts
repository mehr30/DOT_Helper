"use server";

import { prisma } from "@repo/database";
import { revalidatePath } from "next/cache";
import { requireCompanyUser } from "../../lib/session";

// ── Random Drug & Alcohol Testing Pool ──

/** Get CDL drivers eligible for the random testing pool */
export async function getRandomTestingPool() {
    const { companyId } = await requireCompanyUser();

    const cdlDrivers = await prisma.driver.findMany({
        where: { companyId, status: "ACTIVE", licenseType: "CDL" },
        select: { id: true, firstName: true, lastName: true },
        orderBy: { lastName: "asc" },
    });

    return cdlDrivers;
}

/** Generate random selections for a testing period */
export async function generateRandomSelections(
    period: string,
    testType: "DRUG" | "ALCOHOL" | "BOTH",
) {
    const { companyId } = await requireCompanyUser();

    // Get eligible CDL drivers
    const pool = await prisma.driver.findMany({
        where: { companyId, status: "ACTIVE", licenseType: "CDL" },
        select: { id: true },
    });

    if (pool.length === 0) {
        return { error: "No CDL drivers in the pool" };
    }

    // FMCSA minimums: 50% for drug, 10% for alcohol per year
    // For quarterly selections: ~12.5% drug, ~2.5% alcohol per quarter
    // We select a reasonable portion per quarter to meet the annual minimum
    const rate = testType === "ALCOHOL" ? 0.1 : testType === "DRUG" ? 0.25 : 0.25;
    const selectCount = Math.max(1, Math.ceil(pool.length * rate));

    // Cryptographically random selection (Fisher-Yates shuffle)
    const shuffled = [...pool];
    const randomBytes = new Uint32Array(shuffled.length);
    crypto.getRandomValues(randomBytes);
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (randomBytes[i] ?? 0) % (i + 1);
        const temp = shuffled[i]!;
        shuffled[i] = shuffled[j]!;
        shuffled[j] = temp;
    }
    const selected = shuffled.slice(0, selectCount);

    // Check for existing selections in this period to avoid duplicates
    const existing = await prisma.randomTestSelection.findMany({
        where: { companyId, testingPeriod: period, testType },
        select: { driverId: true },
    });
    const existingDriverIds = new Set(existing.map(e => e.driverId));
    const newSelections = selected.filter(s => !existingDriverIds.has(s.id));

    if (newSelections.length === 0) {
        return { error: "All selected drivers already have selections for this period" };
    }

    await prisma.randomTestSelection.createMany({
        data: newSelections.map(s => ({
            testingPeriod: period,
            testType,
            driverId: s.id,
            companyId,
        })),
    });

    revalidatePath("/dashboard/compliance");
    return { success: true, count: newSelections.length };
}

/** Get selections for a period (or all) */
export async function getSelections(period?: string) {
    const { companyId } = await requireCompanyUser();

    const selections = await prisma.randomTestSelection.findMany({
        where: {
            companyId,
            ...(period ? { testingPeriod: period } : {}),
        },
        include: {
            driver: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return selections.map(s => ({
        id: s.id,
        testingPeriod: s.testingPeriod,
        testType: s.testType,
        driverName: `${s.driver.firstName} ${s.driver.lastName}`,
        driverId: s.driverId,
        status: s.status,
        selectionDate: s.selectionDate.toISOString(),
        testDate: s.testDate?.toISOString() ?? null,
        result: s.result,
        notes: s.notes,
    }));
}

/** Update a selection's status */
export async function updateSelectionStatus(data: {
    id: string;
    status: string;
    testDate?: string;
    result?: string;
    notes?: string;
}) {
    const { companyId } = await requireCompanyUser();

    const existing = await prisma.randomTestSelection.findFirst({
        where: { id: data.id, companyId },
    });
    if (!existing) return { error: "Selection not found" };

    await prisma.randomTestSelection.update({
        where: { id: data.id },
        data: {
            status: data.status,
            ...(data.testDate !== undefined && { testDate: data.testDate ? new Date(data.testDate) : null }),
            ...(data.result !== undefined && { result: data.result || null }),
            ...(data.notes !== undefined && { notes: data.notes || null }),
        },
    });

    revalidatePath("/dashboard/compliance");
    return { success: true };
}

/** Get annual testing stats for compliance check */
export async function getTestingStats() {
    const { companyId } = await requireCompanyUser();
    const year = new Date().getFullYear();
    const yearPrefix = `${year}-`;

    const [cdlCount, selections] = await Promise.all([
        prisma.driver.count({
            where: { companyId, status: "ACTIVE", licenseType: "CDL" },
        }),
        prisma.randomTestSelection.findMany({
            where: {
                companyId,
                testingPeriod: { startsWith: yearPrefix },
            },
            select: { driverId: true, testType: true, status: true },
        }),
    ]);

    const completedDrug = new Set(
        selections.filter(s => s.status === "COMPLETED" && (s.testType === "DRUG" || s.testType === "BOTH"))
            .map(s => s.driverId)
    );
    const completedAlcohol = new Set(
        selections.filter(s => s.status === "COMPLETED" && (s.testType === "ALCOHOL" || s.testType === "BOTH"))
            .map(s => s.driverId)
    );

    return {
        poolSize: cdlCount,
        drugTestedCount: completedDrug.size,
        drugTestedPct: cdlCount > 0 ? Math.round((completedDrug.size / cdlCount) * 100) : 0,
        alcoholTestedCount: completedAlcohol.size,
        alcoholTestedPct: cdlCount > 0 ? Math.round((completedAlcohol.size / cdlCount) * 100) : 0,
        drugTarget: 50,
        alcoholTarget: 10,
    };
}
