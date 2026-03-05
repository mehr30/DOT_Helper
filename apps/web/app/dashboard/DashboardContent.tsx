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
} from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";
import { useDemoMode } from "../components/DemoModeContext";
import OnboardingChecklist from "../components/OnboardingChecklist";
import type { DashboardStats } from "../actions/dashboard";

// Mock data for demo mode
const mockStats = [
    { label: "Active Drivers", value: "12", icon: Users, color: "primary", change: "+2 this month" },
    { label: "Vehicles", value: "8", icon: Truck, color: "success", change: "All compliant" },
    { label: "Pending Actions", value: "5", icon: Clock, color: "warning", change: "3 urgent" },
    { label: "Drug & Alcohol", value: "100%", icon: Shield, color: "success", change: "All checks current" },
];

const mockDeadlines = [
    { id: "1", title: "CDL Expiration - John Smith", date: "Feb 15, 2026", daysLeft: -18, severity: "expired" },
    { id: "2", title: "Annual DOT Inspection - Unit 103", date: "Feb 22, 2026", daysLeft: -11, severity: "expired" },
    { id: "3", title: "Medical Card - Mike Johnson", date: "Apr 01, 2026", daysLeft: 27, severity: "warning" },
    { id: "4", title: "MCS-150 Biennial Update", date: "Jun 15, 2026", daysLeft: 102, severity: "info" },
];

const mockAlerts = [
    { id: 1, icon: AlertTriangle, title: "HOS Violation Detected", message: "Driver exceeded 11-hour driving limit", time: "2 hours ago", severity: "danger" },
    { id: 2, icon: FileWarning, title: "Missing Document", message: "MVR not on file for Sarah Wilson", time: "5 hours ago", severity: "warning" },
    { id: 3, icon: CheckCircle, title: "Inspection Completed", message: "Unit 105 passed annual DOT inspection", time: "1 day ago", severity: "success" },
];

const quickActions = [
    { label: "Add Driver", href: "/dashboard/drivers/new", icon: Users },
    { label: "Add Vehicle", href: "/dashboard/vehicles/new", icon: Truck },
    { label: "Compliance Setup", href: "/dashboard/documents/wizard", icon: ClipboardList },
    { label: "Compliance", href: "/dashboard/compliance", icon: Shield },
];

const statLinks: Record<string, string> = {
    "Active Drivers": "/dashboard/drivers",
    "Vehicles": "/dashboard/vehicles",
    "Pending Actions": "/dashboard/alerts",
    "Drug & Alcohol": "/dashboard/compliance",
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

export default function DashboardContent({ stats, hasCompany }: { stats: DashboardStats | null; hasCompany: boolean }) {
    const { isDemoMode } = useDemoMode();

    const showChecklist = !isDemoMode && hasCompany;

    // Build stats cards from real data or demo mock
    const statsCards = isDemoMode ? mockStats : [
        { label: "Active Drivers", value: String(stats?.driverCount ?? 0), icon: Users, color: "primary", change: "" },
        { label: "Vehicles", value: String(stats?.vehicleCount ?? 0), icon: Truck, color: "success", change: "" },
        { label: "Active Alerts", value: String(stats?.activeAlerts ?? 0), icon: Clock, color: stats?.activeAlerts ? "warning" : "success", change: "" },
        { label: "Expirations", value: String(stats?.upcomingExpirations?.length ?? 0), icon: Shield, color: (stats?.upcomingExpirations?.length ?? 0) > 0 ? "warning" : "success", change: "Within 60 days" },
    ];

    const deadlines = isDemoMode ? mockDeadlines : (stats?.upcomingExpirations ?? []).map(e => ({
        id: e.id,
        title: e.title,
        date: formatDateShort(e.date),
        daysLeft: e.daysLeft,
        severity: getSeverity(e.daysLeft),
    }));

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Compliance Dashboard</h1>
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

            {/* Stats Grid */}
            <section className={styles.statsGrid}>
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
                <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.sectionTitle}>Upcoming Deadlines</h3>
                        <Link href="/dashboard/alerts" className={styles.viewAll}>
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
                </section>

                {/* Recent Alerts (demo-only for now) */}
                <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.sectionTitle}>Recent Alerts</h3>
                        <Link href="/dashboard/alerts" className={styles.viewAll}>
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
                        }) : (
                            <p style={{ color: "#94a3b8", fontSize: "0.875rem", textAlign: "center", padding: "1rem" }}>
                                No recent alerts.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
