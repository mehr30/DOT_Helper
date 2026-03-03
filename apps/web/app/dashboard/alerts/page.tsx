"use client";

import { useState } from "react";
import {
    Bell,
    AlertTriangle,
    XCircle,
    Clock,
    FileText,
    Shield,
    CheckCircle,
    X,
    Check,
    Calendar,
    Truck,
    Users,
    Eye
} from "lucide-react";
import styles from "./page.module.css";
import { useDemoMode } from "../../components/DemoModeContext";
import EmptyState from "../../components/EmptyState";

type AlertSeverity = "critical" | "urgent" | "warning" | "info";
type AlertType = "expiration" | "missing" | "compliance" | "violation" | "system";

interface Alert {
    id: string;
    title: string;
    message: string;
    severity: AlertSeverity;
    type: AlertType;
    entity: string;
    entityType: "driver" | "vehicle" | "company";
    date: string;
    dueDate?: string;
    dismissed: boolean;
}

const mockAlerts: Alert[] = [
    {
        id: "1",
        title: "CDL Expiration — John Smith",
        message: "CDL D1234567 (Texas) expires on February 15, 2026. Driver will be non-compliant if not renewed before expiration.",
        severity: "critical",
        type: "expiration",
        entity: "John Smith",
        entityType: "driver",
        date: "Feb 9, 2026",
        dueDate: "Feb 15, 2026",
        dismissed: false,
    },
    {
        id: "2",
        title: "Annual DOT Inspection Overdue — Unit 103",
        message: "Kenworth T680 (Unit 103) annual DOT inspection was due Feb 22, 2026 and is now overdue. Vehicle must be taken out of service until inspected.",
        severity: "critical",
        type: "compliance",
        entity: "Unit 103",
        entityType: "vehicle",
        date: "Feb 23, 2026",
        dueDate: "Feb 22, 2026",
        dismissed: false,
    },
    {
        id: "3",
        title: "Medical Card Expiring — Mike Johnson",
        message: "Medical examiner's certificate for Mike Johnson expires March 1, 2026. Schedule renewal appointment immediately.",
        severity: "urgent",
        type: "expiration",
        entity: "Mike Johnson",
        entityType: "driver",
        date: "Feb 1, 2026",
        dueDate: "Mar 1, 2026",
        dismissed: false,
    },
    {
        id: "4",
        title: "MVR Annual Check Due — 3 Drivers",
        message: "Annual Motor Vehicle Record checks are due for Sarah Davis, Emily Brown, and Robert Wilson by March 15, 2026.",
        severity: "urgent",
        type: "compliance",
        entity: "Multiple Drivers",
        entityType: "driver",
        date: "Feb 15, 2026",
        dueDate: "Mar 15, 2026",
        dismissed: false,
    },
    {
        id: "5",
        title: "BOC-3 Filing Expiring",
        message: "BOC-3 Process Agent filing expires March 15, 2026. Contact your agent to renew before expiration to avoid authority revocation.",
        severity: "urgent",
        type: "expiration",
        entity: "Transport Co.",
        entityType: "company",
        date: "Jan 15, 2026",
        dueDate: "Mar 15, 2026",
        dismissed: false,
    },
    {
        id: "6",
        title: "HOS Violation Flagged — Robert Wilson",
        message: "Potential 14-hour rule violation detected on Feb 28, 2026. Robert Wilson logged 14.5 hours on-duty. Review ELD data and take corrective action.",
        severity: "warning",
        type: "violation",
        entity: "Robert Wilson",
        entityType: "driver",
        date: "Feb 28, 2026",
        dismissed: false,
    },
    {
        id: "7",
        title: "MCS-150 Biennial Update Due",
        message: "FMCSA MCS-150 Biennial Update is due in June 2026. Begin gathering vehicle counts, driver data, and mileage information.",
        severity: "warning",
        type: "compliance",
        entity: "Transport Co.",
        entityType: "company",
        date: "Jan 1, 2026",
        dueDate: "Jun 2026",
        dismissed: false,
    },
    {
        id: "8",
        title: "Preventive Maintenance Due — Unit 101",
        message: "Freightliner Cascadia (Unit 101) next PM service is due April 10, 2026 at 355,000 miles. Current mileage: 342,500.",
        severity: "warning",
        type: "compliance",
        entity: "Unit 101",
        entityType: "vehicle",
        date: "Feb 20, 2026",
        dueDate: "Apr 10, 2026",
        dismissed: false,
    },
    {
        id: "9",
        title: "Certificate of Violations Due — 3 Drivers",
        message: "Annual Certificate of Violations (Part 391.27) is due for 3 drivers. Drivers must certify all violations in the past 12 months.",
        severity: "warning",
        type: "missing",
        entity: "Multiple Drivers",
        entityType: "driver",
        date: "Jan 1, 2026",
        dueDate: "Jan 31, 2026",
        dismissed: false,
    },
    {
        id: "10",
        title: "Random Drug Test Selection",
        message: "Q2 2026 random drug & alcohol test selections have been made. 2 drivers selected. Schedule specimen collection within the quarter.",
        severity: "info",
        type: "system",
        entity: "Transport Co.",
        entityType: "company",
        date: "Mar 1, 2026",
        dismissed: false,
    },
    {
        id: "11",
        title: "Trailer Registration Renewal — T-202",
        message: "Great Dane trailer (T-202) registration expires July 2026. Begin renewal process 60 days prior.",
        severity: "info",
        type: "expiration",
        entity: "T-202",
        entityType: "vehicle",
        date: "Feb 1, 2026",
        dueDate: "Jul 2026",
        dismissed: false,
    },
    {
        id: "12",
        title: "IFTA Quarterly Filing Reminder",
        message: "IFTA quarterly fuel tax return for Q1 2026 is due April 30, 2026. Compile fuel receipts and mileage records.",
        severity: "info",
        type: "compliance",
        entity: "Transport Co.",
        entityType: "company",
        date: "Mar 1, 2026",
        dueDate: "Apr 30, 2026",
        dismissed: false,
    },
];

