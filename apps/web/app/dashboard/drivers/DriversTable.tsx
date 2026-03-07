"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    MoreVertical,
    CheckCircle,
    AlertTriangle,
    Clock,
    FileText,
    Users,
} from "lucide-react";
import styles from "./page.module.css";
import { useDemoMode } from "../../components/DemoModeContext";
import EmptyState from "../../components/EmptyState";
import { deleteDriver } from "../../actions/drivers";

// Mock data for demo mode
const mockDrivers = [
    {
        id: "1", firstName: "John", lastName: "Smith", email: "john.smith@example.com",
        phone: "(555) 123-4567", cdlNumber: "D1234567", cdlState: "TX",
        cdlExpiration: "2026-02-15", medicalCardExpiration: "2026-08-20",
        status: "ACTIVE", complianceScore: 95, missingDocs: 0, expiringDocs: 1,
    },
    {
        id: "2", firstName: "Sarah", lastName: "Wilson", email: "sarah.wilson@example.com",
        phone: "(555) 234-5678", cdlNumber: "D2345678", cdlState: "TX",
        cdlExpiration: "2027-05-10", medicalCardExpiration: "2026-04-15",
        status: "ACTIVE", complianceScore: 78, missingDocs: 2, expiringDocs: 1,
    },
    {
        id: "3", firstName: "Mike", lastName: "Johnson", email: "mike.johnson@example.com",
        phone: "(555) 345-6789", cdlNumber: "D3456789", cdlState: "OK",
        cdlExpiration: "2026-11-25", medicalCardExpiration: "2026-03-01",
        status: "ACTIVE", complianceScore: 88, missingDocs: 1, expiringDocs: 2,
    },
    {
        id: "4", firstName: "Emily", lastName: "Brown", email: "emily.brown@example.com",
        phone: "(555) 456-7890", cdlNumber: "D4567890", cdlState: "TX",
        cdlExpiration: "2027-03-18", medicalCardExpiration: "2027-01-10",
        status: "ACTIVE", complianceScore: 100, missingDocs: 0, expiringDocs: 0,
    },
    {
        id: "5", firstName: "Robert", lastName: "Davis", email: "robert.davis@example.com",
        phone: "(555) 567-8901", cdlNumber: "D5678901", cdlState: "TX",
        cdlExpiration: "2026-09-05", medicalCardExpiration: "2026-06-20",
        status: "INACTIVE", complianceScore: 65, missingDocs: 3, expiringDocs: 2,
    },
];

