"use client";

import {
    AlertTriangle,
    CheckCircle,
    Clock,
    FileWarning,
    ClipboardList,
    Users,
    Truck,
    Calendar,
    ArrowRight,
    Shield,
    Info,
} from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";
import { useDemoMode } from "../components/DemoModeContext";
import OnboardingChecklist from "../components/OnboardingChecklist";
import type { DashboardStats } from "../actions/dashboard";
import type { ComplianceScores } from "../actions/compliance";

// Mock data for demo mode
const mockStats = [
    { label: "Active Drivers", value: "12", icon: Users, color: "primary", change: "+2 this month" },
    { label: "Vehicles", value: "8", icon: Truck, color: "success", change: "All compliant" },
    { label: "To-Do Items", value: "5", icon: Clock, color: "warning", change: "3 urgent" },
    { label: "Drug & Alcohol Testing", value: "100%", icon: Shield, color: "success", change: "All checks current" },
];

const mockDeadlines = [
    { id: "1", title: "License Expiration - John Smith", date: "Feb 15, 2026", daysLeft: -18, severity: "expired" },
    { id: "2", title: "Annual DOT Inspection - Unit 103", date: "Feb 22, 2026", daysLeft: -11, severity: "expired" },
    { id: "3", title: "Medical Card - Mike Johnson", date: "Apr 01, 2026", daysLeft: 27, severity: "warning" },
    { id: "4", title: "Federal Business Update", date: "Jun 15, 2026", daysLeft: 102, severity: "info" },
];

const mockAlerts = [
    { id: 1, icon: AlertTriangle, title: "Driver Hours Violation", message: "Driver exceeded 11-hour driving limit", time: "2 hours ago", severity: "danger" },
    { id: 2, icon: FileWarning, title: "Missing Document", message: "Driving record not on file for Sarah Wilson", time: "5 hours ago", severity: "warning" },
    { id: 3, icon: CheckCircle, title: "Inspection Completed", message: "Unit 105 passed annual DOT inspection", time: "1 day ago", severity: "success" },
];

const quickActions = [
    { label: "Add Driver", href: "/dashboard/drivers/new", icon: Users },
    { label: "Add Vehicle", href: "/dashboard/vehicles/new", icon: Truck },
    { label: "Compliance Assessment", href: "/dashboard/documents/wizard", icon: ClipboardList },
    { label: "Compliance", href: "/dashboard/compliance", icon: Shield },
];

const statLinks: Record<string, string> = {
    "Active Drivers": "/dashboard/drivers",
    "Vehicles": "/dashboard/vehicles",
    "To-Do Items": "/dashboard/compliance",
    "Compliance Score": "/dashboard/compliance",
    "Drug & Alcohol Testing": "/dashboard/compliance",
};

function getSeverity(daysLeft: number): string {
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
    if (score >= 90) return "success";
    if (score >= 70) return "warning";
    return "primary"; // "primary" maps to the red-ish color in the CSS
}

