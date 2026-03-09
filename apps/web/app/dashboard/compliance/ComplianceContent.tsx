"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Shield,
    Users,
    Truck,
    Clock,
    FileText,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Circle,
    ChevronDown,
    Download,
    Activity,
    ArrowRight,
    ClipboardList,
    Info,
    RefreshCw,
    X,
} from "lucide-react";
import styles from "./page.module.css";
import { useDemoMode } from "../../components/DemoModeContext";
import EmptyState from "../../components/EmptyState";
import type { ComplianceScores } from "../../actions/compliance";
import { humanize, humanizeRegulation } from "../../../lib/plain-english";
import { downloadComplianceReport } from "../../../lib/pdf";
import { completeComplianceReview } from "../../actions/company";

// --- Demo mock data ---
const mockScores: ComplianceScores = {
    overall: 89,
    categories: [
        {
            name: "Driver Qualification", score: 92,
            items: [
                { label: "License Current — John Smith", regulation: "49 CFR 391.11", status: "compliant", detail: "45 days remaining" },
                { label: "Medical Certificate — John Smith", regulation: "49 CFR 391.43", status: "compliant", detail: "120 days remaining" },
                { label: "MVR on File — John Smith", regulation: "49 CFR 391.25", status: "compliant", detail: "On file" },
                { label: "License Current — Sarah Wilson", regulation: "49 CFR 391.11", status: "compliant", detail: "90 days remaining" },
                { label: "Medical Certificate — Sarah Wilson", regulation: "49 CFR 391.43", status: "action_needed", detail: "28 days remaining" },
                { label: "MVR on File — Sarah Wilson", regulation: "49 CFR 391.25", status: "action_needed", detail: "Missing — annual driving record required" },
                { label: "Clearinghouse Query — Mike Johnson", regulation: "49 CFR 382.701", status: "compliant", detail: "200 days until next required" },
                { label: "Employment Application — Emily Brown", regulation: "49 CFR 391.21", status: "compliant", detail: "On file" },
            ],
        },
        {
            name: "Vehicle Maintenance", score: 78,
            items: [
                { label: "Annual Inspection — Unit 101", regulation: "49 CFR 396.17", status: "compliant", detail: "42 days remaining" },
                { label: "Annual Inspection — Unit 102", regulation: "49 CFR 396.17", status: "compliant", detail: "88 days remaining" },
                { label: "Annual Inspection — Unit 103", regulation: "49 CFR 396.17", status: "expired", detail: "Overdue by 12 days" },
                { label: "Preventive Maintenance — Unit 101", regulation: "49 CFR 396.3", status: "compliant", detail: "20 days until next PM" },
                { label: "Registration — T-201", regulation: "State Law", status: "compliant", detail: "90 days remaining" },
            ],
        },
        {
            name: "Drug & Alcohol", score: 100,
            items: [
                { label: "Pre-Employment Test — John Smith", regulation: "49 CFR 382.301", status: "compliant", detail: "On file" },
                { label: "Drug Testing Authorization — John Smith", regulation: "49 CFR 382.703", status: "compliant", detail: "On file" },
                { label: "Pre-Employment Test — Sarah Wilson", regulation: "49 CFR 382.301", status: "compliant", detail: "On file" },
                { label: "Drug Testing Authorization — Sarah Wilson", regulation: "49 CFR 382.703", status: "compliant", detail: "On file" },
            ],
        },
        {
            name: "Company & Authority", score: 85,
            items: [
                { label: "Operating Authority on File", regulation: "49 CFR 365", status: "compliant", detail: "On file" },
                { label: "Legal Agent Designation", regulation: "49 CFR 366", status: "compliant", detail: "On file" },
                { label: "Federal Business Update", regulation: "49 CFR 390.19", status: "action_needed", detail: "Due in 45 days" },
                { label: "Annual Federal Registration", regulation: "49 CFR 367", status: "compliant", detail: "Current" },
                { label: "Insurance Policy on File", regulation: "49 CFR 387", status: "compliant", detail: "On file" },
                { label: "Fuel Tax License", regulation: "IFTA Agreement", status: "compliant", detail: "On file" },
            ],
        },
    ],
    summary: { totalItems: 23, compliant: 19, actionNeeded: 3, expired: 1 },
};

