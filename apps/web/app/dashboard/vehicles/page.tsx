"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    CheckCircle,
    AlertTriangle,
    Clock,
    Truck,
    Wrench
} from "lucide-react";
import styles from "./page.module.css";
import { useDemoMode } from "../../components/DemoModeContext";
import EmptyState from "../../components/EmptyState";

// Mock data
const vehicles = [
    {
        id: "1",
        unitNumber: "101",
        make: "Freightliner",
        model: "Cascadia",
        year: 2022,
        vin: "1FUJGLDR5CLBP8401",
        licensePlate: "TRK-1234",
        licensePlateState: "TX",
        vehicleType: "tractor",
        status: "active",
        annualInspectionDue: "2026-03-15",
        lastPmDate: "2026-01-20",
        nextPmDue: "2026-04-20",
        mileage: 245000,
    },
    {
        id: "2",
        unitNumber: "102",
        make: "Peterbilt",
        model: "579",
        year: 2021,
        vin: "1XPWD49X1GD350875",
        licensePlate: "TRK-2345",
        licensePlateState: "TX",
        vehicleType: "tractor",
        status: "active",
        annualInspectionDue: "2026-05-22",
        lastPmDate: "2026-02-01",
        nextPmDue: "2026-05-01",
        mileage: 312000,
    },
    {
        id: "3",
        unitNumber: "103",
        make: "Kenworth",
        model: "T680",
        year: 2023,
        vin: "1XKYD49X3GJ124578",
        licensePlate: "TRK-3456",
        licensePlateState: "TX",
        vehicleType: "tractor",
        status: "maintenance",
        annualInspectionDue: "2026-02-22",
        lastPmDate: "2026-01-15",
        nextPmDue: "2026-04-15",
        mileage: 89000,
    },
    {
        id: "4",
        unitNumber: "T-201",
        make: "Utility",
        model: "3000R",
        year: 2020,
        vin: "1UYVS2538LU456789",
        licensePlate: "TRL-0201",
        licensePlateState: "TX",
        vehicleType: "trailer",
        status: "active",
        annualInspectionDue: "2026-06-10",
        lastPmDate: "2025-12-10",
        nextPmDue: "2026-06-10",
        mileage: null,
    },
    {
        id: "5",
        unitNumber: "T-202",
        make: "Great Dane",
        model: "Champion",
        year: 2019,
        vin: "1GRAA9621KB789012",
        licensePlate: "TRL-0202",
        licensePlateState: "TX",
        vehicleType: "trailer",
        status: "active",
        annualInspectionDue: "2026-04-28",
        lastPmDate: "2025-11-28",
        nextPmDue: "2026-05-28",
        mileage: null,
    },
];

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
    return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getInspectionStatus(daysUntil: number) {
    if (daysUntil <= 14) return { label: "Due Soon", class: "danger" };
    if (daysUntil <= 30) return { label: "Upcoming", class: "warning" };
    return { label: "Current", class: "success" };
}

