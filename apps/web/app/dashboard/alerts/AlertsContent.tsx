"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
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
} from "lucide-react";
import styles from "./page.module.css";
import { useDemoMode } from "../../components/DemoModeContext";
import EmptyState from "../../components/EmptyState";
import { resolveAlert, dismissAlert } from "../../actions/alerts";
import type { AlertData } from "../../actions/alerts";

// Demo mock alerts (kept for demo mode)
const mockAlerts = [
    {
        id: "1", title: "CDL Expiration — John Smith",
        message: "CDL D1234567 (Texas) expires on February 15, 2026. Driver will be non-compliant if not renewed before expiration.",
        severity: "CRITICAL", alertType: "EXPIRATION_WARNING", entityType: "driver", entityId: "1",
        dueDate: "2026-02-15T00:00:00.000Z", status: "ACTIVE", createdAt: "2026-02-09T00:00:00.000Z",
    },
    {
        id: "2", title: "Annual DOT Inspection Overdue — Unit 103",
        message: "Kenworth T680 (Unit 103) annual DOT inspection was due Feb 22, 2026 and is now overdue.",
        severity: "CRITICAL", alertType: "COMPLIANCE_ISSUE", entityType: "vehicle", entityId: "3",
        dueDate: "2026-02-22T00:00:00.000Z", status: "ACTIVE", createdAt: "2026-02-23T00:00:00.000Z",
    },
    {
        id: "3", title: "Medical Card Expiring — Mike Johnson",
        message: "Medical examiner's certificate for Mike Johnson expires March 1, 2026.",
        severity: "URGENT", alertType: "EXPIRATION_WARNING", entityType: "driver", entityId: "3",
        dueDate: "2026-03-01T00:00:00.000Z", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z",
    },
    {
        id: "4", title: "MVR Annual Check Due — 3 Drivers",
        message: "Annual Motor Vehicle Record checks are due for Sarah Davis, Emily Brown, and Robert Wilson by March 15, 2026.",
        severity: "URGENT", alertType: "COMPLIANCE_ISSUE", entityType: "driver", entityId: "",
        dueDate: "2026-03-15T00:00:00.000Z", status: "ACTIVE", createdAt: "2026-02-15T00:00:00.000Z",
    },
    {
        id: "5", title: "Clearinghouse Query Missing — Robert Davis",
        message: "No FMCSA Clearinghouse query on file for Robert Davis. Annual queries are required.",
        severity: "WARNING", alertType: "MISSING_DOCUMENT", entityType: "driver", entityId: "5",
        dueDate: null, status: "ACTIVE", createdAt: "2026-03-01T00:00:00.000Z",
    },
    {
        id: "6", title: "PM Service Due — Unit 101",
        message: "Preventive maintenance for Unit 101 is due in 14 days.",
        severity: "INFO", alertType: "UPCOMING_DEADLINE", entityType: "vehicle", entityId: "1",
        dueDate: "2026-04-20T00:00:00.000Z", status: "ACTIVE", createdAt: "2026-03-01T00:00:00.000Z",
    },
] satisfies AlertData[];

const filterTabs = [
    { label: "All Alerts", value: "all" },
    { label: "Critical", value: "CRITICAL" },
    { label: "Urgent", value: "URGENT" },
    { label: "Expirations", value: "EXPIRATION_WARNING" },
    { label: "Missing Docs", value: "MISSING_DOCUMENT" },
    { label: "Compliance", value: "COMPLIANCE_ISSUE" },
    { label: "Deadlines", value: "UPCOMING_DEADLINE" },
];

function getAlertIcon(alertType: string) {
    switch (alertType) {
        case "EXPIRATION_WARNING": return Clock;
        case "MISSING_DOCUMENT": return FileText;
        case "COMPLIANCE_ISSUE": return Shield;
        case "VIOLATION_ALERT": return AlertTriangle;
        case "UPCOMING_DEADLINE": return Calendar;
        default: return Bell;
    }
}

function getEntityIcon(entityType: string | null) {
    switch (entityType) {
        case "driver": return <Users size={12} />;
        case "vehicle": return <Truck size={12} />;
        default: return <Shield size={12} />;
    }
}