const filterTabs: { label: string; value: string }[] = [
    { label: "All Alerts", value: "all" },
    { label: "Critical", value: "critical" },
    { label: "Urgent", value: "urgent" },
    { label: "Expirations", value: "expiration" },
    { label: "Missing Docs", value: "missing" },
    { label: "Compliance", value: "compliance" },
    { label: "Violations", value: "violation" },
];

function getAlertIcon(type: AlertType) {
    switch (type) {
        case "expiration": return Clock;
        case "missing": return FileText;
        case "compliance": return Shield;
        case "violation": return AlertTriangle;
        default: return Bell;
    }
}

function getEntityIcon(entityType: string) {
    switch (entityType) {
        case "driver": return <Users size={12} />;
        case "vehicle": return <Truck size={12} />;
        default: return <Shield size={12} />;
    }
}

export default function AlertsPage() {
    const { isDemoMode } = useDemoMode();
    const [alerts, setAlerts] = useState<Alert[]>(isDemoMode ? mockAlerts : []);
    const [activeFilter, setActiveFilter] = useState("all");

    if (!isDemoMode) {
        return (
            <div className={styles.alerts}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Alerts & Notifications</h1>
                        <p className={styles.subtitle}>Monitor compliance deadlines, expirations, and action items</p>
                    </div>
                </div>
                <EmptyState
                    icon="🔔"
                    title="No alerts yet"
                    description="Once you add drivers, vehicles, and set up your compliance profile, alerts for upcoming deadlines and expirations will appear here automatically."
                    primaryAction={{ label: "Start Compliance Setup", href: "/dashboard/documents/wizard" }}
                />
            </div>
        );
    }

    const filteredAlerts = alerts.filter((alert) => {
        if (activeFilter === "all") return !alert.dismissed;
        if (["critical", "urgent"].includes(activeFilter)) return alert.severity === activeFilter && !alert.dismissed;
        return alert.type === activeFilter && !alert.dismissed;
    });

    const dismissAlert = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
    };

    const resolveAlert = (id: string) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    const activeAlerts = alerts.filter(a => !a.dismissed);
    const criticalCount = activeAlerts.filter(a => a.severity === "critical").length;
    const urgentCount = activeAlerts.filter(a => a.severity === "urgent").length;
    const warningCount = activeAlerts.filter(a => a.severity === "warning").length;
    const resolvedCount = mockAlerts.length - activeAlerts.length;

    const getFilterCount = (value: string) => {
        if (value === "all") return activeAlerts.length;
        if (["critical", "urgent"].includes(value)) return activeAlerts.filter(a => a.severity === value).length;
        return activeAlerts.filter(a => a.type === value).length;
    };

    return (
        <div className={styles.alerts}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Alerts & Notifications</h1>
                    <p className={styles.subtitle}>
                        Monitor compliance deadlines, expirations, and action items
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <button
                        className={styles.markAllBtn}
                        onClick={() => setAlerts(prev => prev.map(a => ({ ...a, dismissed: true })))}
                    >
                        <Check size={16} />
                        Mark All Read
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <div className={`${styles.summaryIcon} ${styles.critical}`}>
                        <XCircle size={24} />
                    </div>
                    <div>
                        <div className={styles.summaryCount}>{criticalCount}</div>
                        <div className={styles.summaryLabel}>Critical</div>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={`${styles.summaryIcon} ${styles.urgent}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <div className={styles.summaryCount}>{urgentCount}</div>
                        <div className={styles.summaryLabel}>Urgent</div>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={`${styles.summaryIcon} ${styles.warning}`}>
                        <Bell size={24} />
                    </div>
                    <div>
                        <div className={styles.summaryCount}>{warningCount}</div>
                        <div className={styles.summaryLabel}>Warning</div>
                    </div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={`${styles.summaryIcon} ${styles.resolved}`}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <div className={styles.summaryCount}>{resolvedCount}</div>
                        <div className={styles.summaryLabel}>Resolved</div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className={styles.filterBar}>
                {filterTabs.map(tab => (
                    <button
                        key={tab.value}
                        className={`${styles.filterTab} ${activeFilter === tab.value ? styles.active : ""}`}
                        onClick={() => setActiveFilter(tab.value)}
                    >
                        {tab.label}
                        <span className={styles.filterCount}>{getFilterCount(tab.value)}</span>
                    </button>
                ))}
            </div>

            {/* Alert List */}
            {filteredAlerts.length > 0 ? (
                <div className={styles.alertList}>
                    {filteredAlerts.map((alert) => {
                        const Icon = getAlertIcon(alert.type);
                        return (
                            <div key={alert.id} className={`${styles.alertCard} ${alert.dismissed ? styles.dismissed : ""}`}>
                                <div className={`${styles.alertSeverityBar} ${styles[alert.severity]}`} />
                                <div className={`${styles.alertCardIcon} ${styles[alert.severity]}`}>
                                    <Icon size={20} />
                                </div>
                                <div className={styles.alertBody}>
                                    <div className={styles.alertHeader}>
                                        <span className={styles.alertTitle}>{alert.title}</span>
                                        <span className={`${styles.alertBadge} ${styles[alert.severity]}`}>
                                            {alert.severity}
                                        </span>
                                    </div>
                                    <p className={styles.alertMessage}>{alert.message}</p>
                                    <div className={styles.alertMeta}>
                                        <span className={styles.alertMetaItem}>
                                            {getEntityIcon(alert.entityType)}
                                            {alert.entity}
                                        </span>
                                        <span className={styles.alertMetaItem}>
                                            <Calendar size={12} />
                                            {alert.date}
                                        </span>
                                        {alert.dueDate && (
                                            <span className={styles.alertMetaItem}>
                                                <Clock size={12} />
                                                Due: {alert.dueDate}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.alertActions}>
                                    <button
                                        className={`${styles.alertActionBtn} ${styles.resolve}`}
                                        onClick={() => resolveAlert(alert.id)}
                                        title="Resolve"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        className={`${styles.alertActionBtn} ${styles.dismiss}`}
                                        onClick={() => dismissAlert(alert.id)}
                                        title="Dismiss"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <CheckCircle size={32} />
                    </div>
                    <h3 className={styles.emptyTitle}>All Clear!</h3>
                    <p className={styles.emptyMessage}>
                        No alerts match your current filter. Your fleet compliance is looking great.
                    </p>
                </div>
            )}
        </div>
    );
}