// Map category names to friendly display names
const categoryDisplayNames: Record<string, string> = {
    "Driver Qualification": "Driver Records",
    "Company & Authority": "Business Filings",
    "Drug & Alcohol": "Drug & Alcohol Testing",
    "Vehicle Maintenance": "Vehicle Maintenance",
};

const categoryIcons: Record<string, React.ElementType> = {
    "Driver Qualification": Users,
    "Vehicle Maintenance": Truck,
    "Drug & Alcohol": Activity,
    "Company & Authority": FileText,
};

const categoryIconClasses: Record<string, string> = {
    "Driver Qualification": "federal",
    "Vehicle Maintenance": "vehicle",
    "Drug & Alcohol": "safety",
    "Company & Authority": "federal",
};


function getStatusIcon(status: string) {
    switch (status) {
        case "compliant": return <CheckCircle size={14} />;
        case "action_needed": return <AlertTriangle size={14} />;
        case "expired": return <XCircle size={14} />;
        default: return <Circle size={14} />;
    }
}

function getScoreClass(score: number) {
    if (score >= 90) return "excellent";
    if (score >= 75) return "good";
    if (score >= 50) return "warning";
    return "danger";
}

// Map status names to CSS class names (compliant, actionNeeded, expired)
function statusToCss(s: string): string {
    if (s === "action_needed") return "actionNeeded";
    return s;
}


// Determine the action link for a compliance item based on its label
function getActionForItem(item: { label: string; status: string; driverId?: string; vehicleId?: string }): { href: string; label: string } | null {
    if (item.status === "compliant" || item.status === "not_applicable") return null;
    const lower = item.label.toLowerCase();
    const driverParam = item.driverId ? `&driver=${item.driverId}` : "";
    const vehicleParam = item.vehicleId ? `&vehicle=${item.vehicleId}` : "";

    // Driver-related items — link to the specific driver's page to update expiration dates
    if (lower.includes("license current") || lower.includes("cdl")) {
        return { href: item.driverId ? `/dashboard/drivers/${item.driverId}` : "/dashboard/drivers", label: "Update Driver" };
    }
    if (lower.includes("medical certificate")) {
        return { href: item.driverId ? `/dashboard/drivers/${item.driverId}` : "/dashboard/drivers", label: "Update Driver" };
    }

    // Clearinghouse query — link to the driver's page to update the query date
    if (lower.includes("clearinghouse query") || lower.includes("drug testing database check")) {
        return { href: item.driverId ? `/dashboard/drivers/${item.driverId}` : "/dashboard/drivers", label: "Update Driver" };
    }
    if (lower.includes("clearinghouse consent") || lower.includes("drug testing authorization")) {
        return { href: `/dashboard/documents/wizard?form=drugAlcoholPolicy${driverParam}`, label: "Get Consent" };
    }

    // MVR / Employment app — link to wizard for filling out with driver pre-selected
    if (lower.includes("mvr") || lower.includes("driving record")) {
        return { href: `/dashboard/documents/wizard?form=annualMVRReview${driverParam}`, label: "Fill Out Form" };
    }
    if (lower.includes("employment application")) {
        return { href: `/dashboard/documents/wizard?form=driverApp${driverParam}`, label: "Fill Out Form" };
    }

    // Drug test — upload the result with driver context
    if (lower.includes("pre-employment test") || lower.includes("drug test")) {
        const params = new URLSearchParams({ upload: "DRUG_TEST_RESULT" });
        if (item.driverId) params.set("driver", item.driverId);
        return { href: `/dashboard/documents?${params.toString()}`, label: "Upload Result" };
    }

    // Vehicle items — link to specific vehicle page to set dates
    if (lower.includes("annual inspection")) {
        return { href: item.vehicleId ? `/dashboard/vehicles/${item.vehicleId}` : "/dashboard/vehicles", label: "Update Vehicle" };
    }
    if (lower.includes("preventive maintenance")) {
        return { href: item.vehicleId ? `/dashboard/vehicles/${item.vehicleId}` : "/dashboard/vehicles", label: "Update Vehicle" };
    }
    if (lower.includes("registration") && !lower.includes("federal registration")) {
        return { href: item.vehicleId ? `/dashboard/vehicles/${item.vehicleId}` : "/dashboard/vehicles", label: "Update Vehicle" };
    }

    // Company docs — link to wizard for fillable forms, or documents page for uploads with specific type
    if (lower.includes("mcs-150") || lower.includes("federal business update")) {
        return { href: "/dashboard/documents/wizard?form=mcs150", label: "Fill Out Form" };
    }
    if (lower.includes("boc-3") || lower.includes("legal agent")) {
        return { href: "/dashboard/documents/wizard?form=boc3", label: "Fill Out Form" };
    }
    if (lower.includes("operating authority")) {
        return { href: "/dashboard/documents?upload=OPERATING_AUTHORITY", label: "Upload Doc" };
    }
    if (lower.includes("ucr") || lower.includes("federal registration")) {
        return { href: "/dashboard/documents?upload=UCR", label: "Upload Doc" };
    }
    if (lower.includes("insurance")) {
        return { href: "/dashboard/documents?upload=INSURANCE_POLICY", label: "Upload Doc" };
    }
    if (lower.includes("ifta") || lower.includes("fuel tax")) {
        return { href: "/dashboard/documents?upload=IFTA_LICENSE", label: "Upload Doc" };
    }

    return { href: "/dashboard/documents", label: "Take Action" };
}