function severityClass(s: string): string {
    return s.toLowerCase();
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

export default function AlertsContent({ alerts: serverAlerts }: { alerts: AlertData[] }) {
    const { isDemoMode } = useDemoMode();
    const initialAlerts = isDemoMode ? mockAlerts : serverAlerts;
    const [alerts, setAlerts] = useState<AlertData[]>(initialAlerts);
    const [activeFilter, setActiveFilter] = useState("all");
    const [isPending, startTransition] = useTransition();

    const activeAlerts = alerts.filter((a) => a.status === "ACTIVE");

    if (activeAlerts.length === 0 && !isDemoMode) {
        return (
            <div className={styles.alerts}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Alerts & Notifications</h1>
                        <p className={styles.subtitle}>Monitor compliance deadlines, expirations, and action items</p>
                    </div>
                </div>
                <EmptyState
                    icon={Bell}
                    title="No alerts yet"
                    description="Once you add drivers, vehicles, and set up your compliance profile, alerts for upcoming deadlines and expirations will appear here automatically."
                    primaryAction={{ label: "Start Compliance Setup", href: "/dashboard/documents/wizard" }}
                />
            </div>
        );
    }

    const filteredAlerts = activeAlerts.filter((alert) => {
        if (activeFilter === "all") return true;
        if (["CRITICAL", "URGENT"].includes(activeFilter)) return alert.severity === activeFilter;
        return alert.alertType === activeFilter;
    });

    const handleDismiss = (id: string) => {
        setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: "DISMISSED" } : a)));
        if (!isDemoMode) {
            startTransition(() => { dismissAlert(id); });
        }
    };

    const handleResolve = (id: string) => {
        setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: "RESOLVED" } : a)));
        if (!isDemoMode) {
            startTransition(() => { resolveAlert(id); });
        }
    };

    const handleMarkAllRead = () => {
        const ids = activeAlerts.map((a) => a.id);
        setAlerts((prev) => prev.map((a) => (ids.includes(a.id) ? { ...a, status: "DISMISSED" } : a)));
        if (!isDemoMode) {
            startTransition(() => { ids.forEach((id) => dismissAlert(id)); });
        }
    };

    const criticalCount = activeAlerts.filter((a) => a.severity === "CRITICAL").length;
    const urgentCount = activeAlerts.filter((a) => a.severity === "URGENT").length;
    const warningCount = activeAlerts.filter((a) => a.severity === "WARNING").length;
    const resolvedCount = alerts.filter((a) => a.status === "RESOLVED").length;

    const getFilterCount = (value: string) => {
        if (value === "all") return activeAlerts.length;
        if (["CRITICAL", "URGENT"].includes(value)) return activeAlerts.filter((a) => a.severity === value).length;
        return activeAlerts.filter((a) => a.alertType === value).length;
    };

    return (
        <div className={styles.alerts}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>Alerts & Notifications</h1>
                    <p className={styles.subtitle}>
                        Monitor compliance deadlines, expirations, and action items
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.markAllBtn} onClick={handleMarkAllRead}>
                        <Check size={16} /> Dismiss All
                    </button>
                </div>
            </div>

            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <div className={`${styles.summaryIcon} ${styles.critical}`}><XCircle size={24} /></div>
                    <div><div className={styles.summaryCount}>{criticalCount}</div><div className={styles.summaryLabel}>Critical</div></div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={`${styles.summaryIcon} ${styles.urgent}`}><AlertTriangle size={24} /></div>
                    <div><div className={styles.summaryCount}>{urgentCount}</div><div className={styles.summaryLabel}>Urgent</div></div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={`${styles.summaryIcon} ${styles.warning}`}><Bell size={24} /></div>
                    <div><div className={styles.summaryCount}>{warningCount}</div><div className={styles.summaryLabel}>Warning</div></div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={`${styles.summaryIcon} ${styles.resolved}`}><CheckCircle size={24} /></div>
                    <div><div className={styles.summaryCount}>{resolvedCount}</div><div className={styles.summaryLabel}>Resolved</div></div>
                </div>
            </div>

            <div className={styles.filterBar}>
                {filterTabs.map((tab) => (
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

            {filteredAlerts.length > 0 ? (
                <div className={styles.alertList}>
                    {filteredAlerts.map((alert) => {
                        const Icon = getAlertIcon(alert.alertType);
                        const sev = severityClass(alert.severity);
                        return (
                            <div key={alert.id} className={styles.alertCard}>
                                <div className={`${styles.alertSeverityBar} ${styles[sev]}`} />
                                <div className={`${styles.alertCardIcon} ${styles[sev]}`}>
                                    <Icon size={20} />
                                </div>
                                <div className={styles.alertBody}>
                                    <div className={styles.alertHeader}>
                                        <span className={styles.alertTitle}>{alert.title}</span>
                                        <span className={`${styles.alertBadge} ${styles[sev]}`}>
                                            {alert.severity.toLowerCase()}
                                        </span>
                                    </div>
                                    <p className={styles.alertMessage}>{alert.message}</p>
                                    <div className={styles.alertMeta}>
                                        {alert.entityType && (() => {
                                            const entityHref = alert.entityId
                                                ? alert.entityType === "driver"
                                                    ? `/dashboard/drivers/${alert.entityId}`
                                                    : `/dashboard/vehicles/${alert.entityId}`
                                                : null;
                                            const label = alert.entityType === "driver" ? "Driver" : "Vehicle";
                                            return entityHref ? (
                                                <Link href={entityHref} className={styles.alertMetaItem} style={{ color: "#3b82f6", textDecoration: "none" }}>
                                                    {getEntityIcon(alert.entityType)}
                                                    View {label}
                                                </Link>
                                            ) : (
                                                <span className={styles.alertMetaItem}>
                                                    {getEntityIcon(alert.entityType)}
                                                    {label}
                                                </span>
                                            );
                                        })()}
                                        <span className={styles.alertMetaItem}>
                                            <Calendar size={12} />
                                            {formatDate(alert.createdAt)}
                                        </span>
                                        {alert.dueDate && (
                                            <span className={styles.alertMetaItem}>
                                                <Clock size={12} />
                                                Due: {formatDate(alert.dueDate)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.alertActions}>
                                    <button
                                        className={`${styles.alertActionBtn} ${styles.resolve}`}
                                        onClick={() => handleResolve(alert.id)}
                                        title="Mark as resolved"
                                    >
                                        <Check size={14} /> Resolve
                                    </button>
                                    <button
                                        className={`${styles.alertActionBtn} ${styles.dismiss}`}
                                        onClick={() => handleDismiss(alert.id)}
                                        title="Dismiss this alert"
                                    >
                                        <X size={14} /> Dismiss
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}><CheckCircle size={32} /></div>
                    <h3 className={styles.emptyTitle}>All Clear!</h3>
                    <p className={styles.emptyMessage}>
                        No alerts match your current filter. Your fleet compliance is looking great.
                    </p>
                </div>
            )}
        </div>
    );
}
