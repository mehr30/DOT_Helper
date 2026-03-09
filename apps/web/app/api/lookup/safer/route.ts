import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/lookup/safer?dot=XXXXXXX
 *
 * Queries the FMCSA SAFER Web Services API to look up carrier information
 * by USDOT number. Returns company name, address, MC number, and
 * operation classification so onboarding can auto-populate fields.
 */

const FMCSA_API_KEY = "fe1988b215cfc307fd41a8f71c2e41659ec82352";
const FMCSA_BASE = "https://mobile.fmcsa.dot.gov/qc/services/carriers";

interface FMCSACarrierResult {
    content?: {
        carrier?: {
            legalName?: string;
            dbaName?: string;
            dotNumber?: number;
            mcNumber?: string;
            phyStreet?: string;
            phyCity?: string;
            phyState?: string;
            phyZipcode?: string;
            phone?: string;
            email?: string;
            carrierOperation?: string; // e.g. "A" = Auth For Hire, "B" = Exempt For Hire, "C" = Private
            hmFlag?: string;
            statusCode?: string;
            oosDate?: string;
            // Operation classification fields
            authForHire?: string;     // "Y" or "N"
            contractAuth?: string;
            brokerAuth?: string;
            commonAuth?: string;
            privatePassenger?: string;
            privateProperty?: string;
            exemptForHire?: string;
        };
    };
}

function classifyOperationType(carrier: NonNullable<NonNullable<FMCSACarrierResult["content"]>["carrier"]>): string | null {
    if (!carrier) return null;
    const op = carrier.carrierOperation?.toUpperCase();
    // A = Auth For Hire, B = Exempt For Hire, C = Private (Property), D = Private (Passenger)
    if (op === "A") return "FOR_HIRE";
    if (op === "B") return "EXEMPT";
    if (op === "C" || op === "D") return "PRIVATE";

    // Fallback: check individual flags
    if (carrier.authForHire === "Y" || carrier.commonAuth === "Y" || carrier.contractAuth === "Y") return "FOR_HIRE";
    if (carrier.exemptForHire === "Y") return "EXEMPT";
    if (carrier.privateProperty === "Y" || carrier.privatePassenger === "Y") return "PRIVATE";

    return null;
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
        const url = `${FMCSA_BASE}/${dot}?webKey=${FMCSA_API_KEY}`;
        const res = await fetch(url, {
            headers: { Accept: "application/json" },
            next: { revalidate: 3600 }, // cache for 1 hour
        });

        if (!res.ok) {
            if (res.status === 404) {
                return NextResponse.json(
                    { error: "No carrier found for this USDOT number." },
                    { status: 404 }
                );
            }
            return NextResponse.json(
                { error: "FMCSA service temporarily unavailable. Try again later." },
                { status: 502 }
            );
        }

        const data: FMCSACarrierResult = await res.json();
        const carrier = data?.content?.carrier;

        if (!carrier) {
            return NextResponse.json(
                { error: "No carrier found for this USDOT number." },
                { status: 404 }
            );
        }

        // Format MC number (FMCSA may return it without prefix)
        let mcNumber = carrier.mcNumber || null;
        if (mcNumber && !mcNumber.startsWith("MC")) {
            mcNumber = `MC-${mcNumber}`;
        }

        const operationType = classifyOperationType(carrier);

        return NextResponse.json({
            dotNumber: String(carrier.dotNumber || dot),
            name: carrier.legalName || carrier.dbaName || null,
            dbaName: carrier.dbaName || null,
            mcNumber,
            address: carrier.phyStreet || null,
            city: carrier.phyCity || null,
            state: carrier.phyState || null,
            zip: carrier.phyZipcode || null,
            phone: carrier.phone || null,
            email: carrier.email || null,
            operationType,
            operationScope: null, // FMCSA doesn't expose this directly; user picks
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