export default function VehiclesPage() {
    const { isDemoMode } = useDemoMode();
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const filteredVehicles = isDemoMode ? vehicles.filter(v => {
        const matchesSearch = searchTerm === "" ||
            v.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${v.make} ${v.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.vin.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === "all" || v.vehicleType === typeFilter;
        return matchesSearch && matchesType;
    }) : [];

    const tractors = isDemoMode ? vehicles.filter(v => v.vehicleType === "tractor") : [];
    const trailers = isDemoMode ? vehicles.filter(v => v.vehicleType === "trailer") : [];
    const inMaintenance = isDemoMode ? vehicles.filter(v => v.status === "maintenance").length : 0;

    if (!isDemoMode) {
        return (
            <div className={styles.page}>
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>Vehicle Management</h1>
                        <p className={styles.subtitle}>Track vehicle inspections, maintenance, and compliance</p>
                    </div>
                    <Link href="/dashboard/vehicles/new" className="btn btn-primary">
                        <Plus size={18} /> Add Vehicle
                    </Link>
                </header>
                <EmptyState
                    icon="🚛"
                    title="No vehicles added yet"
                    description="Add your vehicles and trailers to track annual inspections, preventive maintenance (PM) schedules, and compliance status."
                    primaryAction={{ label: "Add Your First Vehicle", href: "/dashboard/vehicles/new" }}
                    secondaryAction={{ label: "Run Compliance Setup", href: "/dashboard/documents/wizard" }}
                />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Vehicle Management</h1>
                    <p className={styles.subtitle}>
                        Track vehicle inspections, maintenance, and compliance
                    </p>
                </div>
                <Link href="/dashboard/vehicles/new" className="btn btn-primary">
                    <Plus size={18} />
                    Add Vehicle
                </Link>
            </header>

            {/* Stats */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <Truck size={20} className={styles.statIcon} />
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{tractors.length}</span>
                        <span className={styles.statLabel}>Tractors</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <Truck size={20} className={styles.statIconTrailer} />
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{trailers.length}</span>
                        <span className={styles.statLabel}>Trailers</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <Wrench size={20} className={styles.statIconWarning} />
                    <div className={styles.statContent}>
                        <span className={`${styles.statValue} ${styles.warning}`}>{inMaintenance}</span>
                        <span className={styles.statLabel}>In Maintenance</span>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search vehicles..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    style={{
                        padding: "0.5rem 0.75rem", borderRadius: "8px",
                        border: "1px solid #e2e8f0", fontSize: "0.85rem",
                        color: "#334155", cursor: "pointer",
                    }}
                >
                    <option value="all">All Types</option>
                    <option value="tractor">Tractors</option>
                    <option value="trailer">Trailers</option>
                </select>
            </div>

            {/* Vehicles Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Unit</th>
                            <th>Vehicle Info</th>
                            <th>VIN</th>
                            <th>Annual Inspection</th>
                            <th>Next PM Due <span title="Preventive Maintenance — scheduled oil changes, brake checks, and other routine service" style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", background: "#f1f5f9", fontSize: "0.6rem", lineHeight: "14px", textAlign: "center" as const, color: "#64748b", cursor: "help", marginLeft: "0.25rem" }}>?</span></th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVehicles.map((vehicle) => {
                            const inspDays = getDaysUntil(vehicle.annualInspectionDue);
                            const inspStatus = getInspectionStatus(inspDays);
                            const pmDays = getDaysUntil(vehicle.nextPmDue);

                            return (
                                <tr key={vehicle.id}>
                                    <td>
                                        <Link href={`/dashboard/vehicles/${vehicle.id}`} className={styles.vehicleLink}>
                                            <div className={`${styles.vehicleIcon} ${styles[vehicle.vehicleType]}`}>
                                                <Truck size={20} />
                                            </div>
                                            <div className={styles.vehicleUnit}>
                                                <span className={styles.unitNumber}>{vehicle.unitNumber}</span>
                                                <span className={styles.vehicleType}>
                                                    {vehicle.vehicleType === "tractor" ? "Tractor" : "Trailer"}
                                                </span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td>
                                        <div className={styles.vehicleInfo}>
                                            <span className={styles.vehicleMake}>
                                                {vehicle.year} {vehicle.make} {vehicle.model}
                                            </span>
                                            <span className={styles.vehiclePlate}>
                                                {vehicle.licensePlate} ({vehicle.licensePlateState})
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.vin}>{vehicle.vin}</span>
                                    </td>
                                    <td>
                                        <div className={styles.inspectionInfo}>
                                            <span className={`${styles.inspectionDate} ${styles[inspStatus.class]}`}>
                                                {inspDays <= 30 && (
                                                    inspDays <= 14 ? <AlertTriangle size={14} /> : <Clock size={14} />
                                                )}
                                                {formatDate(vehicle.annualInspectionDue)}
                                            </span>
                                            <span className={styles.daysLeft}>
                                                {inspDays} days
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.pmInfo}>
                                            <span className={styles.pmDate}>
                                                {formatDate(vehicle.nextPmDue)}
                                            </span>
                                            {vehicle.mileage && (
                                                <span className={styles.mileage}>
                                                    {vehicle.mileage.toLocaleString()} mi
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${vehicle.status === "active" ? "badge-success" :
                                            vehicle.status === "maintenance" ? "badge-warning" : "badge-neutral"
                                            }`}>
                                            {vehicle.status === "active" && <CheckCircle size={12} />}
                                            {vehicle.status === "maintenance" && <Wrench size={12} />}
                                            {vehicle.status}
                                        </span>
                                    </td>
                                    <td style={{ position: "relative" }}>
                                        <button className={styles.menuButton} onClick={() => setOpenMenu(openMenu === vehicle.id ? null : vehicle.id)}>
                                            <MoreVertical size={18} />
                                        </button>
                                        {openMenu === vehicle.id && (
                                            <div style={{
                                                position: "absolute", right: 0, top: "100%",
                                                background: "white", borderRadius: "8px",
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                border: "1px solid #e2e8f0", minWidth: 160,
                                                zIndex: 10, overflow: "hidden",
                                            }}>
                                                <Link href={`/dashboard/vehicles/${vehicle.id}`} style={{
                                                    display: "block", padding: "0.5rem 0.75rem",
                                                    fontSize: "0.85rem", color: "#334155",
                                                    textDecoration: "none",
                                                }} onClick={() => setOpenMenu(null)}>View Details</Link>
                                                <button style={{
                                                    display: "block", width: "100%", textAlign: "left" as const,
                                                    padding: "0.5rem 0.75rem", fontSize: "0.85rem",
                                                    border: "none", background: "none", color: "#334155",
                                                    cursor: "pointer",
                                                }} onClick={() => { setOpenMenu(null); alert("Edit functionality coming in production."); }}>Edit Vehicle</button>
                                                <button style={{
                                                    display: "block", width: "100%", textAlign: "left" as const,
                                                    padding: "0.5rem 0.75rem", fontSize: "0.85rem",
                                                    border: "none", background: "none", color: "#ef4444",
                                                    cursor: "pointer",
                                                }} onClick={() => { setOpenMenu(null); alert("Remove functionality coming in production."); }}>Remove Vehicle</button>
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
