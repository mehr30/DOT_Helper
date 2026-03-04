"use client";

import { useState } from "react";
import {
    Shield,
    Users,
    Truck,
    Clock,
    Beaker,
    FileText,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Circle,
    ChevronDown,
    Download,
    MapPin,
    ClipboardCheck,
    Scale,
    Activity
} from "lucide-react";
import styles from "./page.module.css";
import { useDemoMode } from "../../components/DemoModeContext";
import EmptyState from "../../components/EmptyState";

// Category scores
const categoryScores = [
    { name: "Driver Qualification", score: 92, status: "compliant" as const },
    { name: "Hours of Service", score: 85, status: "compliant" as const },
    { name: "Vehicle Maintenance", score: 78, status: "attention" as const },
    { name: "Drug & Alcohol", score: 100, status: "compliant" as const },
];

// Federal compliance requirements
const federalCategories = [
    {
        id: "dqf",
        name: "Driver Qualification Files (DQF)",
        description: "FMCSA Part 391 — Employment, licensing, and medical requirements",
        icon: Users,
        iconClass: "federal" as const,
        items: [
            { name: "Employment Application (391.21)", detail: "All 5 drivers — complete", status: "compliant" as const, dueDate: null },
            { name: "Motor Vehicle Record (MVR)", detail: "Annual check — 4 of 5 current", status: "actionNeeded" as const, dueDate: "Due: Mar 15, 2026" },
            { name: "Road Test Certificate (391.31)", detail: "All drivers certified", status: "compliant" as const, dueDate: null },
            { name: "CDL Verification", detail: "John Smith CDL expiring soon", status: "actionNeeded" as const, dueDate: "Expires: Feb 15, 2026" },
            { name: "Medical Examiner's Certificate", detail: "All drivers current", status: "compliant" as const, dueDate: null },
            { name: "Certificate of Violations (391.27)", detail: "Annual requirement — 3 pending", status: "actionNeeded" as const, dueDate: "Due: Jan 31, 2026" },
            { name: "Previous Employer Inquiries (391.23)", detail: "Complete for all new hires", status: "compliant" as const, dueDate: null },
            { name: "Drug & Alcohol Background Check", detail: "FMCSA Clearinghouse (drug/alcohol database) queries current", status: "compliant" as const, dueDate: null },
        ],
    },
    {
        id: "hos",
        name: "Hours of Service (HOS)",
        description: "FMCSA Part 395 — Driving and duty time regulations",
        icon: Clock,
        iconClass: "federal" as const,
        items: [
            { name: "ELD Compliance", detail: "All vehicles equipped and registered", status: "compliant" as const, dueDate: null },
            { name: "Daily Log Review", detail: "Reviewed through Mar 1, 2026", status: "compliant" as const, dueDate: null },
            { name: "Supporting Documents", detail: "Toll receipts, fuel records — current", status: "compliant" as const, dueDate: null },
            { name: "14-Hour Rule Compliance", detail: "1 potential violation flagged", status: "actionNeeded" as const, dueDate: "Review needed" },
            { name: "60/70 Hour Rule Tracking", detail: "All drivers within limits", status: "compliant" as const, dueDate: null },
            { name: "Driver Training Records", detail: "HOS training documentation", status: "compliant" as const, dueDate: null },
        ],
    },
    {
        id: "vehicle",
        name: "Vehicle Maintenance (DVIR & PM)",
        description: "FMCSA Part 396 — Inspection, repair, and maintenance standards",
        icon: Truck,
        iconClass: "vehicle" as const,
        items: [
            { name: "Annual DOT Inspection", detail: "Unit 103 — inspection overdue", status: "expired" as const, dueDate: "Was due: Feb 22, 2026" },
            { name: "DVIR Records (Pre/Post Trip)", detail: "All units submitting daily", status: "compliant" as const, dueDate: null },
            { name: "Preventive Maintenance Schedule", detail: "3 units on schedule, 2 upcoming", status: "compliant" as const, dueDate: null },
            { name: "Vehicle Registration", detail: "All registrations current", status: "compliant" as const, dueDate: null },
            { name: "Brake Adjustment Records", detail: "Last checked Jan 2026", status: "compliant" as const, dueDate: null },
            { name: "Tire Inspection Log", detail: "Monthly inspection — current", status: "compliant" as const, dueDate: null },
            { name: "Systematic Maintenance Plan", detail: "Written program on file", status: "compliant" as const, dueDate: null },
        ],
    },
    {
        id: "drug",
        name: "Drug & Alcohol Testing",
        description: "FMCSA Part 382 — Drug & alcohol testing program",
        icon: Activity,
        iconClass: "safety" as const,
        items: [
            { name: "Pre-Employment Testing", detail: "All drivers tested before hire", status: "compliant" as const, dueDate: null },
            { name: "Random Testing Pool", detail: "50% drug / 10% alcohol — enrolled", status: "compliant" as const, dueDate: null },
            { name: "Reasonable Suspicion Training", detail: "Supervisors trained (2 hrs)", status: "compliant" as const, dueDate: null },
            { name: "Clearinghouse Registration", detail: "Your company is registered in the FMCSA drug/alcohol database", status: "compliant" as const, dueDate: null },
            { name: "Annual Driver Query", detail: "All drivers checked for drug/alcohol violations this year", status: "compliant" as const, dueDate: null },
            { name: "Drug & Alcohol Policy", detail: "Written policy distributed to all", status: "compliant" as const, dueDate: null },
        ],
    },
    {
        id: "company",
        name: "Company & Authority Filings",
        description: "FMCSA filings, insurance, and operating authority requirements",
        icon: FileText,
        iconClass: "federal" as const,
        items: [
            { name: "USDOT Number Status", detail: "Active — USDOT 1234567", status: "compliant" as const, dueDate: null },
            { name: "MCS-150 Biennial Update", detail: "Next update due this year", status: "actionNeeded" as const, dueDate: "Due: Jun 2026" },
            { name: "BOC-3 Process Agent", detail: "Filed and current", status: "compliant" as const, dueDate: null },
            { name: "Unified Carrier Registration (UCR)", detail: "2026 registration paid", status: "compliant" as const, dueDate: null },
            { name: "Insurance Filing (BMC-91/BMC-34)", detail: "Minimum $750K liability filed", status: "compliant" as const, dueDate: null },
            { name: "IFTA License", detail: "Current quarter filed", status: "compliant" as const, dueDate: null },
            { name: "Operating Authority (MC Number)", detail: "MC-987654 — Active", status: "compliant" as const, dueDate: null },
        ],
    },
];

