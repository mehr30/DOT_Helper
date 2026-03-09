"use client";

import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Users,
    Truck,
    ArrowRight,
    Shield,
    Info,
    Plus,
    Search,
    Upload,
    Calendar,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect, useMemo } from "react";
import styles from "./page.module.css";
import OnboardingChecklist from "../components/OnboardingChecklist";
import { humanize } from "../../lib/plain-english";
import type { DashboardStats } from "../actions/dashboard";
import type { ComplianceScores } from "../actions/compliance";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

function getSeverity(daysLeft: number): "expired" | "urgent" | "warning" | "info" {
    if (daysLeft < 0) return "expired";
    if (daysLeft <= 7) return "urgent";
    if (daysLeft <= 30) return "warning";
    return "info";
}

function formatDateShort(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

function getScoreColor(score: number): string {
    if (score >= 90) return "#22c55e";
    if (score >= 70) return "#f59e0b";
    return "#ef4444";
}

/** Map a compliance/attention title to a friendly, de-jargoned label. */
function friendlyTitle(title: string): string {
    // Try the plain-english map first
    const mapped = humanize(title);
    if (mapped !== title) return mapped;

    // Extra dashboard-specific overrides
    const extra: Record<string, string> = {
        "MVR on File": "Driving Record",
        "Clearinghouse Query": "Drug Testing Check",
        "Clearinghouse Consent": "Drug Testing Authorization",
        "BOC-3 Process Agent": "Legal Agent Designation",
        "MCS-150 Biennial Update": "Federal Business Update",
        "Unified Carrier Registration (UCR)": "Annual Federal Registration",
        "IFTA License": "Fuel Tax License",
        "Insurance Policy on File": "Insurance Policy",
        "Operating Authority on File": "Operating Authority",
        "Pre-Employment Test": "Drug Test Result",
        "Medical Card": "DOT Physical",
        "Medical Card Expiring": "DOT Physical Expiring",
    };
    return extra[title] ?? title;
}

/** Generate helpful detail text based on item state. */
function getHelpfulDetail(item: AttentionItem): string {
    if (item.daysLeft < 0) {
        const overdue = Math.abs(item.daysLeft);
        const where = item.type === "driver" ? "driver profile" : item.type === "vehicle" ? "vehicle profile" : "compliance page";
        return `Overdue by ${overdue} day${overdue !== 1 ? "s" : ""} — update on ${where}`;
    }
    if (item.daysLeft <= 30 && item.detail) {
        return `Due in ${item.daysLeft} day${item.daysLeft !== 1 ? "s" : ""} — ${item.detail}`;
    }
    // Missing items (no date, typically compliance items)
    const lower = item.title.toLowerCase();
    if (lower.includes("upload") || lower.includes("insurance") || lower.includes("authority") || lower.includes("ucr") || lower.includes("ifta") || lower.includes("fuel tax") || lower.includes("registration")) {
        return "Upload this document to stay compliant";
    }
    if (lower.includes("form") || lower.includes("mcs") || lower.includes("boc") || lower.includes("legal agent") || lower.includes("federal business")) {
        return "Fill out this form to complete your records";
    }
    // Default — use existing detail or generic
    return item.detail || "Needs attention";
}

/** Plain-English score message */
function getScoreMessage(score: number, issueCount: number): string {
    if (score >= 100) return "You're fully DOT-ready!";
    if (score >= 90) return `Almost there — just ${issueCount} small thing${issueCount !== 1 ? "s" : ""} to fix.`;
    if (score >= 70) return `${issueCount} thing${issueCount !== 1 ? "s" : ""} to fix before you're DOT-ready.`;
    return `${issueCount} item${issueCount !== 1 ? "s" : ""} need attention — let's get started.`;
}

// ---------------------------------------------------------------------------
// Attention item — unified type for the merged list
// ---------------------------------------------------------------------------

interface AttentionItem {
    id: string;
    title: string;
    detail: string;
    daysLeft: number;
    severity: "expired" | "urgent" | "warning" | "info";
    type: "driver" | "vehicle" | "compliance";
    actionHref?: string;
    actionLabel?: string;
    driverId?: string;
    vehicleId?: string;
}

// Map attention item labels to actionable links
function getActionForAttentionItem(item: AttentionItem): { href: string; label: string } | null {
    const lower = friendlyTitle(item.title).toLowerCase();
    const origLower = item.title.toLowerCase();

    // Driver-related
    if (origLower.includes("license") || origLower.includes("cdl")) {
        return { href: item.driverId ? `/dashboard/drivers/${item.driverId}` : "/dashboard/drivers", label: "Update" };
    }
    if (origLower.includes("medical") || origLower.includes("dot physical")) {
        return { href: item.driverId ? `/dashboard/drivers/${item.driverId}` : "/dashboard/drivers", label: "Update" };
    }
    if (origLower.includes("clearinghouse") || lower.includes("drug testing")) {
        return { href: item.driverId ? `/dashboard/drivers/${item.driverId}` : "/dashboard/drivers", label: "Update" };
    }
    if (origLower.includes("mvr") || lower.includes("driving record")) {
        const driverParam = item.driverId ? `&driver=${item.driverId}` : "";
        return { href: `/dashboard/documents/wizard?form=annualMVRReview${driverParam}`, label: "Fill Out Form" };
    }
    if (origLower.includes("employment application")) {
        const driverParam = item.driverId ? `&driver=${item.driverId}` : "";
        return { href: `/dashboard/documents/wizard?form=driverApp${driverParam}`, label: "Fill Out Form" };
    }
    if (origLower.includes("drug test") || origLower.includes("pre-employment test")) {
        const params = new URLSearchParams({ upload: "DRUG_TEST_RESULT" });
        if (item.driverId) params.set("driver", item.driverId);
        return { href: `/dashboard/documents?${params.toString()}`, label: "Upload" };
    }

    // Vehicle-related
    if (origLower.includes("annual inspection")) {
        return { href: item.vehicleId ? `/dashboard/vehicles/${item.vehicleId}` : "/dashboard/vehicles", label: "Update" };
    }
    if (origLower.includes("preventive maintenance")) {
        return { href: item.vehicleId ? `/dashboard/vehicles/${item.vehicleId}` : "/dashboard/vehicles", label: "Update" };
    }
    if (origLower.includes("registration")) {
        return { href: item.vehicleId ? `/dashboard/vehicles/${item.vehicleId}` : "/dashboard/vehicles", label: "Update" };
    }

    // Company docs
    if (origLower.includes("mcs-150") || lower.includes("federal business")) {
        return { href: "/dashboard/documents/wizard?form=mcs150", label: "Fill Out Form" };
    }
    if (origLower.includes("boc-3") || lower.includes("legal agent")) {
        return { href: "/dashboard/documents/wizard?form=boc3", label: "Fill Out Form" };
    }
    if (origLower.includes("operating authority")) {
        return { href: "/dashboard/documents?upload=OPERATING_AUTHORITY", label: "Upload" };
    }
    if (origLower.includes("ucr") || lower.includes("federal registration")) {
        return { href: "/dashboard/documents?upload=UCR", label: "Upload" };
    }
    if (origLower.includes("insurance")) {
        return { href: "/dashboard/documents?upload=INSURANCE_POLICY", label: "Upload" };
    }
    if (origLower.includes("ifta") || lower.includes("fuel tax")) {
        return { href: "/dashboard/documents?upload=IFTA_LICENSE", label: "Upload" };
    }

    // Fallback — go to compliance page
    return { href: "/dashboard/compliance", label: "View" };
}

// ---------------------------------------------------------------------------
// Upcoming deadline item (passed from server)
// ---------------------------------------------------------------------------

export interface UpcomingItem {
    id: string;
    title: string;
    date: string;
    daysLeft: number;
    href: string;
}

const quickActions = [
    { label: "Add Driver", href: "/dashboard/drivers/new", icon: Plus },
    { label: "Add Vehicle", href: "/dashboard/vehicles/new", icon: Plus },
    { label: "Upload Document", href: "/dashboard/documents", icon: Upload },
    { label: "View Compliance", href: "/dashboard/compliance", icon: Shield },
];

// ---------------------------------------------------------------------------
// Search result type
// ---------------------------------------------------------------------------

export interface SearchableEntity {
    id: string;
    name: string;
    type: "driver" | "vehicle";
    subtitle?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DashboardContent({
    stats,
    hasCompany,
    complianceScores,
    userName,
    searchEntities,
    upcomingItems: upcomingItemsProp,
    reviewDue,
}: {
    stats: DashboardStats | null;
    hasCompany: boolean;
    complianceScores?: ComplianceScores | null;
    userName?: string;
    searchEntities?: SearchableEntity[];
    upcomingItems?: UpcomingItem[];
    reviewDue?: boolean;
}) {
    const showChecklist = hasCompany;

    const name = userName || "there";
    const scores = complianceScores;
    const overallScore = scores?.overall ?? 0;

    // Extract the Company & Authority category for the setup guide
    const companyAuthCategory = scores?.categories.find(c => c.name === "Company & Authority") ?? null;

    // ---- Build attention items ----
    const attentionItems: AttentionItem[] = (() => {
        const map = new Map<string, AttentionItem>();

        // From upcoming expirations
        for (const e of stats?.upcomingExpirations ?? []) {
            map.set(e.id, {
                id: e.id,
                title: e.title,
                detail: formatDateShort(e.date),
                daysLeft: e.daysLeft,
                severity: getSeverity(e.daysLeft),
                type: e.type,
            });
        }

        // From compliance categories
        if (complianceScores) {
            for (const cat of complianceScores.categories) {
                for (const item of cat.items) {
                    if (item.status !== "action_needed" && item.status !== "expired") continue;
                    const key = item.driverId
                        ? `driver-${item.driverId}-${item.label}`
                        : item.vehicleId
                            ? `vehicle-${item.vehicleId}-${item.label}`
                            : `comp-${item.label}`;

                    // Skip if we already have this entity via expiration data
                    const dupKey = item.driverId
                        ? [`cdl-${item.driverId}`, `med-${item.driverId}`]
                        : item.vehicleId
                            ? [`insp-${item.vehicleId}`]
                            : [];
                    if (dupKey.some(k => map.has(k))) continue;

                    if (!map.has(key)) {
                        map.set(key, {
                            id: key,
                            title: item.label,
                            detail: item.detail || cat.name,
                            daysLeft: item.status === "expired" ? -1 : 30,
                            severity: item.status === "expired" ? "expired" : "warning",
                            type: item.driverId ? "driver" : item.vehicleId ? "vehicle" : "compliance",
                            driverId: item.driverId,
                            vehicleId: item.vehicleId,
                        });
                    }
                }
            }
        }

        const items = Array.from(map.values());
        items.sort((a, b) => a.daysLeft - b.daysLeft);
        return items;
    })();

    const visibleItems = attentionItems.slice(0, 10);
    const totalAttention = attentionItems.length;

    // ---- Count driver / vehicle specific issues for stat subtitles ----
    const driverIssues = attentionItems.filter(i => i.type === "driver").length;
    const vehicleIssues = attentionItems.filter(i => i.type === "vehicle").length;

    const driverCount = stats?.driverCount ?? 0;
    const vehicleCount = stats?.vehicleCount ?? 0;

    // ---- Upcoming items ----
    const upcomingItems = upcomingItemsProp ?? [];

    // ---- Search ----
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const entities = searchEntities ?? [];

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase();
        return entities
            .filter(e => e.name.toLowerCase().includes(q) || e.subtitle?.toLowerCase().includes(q))
            .slice(0, 5);
    }, [searchQuery, entities]);

    const showDropdown = searchFocused && searchQuery.trim().length > 0;

    // Close dropdown on click outside
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className={styles.dashboard}>
            {/* 1. Greeting Header + Search */}
            <header className={styles.greeting}>
                <div>
                    <h1 className={styles.greetingName}>{getGreeting()}, {name}</h1>
                    <p className={styles.greetingDate}>
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long", year: "numeric", month: "long", day: "numeric"
                        })}
                    </p>
                </div>
                <div className={styles.searchWrapper} ref={searchRef}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search drivers or vehicles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                    />
                    {showDropdown && (
                        <div className={styles.searchDropdown}>
                            {searchResults.length === 0 ? (
                                <div className={styles.searchEmpty}>No results for &ldquo;{searchQuery}&rdquo;</div>
                            ) : (
                                searchResults.map((r) => (
                                    <Link
                                        key={r.id}
                                        href={r.type === "driver" ? `/dashboard/drivers/${r.id}` : `/dashboard/vehicles/${r.id}`}
                                        className={styles.searchResult}
                                        onClick={() => { setSearchQuery(""); setSearchFocused(false); }}
                                    >
                                        <div className={styles.searchResultIcon}>
                                            {r.type === "driver" ? <Users size={14} /> : <Truck size={14} />}
                                        </div>
                                        <div className={styles.searchResultText}>
                                            <span className={styles.searchResultName}>{r.name}</span>
                                            {r.subtitle && <span className={styles.searchResultSub}>{r.subtitle}</span>}
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Quick Actions */}
            <section className={styles.quickActionsSlim}>
                {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link key={action.label} href={action.href} className={styles.pillButton}>
                            <Icon size={16} />
                            <span>{action.label}</span>
                        </Link>
                    );
                })}
            </section>

            {/* Onboarding Checklist */}
            {showChecklist && (
                <OnboardingChecklist
                    hasCompany={hasCompany}
                    driverCount={stats?.driverCount ?? 0}
                    vehicleCount={stats?.vehicleCount ?? 0}
                    companyDocsNeeded={companyAuthCategory ? companyAuthCategory.items.filter(i => i.status === "action_needed" || i.status === "expired").length : 0}
                    companyDocsComplete={companyAuthCategory ? companyAuthCategory.items.filter(i => i.status === "compliant").length : 0}
                />
            )}

            {/* Compliance Review Banner */}
            {reviewDue && (
                <Link href="/dashboard/compliance?review=true" style={{ textDecoration: "none" }}>
                    <section style={{
                        display: "flex", alignItems: "center", gap: "0.75rem",
                        padding: "0.85rem 1.25rem", borderRadius: "12px",
                        background: "linear-gradient(135deg, #fefce8, #fef9c3)",
                        border: "1px solid #fde68a",
                    }}>
                        <RefreshCw size={20} style={{ color: "#d97706", flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#92400e" }}>
                                Time for a compliance check-in
                            </span>
                            <span style={{ display: "block", fontSize: "0.78rem", color: "#a16207", marginTop: "0.1rem" }}>
                                It&apos;s been a while — take 30 seconds to confirm nothing has changed in your fleet or operations.
                            </span>
                        </div>
                        <span style={{
                            padding: "0.35rem 0.75rem", borderRadius: "8px",
                            background: "#fbbf24", color: "#78350f",
                            fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap",
                        }}>
                            Review Now
                        </span>
                    </section>
                </Link>
            )}

            {/* 4. DOT Readiness Score Bar */}
            <Link href="/dashboard/compliance" className={styles.healthBarLink}>
                <section className={styles.healthBar}>
                    {overallScore === 0 ? (
                        <div className={styles.healthBarEmpty}>
                            <Shield size={28} style={{ opacity: 0.4 }} />
                            <p>Add your drivers and vehicles to see your DOT readiness score</p>
                        </div>
                    ) : (
                        <div className={styles.healthBarContent}>
                            <div className={styles.healthBarLeft}>
                                <div
                                    className={styles.scoreCircle}
                                    style={{ "--score": overallScore, "--score-color": getScoreColor(overallScore) } as React.CSSProperties}
                                >
                                    <div className={styles.scoreInner}>
                                        <span className={styles.scoreValue}>{overallScore}</span>
                                        <span className={styles.scoreLabel}>%</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.healthBarRight}>
                                <h3 className={styles.healthBarTitle}>DOT Readiness Score</h3>
                                <p className={styles.healthBarMessage}>
                                    {getScoreMessage(overallScore, totalAttention)}
                                </p>
                                <span className={styles.healthBarCta}>
                                    View full compliance details <ArrowRight size={14} />
                                </span>
                            </div>
                        </div>
                    )}
                </section>
            </Link>

            {/* 5. Fleet Snapshot — Drivers & Vehicles */}
            <section>
                <div className={styles.statsGrid}>
                    <Link href="/dashboard/drivers" className={`${styles.statCard} ${styles.primary}`}>
                        <div className={styles.statIcon}><Users size={22} /></div>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>{driverCount}</span>
                            <span className={styles.statLabel}>Drivers</span>
                            <span className={styles.statAlert}>
                                {driverIssues > 0
                                    ? `${driverIssues} need${driverIssues === 1 ? "s" : ""} attention`
                                    : driverCount > 0 ? "All compliant" : ""}
                            </span>
                        </div>
                        <ArrowRight size={16} className={styles.statArrow} />
                    </Link>

                    <Link href="/dashboard/vehicles" className={`${styles.statCard} ${styles.success}`}>
                        <div className={styles.statIcon}><Truck size={22} /></div>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>{vehicleCount}</span>
                            <span className={styles.statLabel}>Vehicles</span>
                            <span className={styles.statAlert}>
                                {vehicleIssues > 0
                                    ? `${vehicleIssues} need${vehicleIssues === 1 ? "s" : ""} attention`
                                    : vehicleCount > 0 ? "All compliant" : ""}
                            </span>
                        </div>
                        <ArrowRight size={16} className={styles.statArrow} />
                    </Link>
                </div>
            </section>

            {/* 6. What Needs Attention */}
            <section className={styles.attentionPanel}>
                <div className={styles.panelHeader}>
                    <h3 className={styles.sectionTitle}>What Needs Attention</h3>
                    {totalAttention > 10 && (
                        <Link href="/dashboard/compliance" className={styles.viewAll}>
                            View all <ArrowRight size={14} />
                        </Link>
                    )}
                </div>

                {visibleItems.length === 0 ? (
                    <div className={styles.allClear}>
                        <CheckCircle size={24} />
                        <span>All clear — nothing needs attention right now</span>
                    </div>
                ) : (
                    <div className={styles.attentionList}>
                        {visibleItems.map((item) => {
                            const sev = item.severity === "expired" ? "urgent" : item.severity;
                            const action = getActionForAttentionItem(item);
                            const title = friendlyTitle(item.title);
                            const detail = getHelpfulDetail(item);
                            const inner = (
                                <>
                                    <div className={`${styles.attentionIcon} ${styles[sev]}`}>
                                        {item.severity === "expired" ? <AlertTriangle size={16} /> :
                                         item.severity === "urgent" ? <AlertTriangle size={16} /> :
                                         item.severity === "warning" ? <Clock size={16} /> :
                                         <Info size={16} />}
                                    </div>
                                    <div className={styles.attentionContent}>
                                        <span className={styles.attentionTitle}>{title}</span>
                                        <span className={styles.attentionDetail}>{detail}</span>
                                    </div>
                                    <span className={`${styles.daysBadge} ${styles[sev]}`}>
                                        {item.daysLeft < 0
                                            ? `${Math.abs(item.daysLeft)}d overdue`
                                            : `${item.daysLeft}d left`}
                                    </span>
                                    {action && (
                                        <span className={styles.attentionAction}>
                                            {action.label} <ArrowRight size={14} />
                                        </span>
                                    )}
                                </>
                            );

                            if (action) {
                                return (
                                    <Link key={item.id} href={action.href} className={`${styles.attentionItem} ${styles.attentionItemClickable}`}>
                                        {inner}
                                    </Link>
                                );
                            }

                            return (
                                <div key={item.id} className={styles.attentionItem}>
                                    {inner}
                                </div>
                            );
                        })}
                    </div>
                )}

                {totalAttention > 10 && (
                    <Link href="/dashboard/compliance" className={styles.viewAllBottom}>
                        View all on Compliance page <ArrowRight size={14} />
                    </Link>
                )}
            </section>

            {/* 7. Upcoming Deadlines */}
            {upcomingItems.length > 0 && (
                <section className={styles.upcomingPanel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.sectionTitle}>Upcoming Deadlines</h3>
                    </div>
                    <div className={styles.upcomingList}>
                        {upcomingItems.slice(0, 5).map((item) => (
                            <Link key={item.id} href={item.href} className={styles.upcomingItem}>
                                <div className={styles.upcomingIcon}>
                                    <Calendar size={16} />
                                </div>
                                <div className={styles.upcomingContent}>
                                    <span className={styles.upcomingTitle}>{friendlyTitle(item.title)}</span>
                                    <span className={styles.upcomingDate}>{formatDateShort(item.date)}</span>
                                </div>
                                <span className={styles.upcomingBadge}>{item.daysLeft}d</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}
