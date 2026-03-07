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
    Truck,
    Wrench,
} from "lucide-react";
import styles from "./page.module.css";
import { useDemoMode } from "../../components/DemoModeContext";
import EmptyState from "../../components/EmptyState";
import { deleteVehicle } from "../../actions/vehicles";

const mockVehicles = [
    {
        id: "1", unitNumber: "101", make: "Freightliner", model: "Cascadia",
        year: 2022, vin: "1FUJGLDR5CLBP8401", licensePlate: "TRK-1234",
        licensePlateState: "TX", vehicleType: "TRACTOR", status: "ACTIVE",
        annualInspectionDue: "2026-03-15", nextPmDue: "2026-04-20",
    },
    {
        id: "2", unitNumber: "102", make: "Peterbilt", model: "579",
        year: 2021, vin: "1XPWD49X1GD350875", licensePlate: "TRK-2345",
        licensePlateState: "TX", vehicleType: "TRACTOR", status: "ACTIVE",
        annualInspectionDue: "2026-05-22", nextPmDue: "2026-05-01",
    },
    {
        id: "3", unitNumber: "103", make: "Kenworth", model: "T680",
        year: 2023, vin: "1XKYD49X3GJ124578", licensePlate: "TRK-3456",
        licensePlateState: "TX", vehicleType: "TRACTOR", status: "MAINTENANCE",
        annualInspectionDue: "2026-02-22", nextPmDue: "2026-04-15",
    },
    {
        id: "4", unitNumber: "T-201", make: "Utility", model: "3000R",
        year: 2020, vin: "1UYVS2538LU456789", licensePlate: "TRL-0201",
        licensePlateState: "TX", vehicleType: "TRAILER", status: "ACTIVE",
        annualInspectionDue: "2026-06-10", nextPmDue: "2026-06-10",
    },
    {
        id: "5", unitNumber: "T-202", make: "Great Dane", model: "Champion",
        year: 2019, vin: "1GRAA9621KB789012", licensePlate: "TRL-0202",
        licensePlateState: "TX", vehicleType: "TRAILER", status: "ACTIVE",
        annualInspectionDue: "2026-04-28", nextPmDue: "2026-05-28",
    },
];

