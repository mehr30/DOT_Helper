import Link from "next/link";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    AlertTriangle,
    Clock,
    FileText
} from "lucide-react";
import styles from "./page.module.css";

// Mock data - would come from database in production
const drivers = [
    {
        id: "1",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        phone: "(555) 123-4567",
        cdlNumber: "D1234567",
        cdlState: "TX",
        cdlExpiration: "2026-02-15",
        medicalExpiration: "2026-08-20",
        status: "active",
        complianceScore: 95,
        missingDocs: 0,
        expiringDocs: 1,
    },
    {
        id: "2",
        firstName: "Sarah",
        lastName: "Wilson",
        email: "sarah.wilson@example.com",
        phone: "(555) 234-5678",
        cdlNumber: "D2345678",
        cdlState: "TX",
        cdlExpiration: "2027-05-10",
        medicalExpiration: "2026-04-15",
        status: "active",
        complianceScore: 78,
        missingDocs: 2,
        expiringDocs: 1,
    },
    {
        id: "3",
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike.johnson@example.com",
        phone: "(555) 345-6789",
        cdlNumber: "D3456789",
        cdlState: "OK",
        cdlExpiration: "2026-11-25",
        medicalExpiration: "2026-03-01",
        status: "active",
        complianceScore: 88,
        missingDocs: 1,
        expiringDocs: 2,
    },
    {
        id: "4",
        firstName: "Emily",
        lastName: "Brown",
        email: "emily.brown@example.com",
        phone: "(555) 456-7890",
        cdlNumber: "D4567890",
        cdlState: "TX",
        cdlExpiration: "2027-03-18",
        medicalExpiration: "2027-01-10",
        status: "active",
        complianceScore: 100,
        missingDocs: 0,
        expiringDocs: 0,
    },
    {
        id: "5",
        firstName: "Robert",
        lastName: "Davis",
        email: "robert.davis@example.com",
        phone: "(555) 567-8901",
        cdlNumber: "D5678901",
        cdlState: "TX",
        cdlExpiration: "2026-09-05",
        medicalExpiration: "2026-06-20",
        status: "inactive",
        complianceScore: 65,
        missingDocs: 3,
        expiringDocs: 2,
    },
];

function getComplianceStatus(score: number) {
    if (score >= 90) return { label: "Compliant", class: "success" };
    if (score >= 70) return { label: "Needs Attention", class: "warning" };
    return { label: "Critical", class: "danger" };
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getDaysUntil(dateStr: string) {
    const date = new Date(dateStr);
    const today = new Date();
    const diff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
}

export default function DriversPage() {
    const activeDrivers = drivers.filter(d => d.status === "active").length;
    const needsAttention = drivers.filter(d => d.complianceScore < 90).length;

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Driver Management</h1>
                    <p className={styles.subtitle}>
                        Manage driver qualification files and compliance status
                    </p>
                </div>
                <Link href="/dashboard/drivers/new" className="btn btn-primary">
                    <Plus size={18} />
                    Add Driver
                </Link>
            </header>

            {/* Stats */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{drivers.length}</span>
                    <span className={styles.statLabel}>Total Drivers</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{activeDrivers}</span>
                    <span className={styles.statLabel}>Active</span>
                </div>
                <div className={styles.statCard}>
                    <span className={`${styles.statValue} ${styles.warning}`}>{needsAttention}</span>
                    <span className={styles.statLabel}>Need Attention</span>
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
                    Filter
                </button>
            </div>

            {/* Drivers Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Driver</th>
                            <th>CDL Info</th>
                            <th>Medical Card</th>
                            <th>Documents</th>
                            <th>Compliance</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map((driver) => {
                            const compliance = getComplianceStatus(driver.complianceScore);
                            const cdlDays = getDaysUntil(driver.cdlExpiration);
                            const medDays = getDaysUntil(driver.medicalExpiration);

                            return (
                                <tr key={driver.id}>
                                    <td>
                                        <Link href={`/dashboard/drivers/${driver.id}`} className={styles.driverLink}>
                                            <div className={styles.driverAvatar}>
                                                {driver.firstName[0]}{driver.lastName[0]}
                                            </div>
                                            <div className={styles.driverInfo}>
                                                <span className={styles.driverName}>
                                                    {driver.firstName} {driver.lastName}
                                                </span>
                                                <span className={styles.driverEmail}>{driver.email}</span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td>
                                        <div className={styles.cdlInfo}>
                                            <span className={styles.cdlNumber}>{driver.cdlNumber}</span>
                                            <span className={styles.cdlExpiry}>
                                                {cdlDays <= 30 && <Clock size={12} className={styles.warningIcon} />}
                                                Exp: {formatDate(driver.cdlExpiration)}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.medicalInfo}>
                                            <span className={`${styles.medicalExpiry} ${medDays <= 30 ? styles.expiringSoon : ""}`}>
                                                {medDays <= 30 && <AlertTriangle size={12} />}
                                                {formatDate(driver.medicalExpiration)}
                                            </span>
                                            <span className={styles.daysLeft}>
                                                {medDays} days left
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.docStatus}>
                                            {driver.missingDocs > 0 && (
                                                <span className={styles.docMissing}>
                                                    <FileText size={14} />
                                                    {driver.missingDocs} missing
                                                </span>
                                            )}
                                            {driver.expiringDocs > 0 && (
                                                <span className={styles.docExpiring}>
                                                    <Clock size={14} />
                                                    {driver.expiringDocs} expiring
                                                </span>
                                            )}
                                            {driver.missingDocs === 0 && driver.expiringDocs === 0 && (
                                                <span className={styles.docComplete}>
                                                    <CheckCircle size={14} />
                                                    Complete
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.complianceCell}>
                                            <div
                                                className={styles.complianceBar}
                                                style={{ "--score": driver.complianceScore } as React.CSSProperties}
                                            >
                                                <div className={`${styles.complianceFill} ${styles[compliance.class]}`} />
                                            </div>
                                            <span className={styles.complianceScore}>{driver.complianceScore}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${driver.status === "active" ? "badge-success" : "badge-neutral"}`}>
                                            {driver.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className={styles.menuButton}>
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
