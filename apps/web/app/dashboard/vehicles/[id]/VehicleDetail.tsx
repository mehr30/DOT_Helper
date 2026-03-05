"use client";

import Link from "next/link";
import {
    ArrowLeft,
    Truck,
    Wrench,
    FileText,
    Clock,
    CheckCircle,
    AlertTriangle,
    Calendar,
} from "lucide-react";

interface VehicleData {
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
    lastPmDate: string | null;
    nextPmDue: string | null;
    documents: Array<{
        id: string;
        name: string;
        documentType: string;
        expirationDate: string | null;
    }>;
    inspections: Array<{
        id: string;
        inspectionType: string;
        inspectionDate: string;
        passed: boolean;
        defectsFound: boolean;
    }>;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
    });
}

function getDaysUntil(dateStr: string) {
    const date = new Date(dateStr);
    const today = new Date();
    return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function VehicleDetail({ vehicle }: { vehicle: VehicleData }) {
    const vType = vehicle.vehicleType.toLowerCase().replace("_", " ");
    const inspDays = vehicle.annualInspectionDue ? getDaysUntil(vehicle.annualInspectionDue) : null;

    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <Link href="/dashboard/vehicles" style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                color: "#64748b", fontSize: "0.875rem", textDecoration: "none",
                marginBottom: "1.5rem",
            }}>
                <ArrowLeft size={16} /> Back to Vehicles
            </Link>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                <div style={{
                    width: 56, height: 56, borderRadius: "14px",
                    background: vehicle.vehicleType === "TRAILER"
                        ? "linear-gradient(135deg, #059669, #047857)"
                        : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    color: "white", display: "flex", alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Truck size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                        Unit {vehicle.unitNumber}
                    </h1>
                    <p style={{ color: "#64748b", margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
                        {vehicle.year} {vehicle.make} {vehicle.model} &middot; {vType}
                        {vehicle.licensePlate && ` · ${vehicle.licensePlate} (${vehicle.licensePlateState})`}
                    </p>
                </div>
                <div style={{ marginLeft: "auto" }}>
                    <span className={`badge ${vehicle.status === "ACTIVE" ? "badge-success" :
                        vehicle.status === "MAINTENANCE" ? "badge-warning" : "badge-neutral"
                        }`}>
                        {vehicle.status === "ACTIVE" && <CheckCircle size={12} />}
                        {vehicle.status === "MAINTENANCE" && <Wrench size={12} />}
                        {vehicle.status.toLowerCase()}
                    </span>
                </div>
            </div>

            {/* Info Cards */}
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem", marginBottom: "2rem",
            }}>
                {/* VIN */}
                <div style={{
                    background: "white", borderRadius: "12px", padding: "1.25rem",
                    border: "1px solid #e2e8f0",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#3b82f6", marginBottom: "0.75rem" }}>
                        <FileText size={18} />
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>VIN</span>
                    </div>
                    <span style={{ fontFamily: "monospace", fontSize: "0.95rem", fontWeight: 500 }}>
                        {vehicle.vin ?? "Not set"}
                    </span>
                </div>

                {/* Annual Inspection */}
                <div style={{
                    background: "white", borderRadius: "12px", padding: "1.25rem",
                    border: "1px solid #e2e8f0",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#d97706", marginBottom: "0.75rem" }}>
                        <Clock size={18} />
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Annual Inspection Due</span>
                    </div>
                    {vehicle.annualInspectionDue ? (
                        <>
                            <span style={{
                                fontSize: "0.95rem", fontWeight: 500,
                                color: inspDays !== null && inspDays <= 30 ? "#dc2626" : "#0f172a",
                            }}>
                                {formatDate(vehicle.annualInspectionDue)}
                                {inspDays !== null && inspDays <= 30 && (
                                    <AlertTriangle size={14} style={{ marginLeft: 6, verticalAlign: "middle" }} />
                                )}
                            </span>
                            {inspDays !== null && (
                                <div style={{
                                    fontSize: "0.8rem", marginTop: "0.25rem",
                                    color: inspDays <= 30 ? "#dc2626" : "#64748b",
                                }}>
                                    {inspDays > 0 ? `${inspDays} days remaining` : `${Math.abs(inspDays)} days overdue`}
                                </div>
                            )}
                        </>
                    ) : (
                        <span style={{ color: "#94a3b8" }}>Not set</span>
                    )}
                </div>

                {/* PM Schedule */}
                <div style={{
                    background: "white", borderRadius: "12px", padding: "1.25rem",
                    border: "1px solid #e2e8f0",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#7c3aed", marginBottom: "0.75rem" }}>
                        <Wrench size={18} />
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Preventive Maintenance</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Last PM</span>
                            <span style={{ fontWeight: 500 }}>
                                {vehicle.lastPmDate ? formatDate(vehicle.lastPmDate) : "—"}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Next PM Due</span>
                            <span style={{ fontWeight: 500 }}>
                                {vehicle.nextPmDue ? formatDate(vehicle.nextPmDue) : "—"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Documents */}
            {vehicle.documents.length > 0 && (
                <div style={{
                    background: "white", borderRadius: "12px", padding: "1.25rem",
                    border: "1px solid #e2e8f0", marginBottom: "1.5rem",
                }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}>Documents</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {vehicle.documents.map(doc => (
                            <div key={doc.id} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "0.5rem 0", borderBottom: "1px solid #f1f5f9",
                            }}>
                                <span style={{ fontSize: "0.875rem" }}>{doc.name}</span>
                                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                                    {doc.expirationDate ? formatDate(doc.expirationDate) : "No expiration"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Inspections */}
            {vehicle.inspections.length > 0 && (
                <div style={{
                    background: "white", borderRadius: "12px", padding: "1.25rem",
                    border: "1px solid #e2e8f0",
                }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}>Inspection History</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {vehicle.inspections.map(insp => (
                            <div key={insp.id} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "0.5rem 0", borderBottom: "1px solid #f1f5f9",
                            }}>
                                <div>
                                    <span style={{ fontSize: "0.875rem" }}>
                                        {insp.inspectionType.replace("_", " ")}
                                    </span>
                                    <span style={{ fontSize: "0.8rem", color: "#64748b", marginLeft: "0.5rem" }}>
                                        {formatDate(insp.inspectionDate)}
                                    </span>
                                </div>
                                <span className={`badge ${insp.passed ? "badge-success" : "badge-warning"}`}>
                                    {insp.passed ? "Passed" : "Failed"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