interface VehicleRow {
    id: string;
    unitNumber: string;
    make: string | null;
    model: string | null;
    year: number | null;
    vin: string | null;
    licensePlate: string | null;
    licensePlateState: string | null;
    vehicleType: string;
    status: string;
    annualInspectionDue: string | null;
    nextPmDue: string | null;
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

function getInspectionStatus(daysUntil: number) {
    if (daysUntil <= 14) return { label: "Due Soon", class: "danger" };
    if (daysUntil <= 30) return { label: "Upcoming", class: "warning" };
    return { label: "Current", class: "success" };
}

function vehicleTypeLabel(vType: string): string {
    switch (vType) {
        case "tractor": return "Semi-Truck";
        case "straight_truck": return "Straight Truck";
        case "pickup": return "Pickup";
        case "van": return "Van";
        case "suv": return "SUV";
        case "trailer": return "Trailer";
        case "bus": return "Bus";
        default: return vType.replace("_", " ");
    }
}

export default function VehiclesTable({ vehicles: realVehicles }: { vehicles: VehicleRow[] }) {
    const { isDemoMode } = useDemoMode();
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const allVehicles = isDemoMode ? mockVehicles : realVehicles;

    const filteredVehicles = allVehicles.filter(v => {
        const matchesSearch = searchTerm === "" ||
            v.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${v.make ?? ""} ${v.model ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (v.vin && v.vin.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesType = typeFilter === "all" || v.vehicleType.toLowerCase() === typeFilter;
        return matchesSearch && matchesType;
    });

    const tractors = allVehicles.filter(v => v.vehicleType.toUpperCase() === "TRACTOR" || v.vehicleType.toUpperCase() === "STRAIGHT_TRUCK");
    const trailers = allVehicles.filter(v => v.vehicleType.toUpperCase() === "TRAILER");
    const inMaintenance = allVehicles.filter(v => v.status.toUpperCase() === "MAINTENANCE").length;

    const hasVehicles = allVehicles.length > 0;

    if (!hasVehicles && !isDemoMode) {
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
                    icon={Truck}
                    title="No vehicles added yet"
                    description="Add your vehicles and trailers to track annual inspections, preventive maintenance (PM) schedules, and compliance status."
                    valueProposition="We'll track inspection due dates, registration expirations, and PM schedules — so nothing slips through the cracks."
                    primaryAction={{ label: "Add Your First Vehicle", href: "/dashboard/vehicles/new" }}
                    secondaryAction={{ label: "Run Compliance Setup", href: "/dashboard/documents/wizard" }}
                />
            </div>
        );
    }

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to remove this vehicle?")) return;
        startTransition(async () => {
            await deleteVehicle(id);
        });
    };

    return (
        <div className={styles.page}>
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

            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <Truck size={20} className={styles.statIcon} />
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{tractors.length}</span>
                        <span className={styles.statLabel}>Trucks</span>
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
                    <option value="tractor">Semi-Trucks</option>
                    <option value="straight_truck">Straight Trucks</option>
                    <option value="pickup">Pickups</option>
                    <option value="van">Vans</option>
                    <option value="suv">SUVs</option>
                    <option value="trailer">Trailers</option>
                    <option value="bus">Buses</option>
                </select>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Unit</th>
                            <th>Vehicle Info</th>
                            <th>VIN</th>
                            <th>Annual Inspection</th>
                            <th>Next Scheduled Service</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVehicles.map((vehicle) => {
                            const inspDays = vehicle.annualInspectionDue ? getDaysUntil(vehicle.annualInspectionDue) : null;
                            const inspStatus = inspDays !== null ? getInspectionStatus(inspDays) : null;
                            const vType = vehicle.vehicleType.toLowerCase();

                            return (
                                <tr key={vehicle.id}>
                                    <td>
                                        <Link href={`/dashboard/vehicles/${vehicle.id}`} className={styles.vehicleLink}>
                                            <div className={`${styles.vehicleIcon} ${vType === "trailer" ? styles.trailer : styles.tractor}`}>
                                                <Truck size={20} />
                                            </div>
                                            <div className={styles.vehicleUnit}>
                                                <span className={styles.unitNumber}>{vehicle.unitNumber}</span>
                                                <span className={styles.vehicleType}>
                                                    {vehicleTypeLabel(vType)}
                                                </span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td>
                                        <div className={styles.vehicleInfo}>
                                            <span className={styles.vehicleMake}>
                                                {vehicle.year} {vehicle.make} {vehicle.model}
                                            </span>
                                            {vehicle.licensePlate && (
                                                <span className={styles.vehiclePlate}>
                                                    {vehicle.licensePlate} ({vehicle.licensePlateState})
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.vin}>{vehicle.vin ?? "—"}</span>
                                    </td>
                                    <td>
                                        {vehicle.annualInspectionDue && inspDays !== null && inspStatus ? (
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
                                        ) : (
                                            <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Not set</span>
                                        )}
                                    </td>
                                    <td>
                                        {vehicle.nextPmDue ? (
                                            <div className={styles.pmInfo}>
                                                <span className={styles.pmDate}>
                                                    {formatDate(vehicle.nextPmDue)}
                                                </span>
                                            </div>
                                        ) : (
                                            <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Not set</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`badge ${vehicle.status.toUpperCase() === "ACTIVE" ? "badge-success" :
                                            vehicle.status.toUpperCase() === "MAINTENANCE" ? "badge-warning" : "badge-neutral"
                                            }`}>
                                            {vehicle.status.toUpperCase() === "ACTIVE" && <CheckCircle size={12} />}
                                            {vehicle.status.toUpperCase() === "MAINTENANCE" && <Wrench size={12} />}
                                            {vehicle.status.toLowerCase()}
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
                                                {!isDemoMode && (
                                                    <button style={{
                                                        display: "block", width: "100%", textAlign: "left" as const,
                                                        padding: "0.5rem 0.75rem", fontSize: "0.85rem",
                                                        border: "none", background: "none", color: "#ef4444",
                                                        cursor: "pointer",
                                                    }} onClick={() => { setOpenMenu(null); handleDelete(vehicle.id); }}>Remove Vehicle</button>
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