// State-specific requirements (Texas as default example)
const stateRequirements = [
    { name: "State DOT Registration", description: "Texas intrastate registration with TxDMV", status: "done" as const },
    { name: "Texas Oversize/Overweight Permits", description: "Annual blanket permit if applicable", status: "done" as const },
    { name: "TCEQ Emissions Compliance", description: "Required in certain counties", status: "todo" as const },
    { name: "State Sales Tax Filing", description: "Quarterly motor fuel tax reporting", status: "done" as const },
    { name: "State Annual Inspection", description: "Annual vehicle safety inspection sticker", status: "done" as const },
    { name: "Intrastate HOS Rules", description: "Texas allows 12-hour driving window for intrastate", status: "done" as const },
];

const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York",
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming"
];

function getStatusIcon(status: string) {
    switch (status) {
        case "compliant": return <CheckCircle size={14} />;
        case "actionNeeded": return <AlertTriangle size={14} />;
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

function getCategoryProgress(items: { status: string }[]) {
    const compliant = items.filter(i => i.status === "compliant").length;
    return Math.round((compliant / items.length) * 100);
}

export default function CompliancePage() {
    const { isDemoMode } = useDemoMode();
    const [selectedState, setSelectedState] = useState("Texas");
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set(["dqf", "vehicle"])
    );

    if (!isDemoMode) {
        return (
            <div style={{ padding: "2rem" }}>
                <header style={{ marginBottom: "1rem" }}>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Compliance Overview</h1>
                    <p style={{ color: "#64748b" }}>Track your DOT compliance status across all categories</p>
                </header>
                <EmptyState
                    icon="🛡️"
                    title="No compliance data yet"
                    description="Run the Compliance Setup to discover which regulations apply to your business. Once set up, your compliance checklist and scores will appear here."
                    primaryAction={{ label: "Start Compliance Setup", href: "/dashboard/documents/wizard" }}
                />
            </div>
        );
    }

    const toggleCategory = (id: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <div className={styles.compliance}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Compliance Checklist</h1>
                    <p className={styles.subtitle}>
                        Federal &amp; state DOT compliance requirements for your fleet
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <select
                        className={styles.stateSelector}
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                    >
                        {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                    <button className={styles.downloadBtn}>
                        <Download size={16} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Score Overview Cards */}
            <div className={styles.scoreOverview}>
                {categoryScores.map((cat) => {
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
                                <div className={styles.scoreName}>{cat.name}</div>
                                <div className={`${styles.scoreStatus} ${styles[cat.status]}`}>
                                    {cat.status === "compliant" ? "Compliant" :
                                        cat.status === "attention" ? "Needs Attention" : "Critical"}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Federal Requirements - Expandable Categories */}
            <div className={styles.categorySection}>
                {federalCategories.map((category) => {
                    const isExpanded = expandedCategories.has(category.id);
                    const progress = getCategoryProgress(category.items);
                    const progressClass = getScoreClass(progress);
                    const Icon = category.icon;

                    return (
                        <div key={category.id} className={styles.category}>
                            <div
                                className={styles.categoryHeader}
                                onClick={() => toggleCategory(category.id)}
                            >
                                <div className={styles.categoryLeft}>
                                    <div className={`${styles.categoryIcon} ${styles[category.iconClass]}`}>
                                        <Icon size={22} />
                                    </div>
                                    <div>
                                        <div className={styles.categoryName}>{category.name}</div>
                                        <div className={styles.categoryDesc}>{category.description}</div>
                                    </div>
                                </div>
                                <div className={styles.categoryRight}>
                                    <div className={styles.categoryProgress}>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={`${styles.progressFill} ${styles[progressClass]}`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <span>{progress}%</span>
                                    </div>
                                    <ChevronDown
                                        size={18}
                                        className={`${styles.chevron} ${isExpanded ? styles.rotated : ""}`}
                                    />
                                </div>
                            </div>

                            {isExpanded && (
                                <div className={styles.categoryItems}>
                                    {category.items.map((item, idx) => (
                                        <div key={idx} className={styles.checklistItem}>
                                            <div className={`${styles.itemIcon} ${styles[item.status]}`}>
                                                {getStatusIcon(item.status)}
                                            </div>
                                            <div className={styles.itemContent}>
                                                <div className={styles.itemName}>{item.name}</div>
                                                <div className={styles.itemDetail}>{item.detail}</div>
                                            </div>
                                            <span className={`${styles.itemBadge} ${styles[item.status]}`}>
                                                {item.status === "compliant" ? "Compliant" :
                                                    item.status === "actionNeeded" ? "Action Needed" :
                                                        item.status === "expired" ? "Expired" : "Pending"}
                                            </span>
                                            {item.dueDate && (
                                                <span className={styles.itemDueDate}>{item.dueDate}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* State-Specific Requirements */}
            <div className={styles.stateSection}>
                <h2 className={styles.stateSectionTitle}>
                    <MapPin size={18} style={{ display: "inline", verticalAlign: "text-bottom", marginRight: 8 }} />
                    {selectedState} State Requirements
                </h2>
                <p className={styles.stateSectionSubtitle}>
                    State-specific DOT compliance requirements for operations in {selectedState}
                </p>
                <div className={styles.stateGrid}>
                    {stateRequirements.map((req, idx) => (
                        <div key={idx} className={styles.stateItem}>
                            <div className={`${styles.stateItemIcon} ${styles[req.status === "done" ? "done" : "todo"]}`}>
                                {req.status === "done" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                            </div>
                            <div className={styles.stateItemInfo}>
                                <div className={styles.stateItemName}>{req.name}</div>
                                <div className={styles.stateItemDesc}>{req.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