/** De-jargon an item label: replace known terms inline */
function friendlyLabel(label: string): string {
    return label
        .replace("MVR on File", "Driving Record on File")
        .replace("Clearinghouse Consent", "Drug Testing Authorization")
        .replace("Clearinghouse Query", "Drug Testing Database Check")
        .replace("BOC-3 Process Agent", "Legal Agent Designation")
        .replace("MCS-150 Biennial Update", "Federal Business Update")
        .replace("Unified Carrier Registration (UCR)", "Annual Federal Registration")
        .replace("IFTA License", "Fuel Tax License");
}

// ---------------------------------------------------------------------------
// Compliance Review Questionnaire
// ---------------------------------------------------------------------------

const reviewQuestions = [
    {
        id: "fleet",
        question: "Has your fleet changed?",
        description: "Added or removed vehicles, trailers, or changed vehicle types",
        settingsField: null,
    },
    {
        id: "interstate",
        question: "Did your travel change?",
        description: "Started or stopped crossing state lines (affects fuel tax, UCR, and other registrations)",
        settingsField: "operationScope",
    },
    {
        id: "forhire",
        question: "Changed who you haul for?",
        description: "Started or stopped hauling for other businesses (affects operating authority requirements)",
        settingsField: "operationType",
    },
    {
        id: "hazmat",
        question: "Any hazmat changes?",
        description: "Started or stopped carrying hazardous materials",
        settingsField: "hazmat",
    },
    {
        id: "drivers",
        question: "Any driver changes?",
        description: "New CDL drivers, or drivers who changed license type (CDL to regular or vice versa)",
        settingsField: null,
    },
];

