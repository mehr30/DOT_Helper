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

function computeDaysLeft(dateStr: string): number {
    const target = new Date(dateStr);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getSeverity(daysLeft: number): string {
    if (daysLeft < 0) return "expired";
    if (daysLeft <= 7) return "urgent";
    if (daysLeft <= 30) return "warning";
    return "info";
}

// Mock data - in production this would come from the database
const complianceScore = 87;

const stats = [
    {
        label: "Active Drivers",
        value: "12",
        icon: Users,
        color: "primary",
        change: "+2 this month",
    },
    {
        label: "Vehicles",
        value: "8",
        icon: Truck,
        color: "success",
        change: "All compliant",
    },
    {
        label: "Pending Actions",
        value: "5",
        icon: Clock,
        color: "warning",
        change: "3 urgent",
    },
    {
        label: "Clearinghouse",
        value: "100%",
        icon: Shield,
        color: "success",
        change: "All queries current",
    },
];

const upcomingDeadlinesRaw = [
    {
        id: 1,
        title: "CDL Expiration - John Smith",
        date: "Feb 15, 2026",
        type: "driver",
        formId: "driverApp",
    },
    {
        id: 2,
        title: "Annual DOT Inspection - Unit 103",
        date: "Feb 22, 2026",
        type: "vehicle",
        formId: "dvir",
    },
    {
        id: 3,
        title: "Medical Card - Mike Johnson",
        date: "Apr 01, 2026",
        type: "driver",
        formId: "driverApp",
    },
    {
        id: 4,
        title: "MCS-150 Biennial Update",
        date: "Jun 15, 2026",
        type: "company",
        formId: "mcs150",
    },
];

const upcomingDeadlines = upcomingDeadlinesRaw.map(d => ({
    ...d,
    daysLeft: computeDaysLeft(d.date),
    severity: getSeverity(computeDaysLeft(d.date)),
}));

const recentAlerts = [
    {
        id: 1,
        icon: AlertTriangle,
        title: "HOS Violation Detected",
        message: "Driver exceeded 11-hour driving limit",
        time: "2 hours ago",
        severity: "danger",
    },
    {
        id: 2,
        icon: FileWarning,
        title: "Missing Document",
        message: "MVR not on file for Sarah Wilson",
        time: "5 hours ago",
        severity: "warning",
    },
    {
        id: 3,
        icon: CheckCircle,
        title: "Inspection Completed",
        message: "Unit 105 passed annual DOT inspection",
        time: "1 day ago",
        severity: "success",
    },
];

const quickActions = [
    { label: "Add Driver", href: "/dashboard/drivers", icon: Users },
    { label: "Add Vehicle", href: "/dashboard/vehicles", icon: Truck },
    { label: "Compliance Setup", href: "/dashboard/documents/wizard", icon: ClipboardList },
    { label: "Compliance", href: "/dashboard/compliance", icon: Shield },
];

export default function DashboardPage() {
    const { isDemoMode } = useDemoMode();

    if (!isDemoMode) {
        return (
            <div className={styles.dashboard}>
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Compliance Dashboard</h1>
                        <p className={styles.subtitle}>
                            Welcome! Let&apos;s get your DOT compliance set up.
                        </p>
                    </div>
                    <div className={styles.dateDisplay}>
                        <Calendar size={18} />
                        <span>{new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}</span>
                    </div>
                </header>

                {/* Getting Started */}
                <section style={{
                    maxWidth: 720,
                    margin: "2rem auto",
                    textAlign: "center" as const,
                }}>
                    <div style={{
                        fontSize: "3rem",
                        marginBottom: "1rem",
                    }}>🚀</div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>
                        Get started in 3 steps
                    </h2>
                    <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                        Set up your DOT compliance profile, add your drivers and vehicles,
                        and we&apos;ll handle the rest.
                    </p>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem",
                    }}>
                        <Link href="/dashboard/documents/wizard" style={{
                            display: "flex", flexDirection: "column" as const, alignItems: "center",
                            gap: "0.75rem", padding: "1.5rem", background: "white",
                            borderRadius: "14px", border: "2px solid #3b82f6",
                            textDecoration: "none", transition: "box-shadow 0.2s",
                        }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: "14px",
                                background: "#eff6ff", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                color: "#3b82f6",
                            }}>
                                <ClipboardList size={24} />
                            </div>
                            <span style={{ fontWeight: 600, color: "#0f172a" }}>1. Compliance Setup</span>
                            <span style={{ fontSize: "0.825rem", color: "#64748b", textAlign: "center" as const }}>
                                Answer questions about your business to find out what you need
                            </span>
                        </Link>

                        <Link href="/dashboard/drivers" style={{
                            display: "flex", flexDirection: "column" as const, alignItems: "center",
                            gap: "0.75rem", padding: "1.5rem", background: "white",
                            borderRadius: "14px", border: "1px solid #e2e8f0",
                            textDecoration: "none",
                        }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: "14px",
                                background: "#f1f5f9", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                color: "#475569",
                            }}>
                                <Users size={24} />
                            </div>
                            <span style={{ fontWeight: 600, color: "#0f172a" }}>2. Add Drivers</span>
                            <span style={{ fontSize: "0.825rem", color: "#64748b", textAlign: "center" as const }}>
                                Add your drivers and their qualification files
                            </span>
                        </Link>

                        <Link href="/dashboard/vehicles" style={{
                            display: "flex", flexDirection: "column" as const, alignItems: "center",
                            gap: "0.75rem", padding: "1.5rem", background: "white",
                            borderRadius: "14px", border: "1px solid #e2e8f0",
                            textDecoration: "none",
                        }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: "14px",
                                background: "#f1f5f9", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                color: "#475569",
                            }}>
                                <Truck size={24} />
                            </div>
                            <span style={{ fontWeight: 600, color: "#0f172a" }}>3. Add Vehicles</span>
                            <span style={{ fontSize: "0.825rem", color: "#64748b", textAlign: "center" as const }}>
                                Register your fleet vehicles with GVWR and details
                            </span>
                        </Link>
                    </div>

                    <p style={{
                        marginTop: "2rem",
                        padding: "1rem 1.5rem",
                        background: "#f8fafc",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        fontSize: "0.825rem",
                        color: "#64748b",
                    }}>
                        💡 <strong>Tip:</strong> Switch to <strong>Demo</strong> mode in the sidebar to see how the dashboard looks with sample data.
                    </p>
                </section>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            {/* Header */}
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
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    })}</span>
                </div>
            </header>

            {/* Compliance Score Card */}
            <section className={styles.scoreSection}>
                <div className={styles.scoreCard}>
                    <div className={styles.scoreContent}>
                        <div className={styles.scoreCircle} style={{ "--score": complianceScore } as React.CSSProperties}>
                            <div className={styles.scoreInner}>
                                <span className={styles.scoreValue}>{complianceScore}</span>
                                <span className={styles.scoreLabel}>Score</span>
                            </div>
                        </div>
                        <div className={styles.scoreDetails}>
                            <h2 className={styles.scoreTitle}>
                                {complianceScore >= 90 ? "Excellent Compliance" :
                                    complianceScore >= 70 ? "Good Compliance" : "Needs Attention"}
                            </h2>
                            <p className={styles.scoreDescription}>
                                Your overall DOT compliance score based on driver qualifications,
                                vehicle inspections, and documentation status.
                            </p>
                            <div className={styles.scoreBreakdown}>
                                <div className={styles.breakdownItem}>
                                    <span className={styles.breakdownLabel}>Driver Files</span>
                                    <div className={styles.breakdownBar}>
                                        <div className={styles.breakdownFill} style={{ width: "92%" }} />
                                    </div>
                                    <span className={styles.breakdownValue}>92%</span>
                                </div>
                                <div className={styles.breakdownItem}>
                                    <span className={styles.breakdownLabel}>Vehicle Compliance</span>
                                    <div className={styles.breakdownBar}>
                                        <div className={styles.breakdownFill} style={{ width: "88%" }} />
                                    </div>
                                    <span className={styles.breakdownValue}>88%</span>
                                </div>
                                <div className={styles.breakdownItem}>
                                    <span className={styles.breakdownLabel}>Documentation</span>
                                    <div className={styles.breakdownBar}>
                                        <div className={styles.breakdownFill} style={{ width: "81%" }} />
                                    </div>
                                    <span className={styles.breakdownValue}>81%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Grid */}
            <section className={styles.statsGrid}>
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className={`${styles.statCard} ${styles[stat.color]}`}>
                            <div className={styles.statIcon}>
                                <Icon size={24} />
                            </div>
                            <div className={styles.statContent}>
                                <span className={styles.statValue}>{stat.value}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                                <span className={styles.statChange}>{stat.change}</span>
                            </div>
                        </div>
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
                        <Link href="/dashboard/documents" className={styles.viewAll}>
                            View all <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className={styles.deadlineList}>
                        {upcomingDeadlines.map((deadline) => (
                            <Link
                                key={deadline.id}
                                href={`/dashboard/documents/wizard?form=${deadline.formId}`}
                                className={styles.deadlineItem}
                                style={{ textDecoration: "none", cursor: "pointer" }}
                            >
                                <div className={`${styles.deadlineIndicator} ${styles[deadline.severity]}`} />
                                <div className={styles.deadlineContent}>
                                    <span className={styles.deadlineTitle}>{deadline.title}</span>
                                    <span className={styles.deadlineDate}>{deadline.date}</span>
                                </div>
                                <span className={`${styles.daysLeft} ${styles[deadline.severity]}`}>
                                    {deadline.daysLeft < 0 ? `${Math.abs(deadline.daysLeft)}d overdue` : `${deadline.daysLeft} days`}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Recent Alerts */}
                <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.sectionTitle}>Recent Alerts</h3>
                        <Link href="/dashboard/alerts" className={styles.viewAll}>
                            View all <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className={styles.alertList}>
                        {recentAlerts.map((alert) => {
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
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}
