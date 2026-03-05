"use client";

import { useState } from "react";
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
    MapPin,
    Activity,
} from "lucide-react";
import styles from "./page.module.css";
import { useDemoMode } from "../../components/DemoModeContext";
import EmptyState from "../../components/EmptyState";
import type { ComplianceScores } from "../../actions/compliance";

// --- Demo mock data ---
const mockScores: ComplianceScores = {
    overall: 89,
    categories: [
        {
            name: "Driver Qualification", score: 92,
            items: [
                { label: "CDL Current — John Smith", regulation: "49 CFR 391.11", status: "compliant", detail: "45 days remaining" },
                { label: "Medical Certificate — John Smith", regulation: "49 CFR 391.43", status: "compliant", detail: "120 days remaining" },
                { label: "MVR on File — John Smith", regulation: "49 CFR 391.25", status: "compliant", detail: "On file" },
                { label: "CDL Current — Sarah Wilson", regulation: "49 CFR 391.11", status: "compliant", detail: "90 days remaining" },
                { label: "Medical Certificate — Sarah Wilson", regulation: "49 CFR 391.43", status: "action_needed", detail: "28 days remaining" },
                { label: "MVR on File — Sarah Wilson", regulation: "49 CFR 391.25", status: "action_needed", detail: "Missing — annual MVR required" },
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
                { label: "Clearinghouse Consent — John Smith", regulation: "49 CFR 382.703", status: "compliant", detail: "On file" },
                { label: "Pre-Employment Test — Sarah Wilson", regulation: "49 CFR 382.301", status: "compliant", detail: "On file" },
                { label: "Clearinghouse Consent — Sarah Wilson", regulation: "49 CFR 382.703", status: "compliant", detail: "On file" },
            ],
        },
        {
            name: "Company & Authority", score: 85,
            items: [
                { label: "Operating Authority on File", regulation: "49 CFR 365", status: "compliant", detail: "On file" },
                { label: "BOC-3 Process Agent", regulation: "49 CFR 366", status: "compliant", detail: "On file" },
                { label: "MCS-150 Biennial Update", regulation: "49 CFR 390.19", status: "action_needed", detail: "Due in 45 days" },
                { label: "Unified Carrier Registration (UCR)", regulation: "49 CFR 367", status: "compliant", detail: "Current" },
                { label: "Insurance Policy on File", regulation: "49 CFR 387", status: "compliant", detail: "On file" },
                { label: "IFTA License", regulation: "IFTA Agreement", status: "compliant", detail: "On file" },
            ],
        },
    ],
    summary: { totalItems: 23, compliant: 19, actionNeeded: 3, expired: 1 },
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

const stateRequirements = [
    { name: "State DOT Registration", description: "State intrastate registration", status: "done" as const },
    { name: "Oversize/Overweight Permits", description: "Annual blanket permit if applicable", status: "done" as const },
    { name: "Emissions Compliance", description: "Required in certain states/counties", status: "todo" as const },
    { name: "State Sales Tax Filing", description: "Quarterly motor fuel tax reporting", status: "done" as const },
    { name: "State Annual Inspection", description: "Annual vehicle safety inspection", status: "done" as const },
    { name: "Intrastate HOS Rules", description: "State-specific driving hour rules", status: "done" as const },
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
    "West Virginia", "Wisconsin", "Wyoming",
];

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

export default function ComplianceContent({ scores }: { scores: ComplianceScores | null }) {
    const { isDemoMode } = useDemoMode();
    const data = isDemoMode ? mockScores : scores;
    const [selectedState, setSelectedState] = useState("Texas");
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["Driver Qualification", "Vehicle Maintenance"]));

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
                    description="Add drivers and vehicles to see your real compliance scores. Each driver and vehicle is automatically checked against FMCSA regulations."
                    primaryAction={{ label: "Add Drivers", href: "/dashboard/drivers/new" }}
                    secondaryAction={{ label: "Add Vehicles", href: "/dashboard/vehicles/new" }}
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
                            : `Overall compliance: ${data.overall}% — ${data.summary.compliant} compliant, ${data.summary.actionNeeded} need action, ${data.summary.expired} expired`}
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <select
                        className={styles.stateSelector}
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                    >
                        {states.map((state) => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                    <button className={styles.downloadBtn}>
                        <Download size={16} /> Export Report
                    </button>
                </div>
            </div>

            {/* Score Overview Cards */}
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

            {/* Federal Requirements */}
            <div className={styles.categorySection}>
                {data.categories.map((category) => {
                    const isExpanded = expandedCategories.has(category.name);
                    const Icon = categoryIcons[category.name] ?? Shield;
                    const iconClass = categoryIconClasses[category.name] ?? "federal";

                    return (
                        <div key={category.name} className={styles.category}>
                            <div className={styles.categoryHeader} onClick={() => toggleCategory(category.name)}>
                                <div className={styles.categoryLeft}>
                                    <div className={`${styles.categoryIcon} ${styles[iconClass]}`}>
                                        <Icon size={22} />
                                    </div>
                                    <div>
                                        <div className={styles.categoryName}>{category.name}</div>
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
                                        return (
                                            <div key={idx} className={styles.checklistItem}>
                                                <div className={`${styles.itemIcon} ${styles[cssStatus]}`}>
                                                    {getStatusIcon(item.status)}
                                                </div>
                                                <div className={styles.itemContent}>
                                                    <div className={styles.itemName}>{item.label}</div>
                                                    <div className={styles.itemDetail}>
                                                        {item.detail}
                                                        {item.regulation && (
                                                            <span style={{ marginLeft: "0.5rem", color: "#94a3b8", fontSize: "0.75rem" }}>
                                                                ({item.regulation})
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`${styles.itemBadge} ${styles[cssStatus]}`}>
                                                    {item.status === "compliant" ? "Compliant" :
                                                        item.status === "action_needed" ? "Action Needed" :
                                                            item.status === "expired" ? "Expired" : "N/A"}
                                                </span>
                                            </div>
                                        );
                                    })}
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
