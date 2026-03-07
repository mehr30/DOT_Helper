"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Clock,
    AlertTriangle,
    CheckCircle,
    Play,
    Pause,
    Moon,
    Coffee,
    TrendingUp,
    Calendar,
    Filter,
    Search,
    Info,
} from "lucide-react";
import styles from "./page.module.css";
import { useDemoMode } from "../../components/DemoModeContext";
import EmptyState from "../../components/EmptyState";

// Mock HOS data
const driversHOS = [
    {
        id: "1",
        name: "John Smith",
        status: "driving",
        currentDuty: "On Duty - Driving",
        drivingRemaining: "8:45",
        dutyRemaining: "12:30",
        cycleRemaining: "52:15",
        lastUpdate: "2 min ago",
        violations: 0
    },
    {
        id: "2",
        name: "Sarah Wilson",
        status: "on_duty",
        currentDuty: "On Duty - Not Driving",
        drivingRemaining: "11:00",
        dutyRemaining: "10:45",
        cycleRemaining: "48:00",
        lastUpdate: "5 min ago",
        violations: 0
    },
    {
        id: "3",
        name: "Mike Johnson",
        status: "sleeper",
        currentDuty: "Resting",
        drivingRemaining: "11:00",
        dutyRemaining: "14:00",
        cycleRemaining: "60:00",
        lastUpdate: "1 hour ago",
        violations: 0
    },
    {
        id: "4",
        name: "Emily Brown",
        status: "off_duty",
        currentDuty: "Off Duty",
        drivingRemaining: "11:00",
        dutyRemaining: "14:00",
        cycleRemaining: "58:30",
        lastUpdate: "3 hours ago",
        violations: 0
    },
    {
        id: "5",
        name: "Robert Davis",
        status: "driving",
        currentDuty: "On Duty - Driving",
        drivingRemaining: "2:15",
        dutyRemaining: "5:30",
        cycleRemaining: "32:00",
        lastUpdate: "1 min ago",
        violations: 1
    }
];

const statusConfig = {
    driving: { label: "Driving", icon: Play, color: "success" },
    on_duty: { label: "On Duty", icon: Coffee, color: "warning" },
    sleeper: { label: "Resting", icon: Moon, color: "info" },
    off_duty: { label: "Off Duty", icon: Pause, color: "neutral" }
};

function parseTime(timeStr: string): number {
    const parts = timeStr.split(":");
    const hours = Number(parts[0]) || 0;
    const minutes = Number(parts[1]) || 0;
    return hours * 60 + minutes;
}

function getTimeClass(timeStr: string): string {
    const minutes = parseTime(timeStr);
    if (minutes <= 60) return styles.critical ?? "";
    if (minutes <= 180) return styles.warning ?? "";
    return "";
}

