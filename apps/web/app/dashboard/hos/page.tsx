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
    Search
} from "lucide-react";
import styles from "./page.module.css";

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
        currentDuty: "Sleeper Berth",
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
    sleeper: { label: "Sleeper", icon: Moon, color: "info" },
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
    const drivingNow = driversHOS.filter(d => d.status === "driving").length;
    const onDuty = driversHOS.filter(d => d.status === "on_duty").length;
    const violations = driversHOS.reduce((sum, d) => sum + d.violations, 0);

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Hours of Service</h1>
                    <p className={styles.subtitle}>
                        Monitor driver hours and ensure HOS compliance in real-time
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <button className="btn btn-secondary">
                        <Calendar size={18} />
                        View Logs
                    </button>
                    <button className="btn btn-primary">
                        <TrendingUp size={18} />
                        Run Report
                    </button>
                </div>
            </header>

            {/* Status Overview */}
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
                        <span className={styles.statusLabel}>Sleeper Berth</span>
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

            {/* Search and Filter */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search drivers..."
                        className={styles.searchInput}
                    />
                </div>
                <button className={styles.filterButton}>
                    <Filter size={18} />
                    Filter by Status
                </button>
            </div>

            {/* Drivers HOS Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Driver</th>
                            <th>Current Status</th>
                            <th>Driving Time Left</th>
                            <th>Duty Time Left</th>
                            <th>70-Hr Cycle Left</th>
                            <th>Last Update</th>
                            <th>Violations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {driversHOS.map((driver) => {
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

            {/* Info Box */}
            <div className={styles.infoBox}>
                <AlertTriangle size={18} />
                <div>
                    <strong>ELD Integration Required</strong>
                    <p>
                        Connect your ELD provider to enable real-time HOS tracking.
                        <Link href="/dashboard/settings/integrations"> Configure integrations →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