export default function DashboardContent({
    stats,
    hasCompany,
    complianceScores,
}: {
    stats: DashboardStats | null;
    hasCompany: boolean;
    complianceScores?: ComplianceScores | null;
}) {
    const { isDemoMode } = useDemoMode();

    const showChecklist = !isDemoMode && hasCompany;

    // Build stats cards from real data or demo mock
    const todoCount = complianceScores
        ? complianceScores.summary.actionNeeded + complianceScores.summary.expired
        : (stats?.activeAlerts ?? 0);

    const overallScore = complianceScores?.overall ?? 0;

    const statsCards = isDemoMode ? mockStats : [
        { label: "Active Drivers", value: String(stats?.driverCount ?? 0), icon: Users, color: "primary", change: "" },
        { label: "Vehicles", value: String(stats?.vehicleCount ?? 0), icon: Truck, color: "success", change: "" },
        { label: "To-Do Items", value: String(todoCount), icon: Clock, color: todoCount > 0 ? "warning" : "success", change: todoCount > 0 ? `${todoCount} need attention` : "" },
        { label: "Compliance Score", value: `${overallScore}%`, icon: Shield, color: getScoreColor(overallScore), change: overallScore >= 90 ? "Looking good" : overallScore > 0 ? "Room to improve" : "" },
    ];

    const deadlines = isDemoMode ? mockDeadlines : (stats?.upcomingExpirations ?? []).map(e => ({
        id: e.id,
        title: e.title,
        date: formatDateShort(e.date),
        daysLeft: e.daysLeft,
        severity: getSeverity(e.daysLeft),
    }));

    // Build compliance snapshot from real data
    const complianceSnapshot = complianceScores
        ? complianceScores.categories
            .flatMap(cat => cat.items)
            .filter(item => item.status === "action_needed" || item.status === "expired")
            .slice(0, 5)
        : [];

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Home</h1>
                    <p className={styles.subtitle}>
                        Welcome back! Here&apos;s your compliance overview for today.
                    </p>
                </div>
                <div className={styles.dateDisplay}>
                    <Calendar size={18} />
                    <span>{new Date().toLocaleDateString("en-US", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric"
                    })}</span>
                </div>
            </header>

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
                <div style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.6rem 1rem", borderRadius: "8px",
                    background: "#f1f5f9", border: "1px dashed #cbd5e1",
                    color: "#64748b", fontSize: "0.82rem", marginBottom: "0.5rem",
                }}>
                    <Info size={16} />
                    You&apos;re viewing sample data. Add your drivers and vehicles to see real compliance info.
                </div>
            )}

            {/* Stats Grid */}
            <section className={isDemoMode ? "demoWrapper" : ""} style={isDemoMode ? { marginBottom: "1rem" } : {}}>
                <div className={styles.statsGrid}>
                    {statsCards.map((stat) => {
                        const Icon = stat.icon;
                        const href = statLinks[stat.label] || "/dashboard";
                        return (
                            <Link key={stat.label} href={href} className={`${styles.statCard} ${styles[stat.color]}`} style={{ textDecoration: "none", cursor: "pointer" }}>
                                <div className={styles.statIcon}>
                                    <Icon size={24} />
                                </div>
                                <div className={styles.statContent}>
                                    <span className={styles.statValue}>{stat.value}</span>
                                    <span className={styles.statLabel}>{stat.label}</span>
                                    {stat.change && <span className={styles.statChange}>{stat.change}</span>}
                                </div>
                                <ArrowRight size={16} style={{ position: "absolute", top: 12, right: 12, color: "#94a3b8", opacity: 0.5 }} />
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Quick Actions */}
            <section className={styles.quickActions}>
                <h3 className={styles.sectionTitle}>Quick Actions</h3>
                <div className={styles.actionButtons}>
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link key={action.label} href={action.href} className={styles.actionButton}>
                                <Icon size={20} />
                                <span>{action.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Two Column Layout */}
            <div className={styles.twoColumn}>
                {/* Upcoming Deadlines */}
                <section className={isDemoMode ? "demoWrapper" : ""}>
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <h3 className={styles.sectionTitle}>Upcoming Deadlines</h3>
                            <Link href="/dashboard/compliance" className={styles.viewAll}>
                                View all <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className={styles.deadlineList}>
                            {deadlines.length === 0 ? (
                                <p style={{ color: "#94a3b8", fontSize: "0.875rem", textAlign: "center", padding: "1rem" }}>
                                    No upcoming deadlines within 60 days.
                                </p>
                            ) : deadlines.map((deadline) => (
                                <div key={deadline.id} className={styles.deadlineItem}>
                                    <div className={`${styles.deadlineIndicator} ${styles[deadline.severity === "expired" ? "urgent" : deadline.severity]}`} />
                                    <div className={styles.deadlineContent}>
                                        <span className={styles.deadlineTitle}>{deadline.title}</span>
                                        <span className={styles.deadlineDate}>{deadline.date}</span>
                                    </div>
                                    <span className={`${styles.daysLeft} ${styles[deadline.severity === "expired" ? "urgent" : deadline.severity]}`}>
                                        {deadline.daysLeft < 0 ? `${Math.abs(deadline.daysLeft)}d overdue` : `${deadline.daysLeft} days`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Compliance Snapshot (replaces "Recent Alerts") */}
                <section className={isDemoMode ? "demoWrapper" : ""}>
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <h3 className={styles.sectionTitle}>Compliance Snapshot</h3>
                            <Link href="/dashboard/compliance" className={styles.viewAll}>
                                View all <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className={styles.alertList}>
                            {isDemoMode ? mockAlerts.map((alert) => {
                                const Icon = alert.icon;
                                return (
                                    <div key={alert.id} className={`${styles.alertItem} ${styles[alert.severity]}`}>
                                        <div className={styles.alertIcon}>
                                            <Icon size={18} />
                                        </div>
                                        <div className={styles.alertContent}>
                                            <span className={styles.alertTitle}>{alert.title}</span>
                                            <span className={styles.alertMessage}>{alert.message}</span>
                                            <span className={styles.alertTime}>{alert.time}</span>
                                        </div>
                                    </div>
                                );
                            }) : complianceSnapshot.length > 0 ? (
                                complianceSnapshot.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: "flex", alignItems: "center", gap: "0.75rem",
                                        padding: "0.6rem 0.75rem", borderBottom: "1px solid #f1f5f9",
                                    }}>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: "6px",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            background: item.status === "expired" ? "#fef2f2" : "#fffbeb",
                                            color: item.status === "expired" ? "#dc2626" : "#d97706",
                                            flexShrink: 0,
                                        }}>
                                            {item.status === "expired" ? <AlertTriangle size={14} /> : <Clock size={14} />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: "0.82rem", fontWeight: 500, color: "#1e293b" }}>
                                                {item.label}
                                            </div>
                                            <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                                                {item.detail}
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase",
                                            padding: "0.15rem 0.4rem", borderRadius: "4px",
                                            background: item.status === "expired" ? "#fef2f2" : "#fffbeb",
                                            color: item.status === "expired" ? "#dc2626" : "#92400e",
                                            whiteSpace: "nowrap",
                                        }}>
                                            {item.status === "expired" ? "Expired" : "Needs Attention"}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div style={{
                                    display: "flex", alignItems: "center", gap: "0.5rem",
                                    padding: "1.5rem", justifyContent: "center", color: "#16a34a",
                                    fontSize: "0.85rem", fontWeight: 500,
                                }}>
                                    <CheckCircle size={18} />
                                    All caught up! No action items right now.
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
