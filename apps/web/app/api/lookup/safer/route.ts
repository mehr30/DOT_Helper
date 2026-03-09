import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/lookup/safer?dot=XXXXXXX
 *
 * Queries the FMCSA SAFER Web Services API to look up carrier information
 * by USDOT number. Hits 3 endpoints in parallel:
 *   1. /carriers/{dot}                     — name, address, phone, status
 *   2. /carriers/{dot}/docket-numbers      — MC number
 *   3. /carriers/{dot}/operation-classification — for-hire / private / exempt
 *
 * Returns a unified response so onboarding can auto-populate fields.
 */

const FMCSA_API_KEY = process.env.FMCSA_WEB_KEY || "fe1988b215cfc307fd41a8f71c2e41659ec82352";
const FMCSA_BASE = "https://mobile.fmcsa.dot.gov/qc/services/carriers";

// --- Types matching FMCSA JSON responses ---

interface FMCSACarrier {
    legalName?: string;
    dbaName?: string;
    dotNumber?: number;
    phyStreet?: string;
    phyCity?: string;
    phyState?: string;
    phyZipcode?: string;
    phone?: string;
    email?: string;
    hmFlag?: string;
    statusCode?: string;
    allowedToOperate?: string;
    // carrierOperation can be a string ("A") OR an object ({ carrierOperationCode, carrierOperationDesc })
    carrierOperation?: string | {
        carrierOperationCode?: string;
        carrierOperationDesc?: string; // e.g. "Interstate", "Intrastate Only", "Intrastate HM"
    } | null;
}

interface FMCSADocketEntry {
    prefix?: string;       // "MC", "FF", "MX"
    docketNumber?: number;
}

interface FMCSAOperationClass {
    operationClassDesc?: string; // "Authorized For Hire", "Exempt For Hire", "Private(Property)", etc.
    id?: { operationClassId?: number };
}

// --- Helpers ---

function classifyFromOperationDescs(descs: string[]): string | null {
    for (const d of descs) {
        const lower = d.toLowerCase();
        if (lower.includes("authorized for hire") || lower.includes("common") || lower.includes("contract")) {
            return "FOR_HIRE";
        }
        if (lower.includes("exempt")) return "EXEMPT";
        if (lower.includes("private")) return "PRIVATE";
    }
    return null;
}

async function fetchJSON<T>(url: string): Promise<T | null> {
    try {
        const res = await fetch(url, {
            headers: { Accept: "application/json" },
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        return await res.json() as T;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    const dot = request.nextUrl.searchParams.get("dot");

    if (!dot || !/^\d{1,8}$/.test(dot)) {
        return NextResponse.json(
            { error: "Invalid USDOT number. Must be 1-8 digits." },
            { status: 400 }
        );
    }

    try {
        // Hit all three endpoints in parallel
        const key = `webKey=${FMCSA_API_KEY}`;
        const [carrierRes, docketRes, opClassRes] = await Promise.all([
            fetchJSON<{ content?: { carrier?: FMCSACarrier } }>(
                `${FMCSA_BASE}/${dot}?${key}`
            ),
            fetchJSON<{ content?: FMCSADocketEntry[] }>(
                `${FMCSA_BASE}/${dot}/docket-numbers?${key}`
            ),
            fetchJSON<{ content?: FMCSAOperationClass[] }>(
                `${FMCSA_BASE}/${dot}/operation-classification?${key}`
            ),
        ]);

        const carrier = carrierRes?.content?.carrier;

        if (!carrier) {
            return NextResponse.json(
                { error: "No carrier found for this USDOT number." },
                { status: 404 }
            );
        }

        // Extract MC number from docket entries
        let mcNumber: string | null = null;
        const dockets = docketRes?.content;
        if (Array.isArray(dockets)) {
            const mcEntry = dockets.find(d => d.prefix === "MC");
            if (mcEntry?.docketNumber) {
                mcNumber = `MC-${mcEntry.docketNumber}`;
            }
        }

        // Classify operation type from the operation-classification endpoint
        let operationType: string | null = null;
        const opClasses = opClassRes?.content;
        if (Array.isArray(opClasses) && opClasses.length > 0) {
            const descs = opClasses
                .map(c => c.operationClassDesc)
                .filter((d): d is string => !!d);
            operationType = classifyFromOperationDescs(descs);
        }

        // Extract operation scope from carrierOperation (when it's an object with desc)
        let operationScope: string | null = null;
        const carrierOp = carrier.carrierOperation;
        if (carrierOp && typeof carrierOp === "object") {
            const desc = carrierOp.carrierOperationDesc?.toLowerCase() ?? "";
            if (desc.includes("interstate") && desc.includes("intrastate")) {
                operationScope = "BOTH";
            } else if (desc.includes("intrastate")) {
                operationScope = "INTRASTATE";
            } else if (desc.includes("interstate")) {
                operationScope = "INTERSTATE";
            }
        }

        return NextResponse.json({
            dotNumber: String(carrier.dotNumber || dot),
            name: carrier.legalName || carrier.dbaName || null,
            dbaName: carrier.dbaName || null,
            mcNumber,
            address: carrier.phyStreet?.trim() || null,
            city: carrier.phyCity || null,
            state: carrier.phyState || null,
            zip: carrier.phyZipcode || null,
            phone: carrier.phone || null,
            email: carrier.email || null,
            operationType,
            operationScope,
            hazmat: carrier.hmFlag === "Y",
            statusCode: carrier.statusCode || null,
        });
    } catch {
        return NextResponse.json(
            { error: "Failed to reach FMCSA. Check your connection and try again." },
            { status: 502 }
        );
    }
}
