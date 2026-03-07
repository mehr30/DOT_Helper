"use client";

import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Users,
    Truck,
    Bell,
    ArrowRight,
    Shield,
    Info,
    Plus,
    RefreshCw,
    Search,
} from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect, useMemo } from "react";
import styles from "./page.module.css";
import { useDemoMode } from "../components/DemoModeContext";
import OnboardingChecklist from "../components/OnboardingChecklist";
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
}

// ---------------------------------------------------------------------------
// Mock data for demo mode
// ---------------------------------------------------------------------------

const mockComplianceScores: ComplianceScores = {
    overall: 87,
    categories: [
        { name: "Driver Qualification", score: 92, items: [] },
        { name: "Vehicle Maintenance", score: 85, items: [] },
        { name: "Drug & Alcohol", score: 100, items: [] },
        { name: "Company & Authority", score: 72, items: [] },
    ],
    summary: { totalItems: 24, compliant: 20, actionNeeded: 3, expired: 1 },
};

const mockAttentionItems: AttentionItem[] = [
    { id: "m1", title: "License Expiration", detail: "John Smith — expired Feb 15", daysLeft: -20, severity: "expired", type: "driver" },
    { id: "m2", title: "Annual Inspection Overdue", detail: "Unit 103 — expired Feb 22", daysLeft: -13, severity: "expired", type: "vehicle" },
    { id: "m3", title: "Medical Card Expiring", detail: "Mike Johnson — Apr 1, 2026", daysLeft: 25, severity: "warning", type: "driver" },
    { id: "m4", title: "Drug Test Due", detail: "Sarah Wilson — random selection", daysLeft: 14, severity: "warning", type: "compliance" },
    { id: "m5", title: "MCS-150 Update", detail: "Biennial update due Jun 15", daysLeft: 100, severity: "info", type: "compliance" },
];