export default function HOSPage() {
    const { isDemoMode } = useDemoMode();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showLearnMore, setShowLearnMore] = useState(false);

    const filteredDrivers = isDemoMode ? driversHOS.filter(d => {
        const matchesSearch = searchTerm === "" || d.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || d.status === statusFilter;
        return matchesSearch && matchesStatus;
    }) : [];

    const drivingNow = isDemoMode ? driversHOS.filter(d => d.status === "driving").length : 0;
    const onDuty = isDemoMode ? driversHOS.filter(d => d.status === "on_duty").length : 0;
    const violations = isDemoMode ? driversHOS.reduce((sum, d) => sum + d.violations, 0) : 0;

    if (!isDemoMode) {
        return (
            <div className={styles.page}>
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>Driver Hours</h1>
                        <p className={styles.subtitle}>Track how long your drivers have been on the road</p>
                    </div>
                </header>
                <EmptyState
                    icon={Clock}
                    title="Driver Hours Tracking"
                    description="This shows how long your drivers have been driving each day to make sure they're getting enough rest. Federal law limits driving to 11 hours per day. Once you connect an electronic logbook (ELD), you'll see real-time status here."
                    primaryAction={{ label: "Connect Logbook", href: "/dashboard/settings" }}
                    secondaryAction={{ label: "Add Drivers", href: "/dashboard/drivers" }}
                />
                {/* Learn More info box */}
                <div style={{
                    marginTop: "1rem", padding: "1rem 1.25rem", background: "#f8fafc",
                    borderRadius: "12px", border: "1px solid #e2e8f0", maxWidth: "640px",
                    marginLeft: "auto", marginRight: "auto",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <Info size={16} style={{ color: "#3b82f6" }} />
                        <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1e293b" }}>What are Driver Hours?</span>
                    </div>
                    <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                        The federal government requires commercial drivers to take regular breaks.
                        Drivers can drive a maximum of <strong>11 hours</strong> after 10 consecutive hours off duty,
                        and must not drive beyond the <strong>14th consecutive hour</strong> after coming on duty.
                        Over a week, drivers are limited to <strong>70 hours</strong> on duty in any 8-day period.
                        An electronic logbook (ELD) automatically records driving time so you stay compliant.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Driver Hours</h1>
                    <p className={styles.subtitle}>
                        Monitor driver hours and ensure everyone is getting enough rest
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <button className="btn btn-secondary" onClick={() => alert("Log viewer will display detailed electronic logbook data in the production release.")}>
                        <Calendar size={18} />
                        View Logs
                    </button>
                    <Link href="/dashboard/reports" className="btn btn-primary">
                        <TrendingUp size={18} />
                        Run Report
                    </Link>
                </div>
            </header>

            {/* Demo banner */}
            <div style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.6rem 1rem", borderRadius: "8px",
                background: "#f1f5f9", border: "1px dashed #cbd5e1",
                color: "#64748b", fontSize: "0.82rem", marginBottom: "0.75rem",
            }}>
                <Info size={16} />
                You&apos;re viewing sample data. Connect an electronic logbook (ELD) to see real driver hours.
            </div>

            {/* Status Overview */}
            <div className="demoWrapper" style={{ marginBottom: "1rem" }}>
                <div className={styles.statusGrid}>
                    <div className={`${styles.statusCard} ${styles.driving}`}>
                        <Play size={24} />
                        <div className={styles.statusInfo}>
                            <span className={styles.statusValue}>{drivingNow}</span>
                            <span className={styles.statusLabel}>Currently Driving</span>
                        </div>
                    </div>
                    <div className={`${styles.statusCard} ${styles.onDuty}`}>
                        <Coffee size={24} />
                        <div className={styles.statusInfo}>
                            <span className={styles.statusValue}>{onDuty}</span>
                            <span className={styles.statusLabel}>On Duty</span>
                        </div>
                    </div>
                    <div className={`${styles.statusCard} ${styles.sleeper}`}>
                        <Moon size={24} />
                        <div className={styles.statusInfo}>
                            <span className={styles.statusValue}>
                                {driversHOS.filter(d => d.status === "sleeper").length}
                            </span>
                            <span className={styles.statusLabel}>Resting</span>
                        </div>
                    </div>
                    <div className={`${styles.statusCard} ${styles.violations}`}>
                        <AlertTriangle size={24} />
                        <div className={styles.statusInfo}>
                            <span className={styles.statusValue}>{violations}</span>
                            <span className={styles.statusLabel}>Violations Today</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search drivers..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                        padding: "0.5rem 0.75rem", borderRadius: "8px",
                        border: "1px solid #e2e8f0", fontSize: "0.85rem",
                        color: "#334155", cursor: "pointer",
                    }}
                >
                    <option value="all">All Status</option>
                    <option value="driving">Driving</option>
                    <option value="on_duty">On Duty</option>
                    <option value="sleeper">Resting</option>
                    <option value="off_duty">Off Duty</option>
                </select>
            </div>

            {/* Drivers HOS Table */}
            <div className="demoWrapper">
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Driver</th>
                                <th>Current Status</th>
                                <th>Drive Time Left</th>
                                <th>Shift Time Left</th>
                                <th>Weekly Hours Left</th>
                                <th>Last Update</th>
                                <th>Violations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDrivers.map((driver) => {
                                const config = statusConfig[driver.status as keyof typeof statusConfig];
                                const StatusIcon = config.icon;

                                return (
                                    <tr key={driver.id}>
                                        <td>
                                            <Link href={`/dashboard/hos/${driver.id}`} className={styles.driverLink}>
                                                <div className={styles.driverAvatar}>
                                                    {driver.name.split(" ").map(n => n[0]).join("")}
                                                </div>
                                                <span className={styles.driverName}>{driver.name}</span>
                                            </Link>
                                        </td>
                                        <td>
                                            <div className={`${styles.statusBadge} ${styles[config.color]}`}>
                                                <StatusIcon size={14} />
                                                <span>{config.label}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.timeValue} ${getTimeClass(driver.drivingRemaining)}`}>
                                                <Clock size={14} />
                                                {driver.drivingRemaining}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`${styles.timeValue} ${getTimeClass(driver.dutyRemaining)}`}>
                                                {driver.dutyRemaining}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={styles.timeValue}>
                                                {driver.cycleRemaining}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={styles.lastUpdate}>{driver.lastUpdate}</span>
                                        </td>
                                        <td>
                                            {driver.violations > 0 ? (
                                                <span className={styles.violationBadge}>
                                                    <AlertTriangle size={14} />
                                                    {driver.violations}
                                                </span>
                                            ) : (
                                                <span className={styles.compliantBadge}>
                                                    <CheckCircle size={14} />
                                                    Compliant
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Box */}
            <div className={styles.infoBox}>
                <AlertTriangle size={18} />
                <div>
                    <strong>Electronic Logbook Required</strong>
                    <p>
                        Connect your electronic logbook (ELD) provider to enable real-time driver hours tracking.
                        <Link href="/dashboard/settings"> Configure integrations →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