interface DriverRow {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    licenseType?: string;
    cdlNumber: string | null;
    cdlState: string | null;
    cdlExpiration: string | null;
    medicalCardExpiration: string | null;
    status: string;
    _count?: { documents: number; violations: number };
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

function getDaysUntil(dateStr: string) {
    const date = new Date(dateStr);
    const today = new Date();
    return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function DriversTable({ drivers: realDrivers }: { drivers: DriverRow[] }) {
    const { isDemoMode } = useDemoMode();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const allDrivers = isDemoMode ? mockDrivers : realDrivers.map(d => ({
        ...d,
        email: d.email ?? "",
        phone: d.phone ?? "",
        cdlNumber: d.cdlNumber ?? null,
        cdlState: d.cdlState ?? null,
        cdlExpiration: d.cdlExpiration ? (typeof d.cdlExpiration === "string" ? d.cdlExpiration : new Date(d.cdlExpiration).toISOString()) : null,
        medicalCardExpiration: d.medicalCardExpiration ? (typeof d.medicalCardExpiration === "string" ? d.medicalCardExpiration : new Date(d.medicalCardExpiration).toISOString()) : null,
        complianceScore: 0,
        missingDocs: 0,
        expiringDocs: 0,
    }));

    const filteredDrivers = allDrivers.filter(d => {
        const matchesSearch = searchTerm === "" ||
            `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (d.email && d.email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === "all" || d.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const activeDrivers = allDrivers.filter(d => d.status.toUpperCase() === "ACTIVE").length;

    const hasDrivers = allDrivers.length > 0;

    if (!hasDrivers && !isDemoMode) {
        return (
            <div className={styles.page}>
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>Driver Management</h1>
                        <p className={styles.subtitle}>Manage driver qualification files and compliance status</p>
                    </div>
                    <Link href="/dashboard/drivers/new" className="btn btn-primary">
                        <Plus size={18} /> Add Driver
                    </Link>
                </header>
                <EmptyState
                    icon={Users}
                    title="No drivers added yet"
                    description="Add your drivers to track their CDL expirations, medical cards, qualification files, and compliance status."
                    valueProposition="Greenlight DOT automatically tracks every expiration date and alerts you before anything lapses."
                    primaryAction={{ label: "Add Your First Driver", href: "/dashboard/drivers/new" }}
                    secondaryAction={{ label: "Run Compliance Setup", href: "/dashboard/documents/wizard" }}
                />
            </div>
        );
    }

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to remove this driver?")) return;
        startTransition(async () => {
            await deleteDriver(id);
        });
    };

    return (
        <div className={styles.page}>
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

            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{allDrivers.length}</span>
                    <span className={styles.statLabel}>Total Drivers</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{activeDrivers}</span>
                    <span className={styles.statLabel}>Active</span>
                </div>
            </div>

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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Driver</th>
                            <th>License</th>
                            <th>DOT Physical</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDrivers.map((driver) => {
                            const cdlDays = driver.cdlExpiration ? getDaysUntil(driver.cdlExpiration) : null;
                            const medDays = driver.medicalCardExpiration ? getDaysUntil(driver.medicalCardExpiration) : null;

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
                                            {driver.cdlNumber ? (
                                                <>
                                                    <span className={styles.cdlNumber}>{driver.cdlNumber}</span>
                                                    {driver.cdlExpiration && (
                                                        <span className={styles.cdlExpiry}>
                                                            {cdlDays !== null && cdlDays <= 30 && <Clock size={12} className={styles.warningIcon} />}
                                                            Exp: {formatDate(driver.cdlExpiration)}
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                                                    {("licenseType" in driver && driver.licenseType === "NON_CDL") ? "Non-CDL" : "—"}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.medicalInfo}>
                                            {driver.medicalCardExpiration ? (
                                                <>
                                                    <span className={`${styles.medicalExpiry} ${medDays !== null && medDays <= 30 ? styles.expiringSoon : ""}`}>
                                                        {medDays !== null && medDays <= 30 && <AlertTriangle size={12} />}
                                                        {formatDate(driver.medicalCardExpiration)}
                                                    </span>
                                                    <span className={styles.daysLeft}>
                                                        {medDays !== null && medDays > 0 ? `${medDays} days left` : "Expired"}
                                                    </span>
                                                </>
                                            ) : (
                                                <span style={{ color: "#f59e0b", fontSize: "0.75rem" }}>Needs DOT physical</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${driver.status.toUpperCase() === "ACTIVE" ? "badge-success" : "badge-neutral"}`}>
                                            {driver.status.toLowerCase()}
                                        </span>
                                    </td>
                                    <td style={{ position: "relative" }}>
                                        <button className={styles.menuButton} onClick={() => setOpenMenu(openMenu === driver.id ? null : driver.id)}>
                                            <MoreVertical size={18} />
                                        </button>
                                        {openMenu === driver.id && (
                                            <div style={{
                                                position: "absolute", right: 0, top: "100%",
                                                background: "white", borderRadius: "8px",
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                border: "1px solid #e2e8f0", minWidth: 160,
                                                zIndex: 10, overflow: "hidden",
                                            }}>
                                                <Link href={`/dashboard/drivers/${driver.id}`} style={{
                                                    display: "block", padding: "0.5rem 0.75rem",
                                                    fontSize: "0.85rem", color: "#334155",
                                                    textDecoration: "none",
                                                }} onClick={() => setOpenMenu(null)}>View Profile</Link>
                                                {!isDemoMode && (
                                                    <button style={{
                                                        display: "block", width: "100%", textAlign: "left" as const,
                                                        padding: "0.5rem 0.75rem", fontSize: "0.85rem",
                                                        border: "none", background: "none", color: "#ef4444",
                                                        cursor: "pointer",
                                                    }} onClick={() => { setOpenMenu(null); handleDelete(driver.id); }}>Remove Driver</button>
                                                )}
                                            </div>
                                        )}
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