const quickActions = [
    { label: "Add Driver", href: "/dashboard/drivers/new", icon: Plus },
    { label: "Add Vehicle", href: "/dashboard/vehicles/new", icon: Plus },
    { label: "Run Compliance Check", href: "/dashboard/documents/wizard", icon: RefreshCw },
    { label: "Compliance", href: "/dashboard/compliance", icon: Shield },
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

const mockSearchEntities: SearchableEntity[] = [
    { id: "d1", name: "John Smith", type: "driver", subtitle: "CDL: TX-123456" },
    { id: "d2", name: "Mike Johnson", type: "driver", subtitle: "CDL: TX-789012" },
    { id: "d3", name: "Sarah Wilson", type: "driver", subtitle: "CDL: TX-345678" },
    { id: "v1", name: "Unit 103", type: "vehicle", subtitle: "2022 Freightliner" },
    { id: "v2", name: "Unit 105", type: "vehicle", subtitle: "2021 Peterbilt" },
    { id: "v3", name: "Unit 108", type: "vehicle", subtitle: "2023 Kenworth" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DashboardContent({
    stats,
    hasCompany,
    complianceScores,
    userName,
    searchEntities,
}: {
    stats: DashboardStats | null;
    hasCompany: boolean;
    complianceScores?: ComplianceScores | null;
    userName?: string;
    searchEntities?: SearchableEntity[];
}) {
    const { isDemoMode } = useDemoMode();
    const showChecklist = !isDemoMode && hasCompany;

    const name = userName || "there";
    const scores = isDemoMode ? mockComplianceScores : complianceScores;
    const overallScore = scores?.overall ?? 0;

    // ---- Build attention items ----
    const attentionItems: AttentionItem[] = isDemoMode ? mockAttentionItems : (() => {
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
                        });
                    }
                }
            }
        }

        const items = Array.from(map.values());
        items.sort((a, b) => a.daysLeft - b.daysLeft);
        return items;
    })();

    const visibleItems = attentionItems.slice(0, 7);
    const totalAttention = attentionItems.length;

    // ---- Count driver / vehicle specific issues for stat subtitles ----
    const driverIssues = attentionItems.filter(i => i.type === "driver").length;
    const vehicleIssues = attentionItems.filter(i => i.type === "vehicle").length;

    const driverCount = isDemoMode ? 12 : (stats?.driverCount ?? 0);
    const vehicleCount = isDemoMode ? 8 : (stats?.vehicleCount ?? 0);
    const alertCount = isDemoMode ? 4 : (stats?.activeAlerts ?? 0);

    // ---- Summary line for health bar ----
    const summaryLine = totalAttention > 0
        ? `${totalAttention} item${totalAttention !== 1 ? "s" : ""} need${totalAttention === 1 ? "s" : ""} your attention`
        : "You're all caught up";

    // ---- Search ----
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const entities = isDemoMode ? mockSearchEntities : (searchEntities ?? []);

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

            {/* Quick Actions (above the fold) */}
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
                />
            )}

            {/* Demo data banner */}
            {isDemoMode && (
                <div className={styles.demoBanner}>
                    <Info size={16} />
                    You&apos;re viewing sample data. Add your drivers and vehicles to see real compliance info.
                </div>
            )}

            {/* 2. Compliance Health Bar (hero) */}
            <Link href="/dashboard/compliance" className={styles.healthBarLink}>
                <section className={`${styles.healthBar} ${isDemoMode ? "demoWrapper" : ""}`}>
                    {overallScore === 0 && !isDemoMode ? (
                        <div className={styles.healthBarEmpty}>
                            <Shield size={32} style={{ opacity: 0.4 }} />
                            <p>Add your drivers and vehicles to see your compliance score</p>
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
                                <h3 className={styles.healthBarTitle}>Compliance Health</h3>
                                <div className={styles.categoryBars}>
                                    {(scores?.categories ?? []).map((cat) => (
                                        <div key={cat.name} className={styles.catBarRow}>
                                            <span className={styles.catBarLabel}>{cat.name}</span>
                                            <div className={styles.catBarTrack}>
                                                <div
                                                    className={styles.catBarFill}
                                                    style={{ width: `${cat.score}%`, background: getScoreColor(cat.score) }}
                                                />
                                            </div>
                                            <span className={styles.catBarValue}>{cat.score}%</span>
                                        </div>
                                    ))}
                                </div>
                                <p className={styles.healthBarSummary}>
                                    {totalAttention > 0 ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                                    {summaryLine}
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            </Link>

            {/* 3. Stat Cards (3) */}
            <section className={isDemoMode ? "demoWrapper" : ""}>
                <div className={styles.statsGrid}>
                    <Link href="/dashboard/drivers" className={`${styles.statCard} ${styles.primary}`}>
                        <div className={styles.statIcon}><Users size={22} /></div>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>{driverCount}</span>
                            <span className={styles.statLabel}>Drivers</span>
                            {driverIssues > 0 && (
                                <span className={styles.statAlert}>{driverIssues} need{driverIssues === 1 ? "s" : ""} attention</span>
                            )}
                        </div>
                        <ArrowRight size={16} className={styles.statArrow} />
                    </Link>

                    <Link href="/dashboard/vehicles" className={`${styles.statCard} ${styles.success}`}>
                        <div className={styles.statIcon}><Truck size={22} /></div>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>{vehicleCount}</span>
                            <span className={styles.statLabel}>Vehicles</span>
                            {vehicleIssues > 0 && (
                                <span className={styles.statAlert}>{vehicleIssues} need{vehicleIssues === 1 ? "s" : ""} attention</span>
                            )}
                        </div>
                        <ArrowRight size={16} className={styles.statArrow} />
                    </Link>

                    <Link href="/dashboard/compliance" className={`${styles.statCard} ${alertCount > 0 ? styles.warning : styles.success}`}>
                        <div className={styles.statIcon}><Bell size={22} /></div>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>{alertCount}</span>
                            <span className={styles.statLabel}>Alerts</span>
                            {alertCount > 0 && (
                                <span className={styles.statAlert}>Active</span>
                            )}
                        </div>
                        <ArrowRight size={16} className={styles.statArrow} />
                    </Link>
                </div>
            </section>

            {/* 4. What Needs Attention */}
            <section className={`${styles.attentionPanel} ${isDemoMode ? "demoWrapper" : ""}`}>
                <div className={styles.panelHeader}>
                    <h3 className={styles.sectionTitle}>What Needs Attention</h3>
                    {totalAttention > 7 && (
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
                            return (
                                <div key={item.id} className={styles.attentionItem}>
                                    <div className={`${styles.attentionIcon} ${styles[sev]}`}>
                                        {item.severity === "expired" ? <AlertTriangle size={16} /> :
                                         item.severity === "urgent" ? <AlertTriangle size={16} /> :
                                         item.severity === "warning" ? <Clock size={16} /> :
                                         <Info size={16} />}
                                    </div>
                                    <div className={styles.attentionContent}>
                                        <span className={styles.attentionTitle}>{item.title}</span>
                                        <span className={styles.attentionDetail}>{item.detail}</span>
                                    </div>
                                    <span className={`${styles.daysBadge} ${styles[sev]}`}>
                                        {item.daysLeft < 0
                                            ? `${Math.abs(item.daysLeft)}d overdue`
                                            : `${item.daysLeft}d left`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {totalAttention > 7 && (
                    <Link href="/dashboard/compliance" className={styles.viewAllBottom}>
                        View all on Compliance page <ArrowRight size={14} />
                    </Link>
                )}
            </section>

        </div>
    );
}