function ComplianceReviewModal({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
    const router = useRouter();
    const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(false);

    const allAnswered = reviewQuestions.every(q => answers[q.id] !== undefined && answers[q.id] !== null);
    const hasYes = Object.values(answers).some(v => v === true);

    const handleSubmit = async () => {
        setSaving(true);
        await completeComplianceReview();
        setSaving(false);

        if (hasYes) {
            // Redirect to settings to update
            router.push("/dashboard/settings");
            onClose();
        } else {
            setDone(true);
            setTimeout(() => {
                onComplete();
            }, 2000);
        }
    };

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
        }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div style={{
                background: "white", borderRadius: "16px", width: "100%", maxWidth: 520,
                maxHeight: "90vh", overflow: "auto", padding: "1.75rem",
                boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <div>
                        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                            Quick Compliance Check-In
                        </h2>
                        <p style={{ fontSize: "0.8rem", color: "#64748b", margin: "0.25rem 0 0" }}>
                            Has anything changed since your last review? This takes about 30 seconds.
                        </p>
                    </div>
                    <button onClick={onClose} style={{
                        border: "none", background: "none", cursor: "pointer",
                        color: "#94a3b8", padding: "0.25rem",
                    }}>
                        <X size={20} />
                    </button>
                </div>

                {done ? (
                    <div style={{
                        textAlign: "center", padding: "2rem 1rem",
                    }}>
                        <CheckCircle size={48} style={{ color: "#22c55e", marginBottom: "0.75rem" }} />
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#0f172a", margin: "0 0 0.25rem" }}>
                            All good!
                        </h3>
                        <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                            Your compliance profile is up to date. We&apos;ll check in again in 6 months.
                        </p>
                    </div>
                ) : (
                    <>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                            {reviewQuestions.map(q => (
                                <div key={q.id} style={{
                                    padding: "0.75rem 1rem", borderRadius: "10px",
                                    border: `1px solid ${answers[q.id] === true ? "#fde68a" : answers[q.id] === false ? "#bbf7d0" : "#e2e8f0"}`,
                                    background: answers[q.id] === true ? "#fffbeb" : answers[q.id] === false ? "#f0fdf4" : "white",
                                    transition: "all 0.15s ease",
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#0f172a" }}>{q.question}</div>
                                            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.15rem", lineHeight: 1.4 }}>{q.description}</div>
                                        </div>
                                        <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}>
                                            <button
                                                onClick={() => setAnswers(prev => ({ ...prev, [q.id]: false }))}
                                                style={{
                                                    padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600,
                                                    border: `1.5px solid ${answers[q.id] === false ? "#16a34a" : "#e2e8f0"}`,
                                                    background: answers[q.id] === false ? "#dcfce7" : "white",
                                                    color: answers[q.id] === false ? "#15803d" : "#64748b",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                No
                                            </button>
                                            <button
                                                onClick={() => setAnswers(prev => ({ ...prev, [q.id]: true }))}
                                                style={{
                                                    padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600,
                                                    border: `1.5px solid ${answers[q.id] === true ? "#d97706" : "#e2e8f0"}`,
                                                    background: answers[q.id] === true ? "#fef3c7" : "white",
                                                    color: answers[q.id] === true ? "#92400e" : "#64748b",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Yes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {hasYes && (
                            <div style={{
                                marginTop: "0.75rem", padding: "0.6rem 0.85rem", borderRadius: "8px",
                                background: "#fffbeb", border: "1px solid #fde68a",
                                fontSize: "0.78rem", color: "#92400e",
                            }}>
                                Since something changed, we&apos;ll take you to Settings after completing this review so you can update your company profile. Your compliance items will automatically adjust.
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={!allAnswered || saving}
                            style={{
                                width: "100%", marginTop: "1rem",
                                padding: "0.65rem", borderRadius: "10px", border: "none",
                                background: allAnswered ? "linear-gradient(135deg, #165C30, #0F2E1A)" : "#e2e8f0",
                                color: allAnswered ? "white" : "#94a3b8",
                                fontWeight: 600, fontSize: "0.9rem", cursor: allAnswered ? "pointer" : "not-allowed",
                                opacity: saving ? 0.7 : 1,
                            }}
                        >
                            {saving ? "Saving..." : hasYes ? "Complete & Go to Settings" : "Looks Good — Complete Review"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ComplianceContent({
    scores,
    lastReviewAt,
    openReview,
}: {
    scores: ComplianceScores | null;
    lastReviewAt?: string | null;
    openReview?: boolean;
}) {
    const { isDemoMode } = useDemoMode();
    const data = isDemoMode ? mockScores : scores;
    const router = useRouter();

    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["Driver Qualification", "Vehicle Maintenance"]));
    const [showReview, setShowReview] = useState(false);

    // Auto-open review modal if ?review=true
    useEffect(() => {
        if (openReview) setShowReview(true);
    }, [openReview]);

    if (!data || (!isDemoMode && data.summary.totalItems === 0)) {
        return (
            <div style={{ padding: "2rem" }}>
                <header style={{ marginBottom: "1rem" }}>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Compliance Overview</h1>
                    <p style={{ color: "#64748b" }}>Track your DOT compliance status across all categories</p>
                </header>
                <EmptyState
                    icon={Shield}
                    title="No compliance data yet"
                    description="Add drivers and vehicles to see your real compliance scores. Each driver and vehicle is automatically checked against federal regulations."
                    primaryAction={{ label: "Start Compliance Assessment", href: "/dashboard/documents/wizard" }}
                    secondaryAction={{ label: "Add Drivers", href: "/dashboard/drivers/new" }}
                />
            </div>
        );
    }

    const toggleCategory = (name: string) => {
        setExpandedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name);
            else next.add(name);
            return next;
        });
    };

    // Build score overview cards from categories
    const scoreCards = data.categories.map((cat) => ({
        name: cat.name,
        displayName: categoryDisplayNames[cat.name] ?? cat.name,
        score: cat.score,
        status: cat.score >= 90 ? "compliant" as const : cat.score >= 50 ? "attention" as const : "critical" as const,
    }));

    return (
        <div className={styles.compliance}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Compliance Checklist</h1>
                    <p className={styles.subtitle}>
                        {isDemoMode
                            ? "Federal & state DOT compliance requirements for your fleet"
                            : `Overall compliance: ${data.overall}% — ${data.summary.compliant} compliant, ${data.summary.actionNeeded} need attention, ${data.summary.expired} expired`}
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <button
                        onClick={() => setShowReview(true)}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "0.35rem",
                            padding: "0.55rem 0.9rem", borderRadius: "8px",
                            background: "white", border: "1px solid #e2e8f0",
                            color: "#475569", fontWeight: 600, fontSize: "0.8rem",
                            cursor: "pointer", whiteSpace: "nowrap",
                        }}
                    >
                        <RefreshCw size={14} />
                        Something Changed?
                    </button>
                    <Link
                        href="/dashboard/documents/wizard"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "0.4rem",
                            padding: "0.55rem 0.9rem", borderRadius: "8px",
                            background: "linear-gradient(135deg, #165C30, #0F2E1A)",
                            color: "white", fontWeight: 600, fontSize: "0.8rem",
                            textDecoration: "none", whiteSpace: "nowrap",
                            boxShadow: "0 4px 14px rgba(15, 46, 26, 0.35)",
                        }}
                    >
                        <ClipboardList size={16} />
                        Run Compliance Assessment
                    </Link>
                    <button
                        className={styles.downloadBtn}
                        onClick={() => downloadComplianceReport(data)}
                    >
                        <Download size={16} /> Export Report
                    </button>
                </div>
            </div>

            {/* Urgent Filing Callouts — prominent banners for company filings that need action */}
            {!isDemoMode && data.categories
                .filter(c => c.name === "Company & Authority")
                .flatMap(c => c.items.filter(i => i.status === "action_needed" || i.status === "expired"))
                .map((item, idx) => {
                    const action = getActionForItem(item);
                    const isExpired = item.status === "expired";
                    return (
                        <div key={`filing-${idx}`} style={{
                            display: "flex", alignItems: "center", gap: "0.75rem",
                            padding: "0.85rem 1.25rem", borderRadius: "12px",
                            marginBottom: "0.5rem",
                            background: isExpired ? "linear-gradient(135deg, #fef2f2, #fee2e2)" : "linear-gradient(135deg, #fffbeb, #fef3c7)",
                            border: `1px solid ${isExpired ? "#fecaca" : "#fde68a"}`,
                        }}>
                            {isExpired ? (
                                <XCircle size={22} style={{ color: "#dc2626", flexShrink: 0 }} />
                            ) : (
                                <AlertTriangle size={22} style={{ color: "#d97706", flexShrink: 0 }} />
                            )}
                            <div style={{ flex: 1 }}>
                                <span style={{ fontWeight: 700, fontSize: "0.9rem", color: isExpired ? "#991b1b" : "#92400e" }}>
                                    {friendlyLabel(item.label)}
                                </span>
                                <span style={{ display: "block", fontSize: "0.78rem", color: isExpired ? "#b91c1c" : "#a16207", marginTop: "0.1rem" }}>
                                    {item.detail}
                                    {item.reason ? ` — ${item.reason}` : ""}
                                </span>
                            </div>
                            {action && (
                                <Link href={action.href} style={{
                                    padding: "0.4rem 0.85rem", borderRadius: "8px",
                                    background: isExpired ? "#dc2626" : "#d97706",
                                    color: "white", fontSize: "0.8rem", fontWeight: 600,
                                    textDecoration: "none", whiteSpace: "nowrap",
                                    display: "inline-flex", alignItems: "center", gap: "0.3rem",
                                }}>
                                    {action.label} <ArrowRight size={14} />
                                </Link>
                            )}
                        </div>
                    );
                })
            }

            {/* Last review timestamp */}
            {!isDemoMode && lastReviewAt && (
                <div style={{
                    display: "flex", alignItems: "center", gap: "0.4rem",
                    marginBottom: "0.5rem", fontSize: "0.78rem", color: "#94a3b8",
                }}>
                    <CheckCircle size={13} />
                    Last compliance review: {new Date(lastReviewAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
            )}

            {/* Demo data banner */}
            {isDemoMode && (
                <div style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.6rem 1rem", borderRadius: "8px",
                    background: "#f1f5f9", border: "1px dashed #cbd5e1",
                    color: "#64748b", fontSize: "0.82rem", marginBottom: "0.75rem",
                }}>
                    <Info size={16} />
                    You&apos;re viewing sample data. Add your drivers and vehicles to see real compliance info.
                </div>
            )}

            {/* Score Overview Cards */}
            <div className={isDemoMode ? "demoWrapper" : ""} style={isDemoMode ? { marginBottom: "1rem" } : {}}>
                <div className={styles.scoreOverview}>
                    {scoreCards.map((cat) => {
                        const scoreClass = getScoreClass(cat.score);
                        return (
                            <div key={cat.name} className={styles.scoreCard}>
                                <div
                                    className={`${styles.scoreCircle} ${styles[scoreClass]}`}
                                    style={{ "--pct": cat.score } as React.CSSProperties}
                                >
                                    <div className={styles.scoreInner}>{cat.score}%</div>
                                </div>
                                <div className={styles.scoreInfo}>
                                    <div className={styles.scoreName}>{cat.displayName}</div>
                                    <div className={`${styles.scoreStatus} ${styles[cat.status]}`}>
                                        {cat.status === "compliant" ? "Compliant" :
                                            cat.status === "attention" ? "Needs Attention" : "Critical"}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Federal Requirements */}
            <div className={isDemoMode ? "demoWrapper" : ""}>
                <div className={styles.categorySection}>
                    {data.categories.map((category) => {
                        const isExpanded = expandedCategories.has(category.name);
                        const Icon = categoryIcons[category.name] ?? Shield;
                        const iconClass = categoryIconClasses[category.name] ?? "federal";
                        const displayName = categoryDisplayNames[category.name] ?? category.name;

                        return (
                            <div key={category.name} className={styles.category}>
                                <div className={styles.categoryHeader} onClick={() => toggleCategory(category.name)}>
                                    <div className={styles.categoryLeft}>
                                        <div className={`${styles.categoryIcon} ${styles[iconClass]}`}>
                                            <Icon size={22} />
                                        </div>
                                        <div>
                                            <div className={styles.categoryName}>{displayName}</div>
                                            <div className={styles.categoryDesc}>
                                                {category.items.filter((i) => i.status === "compliant").length} of {category.items.filter((i) => i.status !== "not_applicable").length} items compliant
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.categoryRight}>
                                        <div className={styles.categoryProgress}>
                                            <div className={styles.progressBar}>
                                                <div
                                                    className={`${styles.progressFill} ${styles[getScoreClass(category.score)]}`}
                                                    style={{ width: `${category.score}%` }}
                                                />
                                            </div>
                                            <span>{category.score}%</span>
                                        </div>
                                        <ChevronDown
                                            size={18}
                                            className={`${styles.chevron} ${isExpanded ? styles.rotated : ""}`}
                                        />
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className={styles.categoryItems}>
                                        {category.items.map((item, idx) => {
                                            const cssStatus = statusToCss(item.status);
                                            const action = getActionForItem(item);
                                            const isClickable = !!action;
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`${styles.checklistItem} ${isClickable ? styles.checklistItemClickable : ""}`}
                                                    onClick={isClickable ? () => router.push(action.href) : undefined}
                                                    role={isClickable ? "link" : undefined}
                                                >
                                                    <div className={`${styles.itemIcon} ${styles[cssStatus]}`}>
                                                        {getStatusIcon(item.status)}
                                                    </div>
                                                    <div className={styles.itemContent}>
                                                        <div className={styles.itemName}>{friendlyLabel(item.label)}</div>
                                                        <div className={styles.itemDetail}>
                                                            {item.detail}
                                                            {item.regulation && (
                                                                <span
                                                                    title={item.regulation}
                                                                    style={{ marginLeft: "0.5rem", color: "#cbd5e1", fontSize: "0.7rem", cursor: "help" }}
                                                                >
                                                                    {humanizeRegulation(item.regulation)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {item.reason && (
                                                            <div style={{
                                                                fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.15rem",
                                                                fontStyle: "italic", lineHeight: 1.4,
                                                            }}>
                                                                {item.reason}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                                                        <span className={`${styles.itemBadge} ${styles[cssStatus]}`}>
                                                            {item.status === "compliant" ? "Compliant" :
                                                                item.status === "action_needed" ? "Needs Attention" :
                                                                    item.status === "expired" ? "Expired" : "N/A"}
                                                        </span>
                                                        {action && (
                                                            <Link
                                                                href={action.href}
                                                                onClick={(e) => e.stopPropagation()}
                                                                style={{
                                                                    display: "inline-flex", alignItems: "center", gap: "0.25rem",
                                                                    padding: "0.3rem 0.6rem", borderRadius: "6px",
                                                                    background: item.status === "expired" ? "#fef2f2" : "#fffbeb",
                                                                    color: item.status === "expired" ? "#dc2626" : "#92400e",
                                                                    fontSize: "0.7rem", fontWeight: 600, textDecoration: "none",
                                                                    border: `1px solid ${item.status === "expired" ? "#fecaca" : "#fef3c7"}`,
                                                                    whiteSpace: "nowrap" as const,
                                                                }}
                                                            >
                                                                {action.label} <ArrowRight size={10} />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Compliance Review Modal */}
            {showReview && (
                <ComplianceReviewModal
                    onClose={() => setShowReview(false)}
                    onComplete={() => {
                        setShowReview(false);
                        router.refresh();
                    }}
                />
            )}

        </div>
    );
}
