"use client";

import Link from "next/link";
import {
    ArrowLeft,
    User,
    FileText,
    AlertTriangle,
    Calendar,
    Phone,
    Mail,
    Shield,
} from "lucide-react";

interface DriverData {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    cdlNumber: string;
    cdlState: string;
    cdlClass: string;
    cdlExpiration: string;
    medicalCardExpiration: string;
    hireDate: string;
    status: string;
    endorsements: string[];
    documents: Array<{
        id: string;
        name: string;
        documentType: string;
        expirationDate: string | null;
    }>;
    violations: Array<{
        id: string;
        description: string;
        violationDate: string;
        severity: string;
        resolved: boolean;
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

export default function DriverDetail({ driver }: { driver: DriverData }) {
    const cdlDays = getDaysUntil(driver.cdlExpiration);
    const medDays = getDaysUntil(driver.medicalCardExpiration);

    return (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <Link href="/dashboard/drivers" style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                color: "#64748b", fontSize: "0.875rem", textDecoration: "none",
                marginBottom: "1.5rem",
            }}>
                <ArrowLeft size={16} /> Back to Drivers
            </Link>

            {/* Header */}
            <div style={{
                display: "flex", alignItems: "center", gap: "1rem",
                marginBottom: "2rem",
            }}>
                <div style={{
                    width: 56, height: 56, borderRadius: "14px",
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    color: "white", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "1.25rem", fontWeight: 700,
                }}>
                    {driver.firstName[0]}{driver.lastName[0]}
                </div>
                <div>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                        {driver.firstName} {driver.lastName}
                    </h1>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem", color: "#64748b", fontSize: "0.875rem" }}>
                        {driver.email && (
                            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                <Mail size={14} /> {driver.email}
                            </span>
                        )}
                        {driver.phone && (
                            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                <Phone size={14} /> {driver.phone}
                            </span>
                        )}
                    </div>
                </div>
                <div style={{ marginLeft: "auto" }}>
                    <span className={`badge ${driver.status === "ACTIVE" ? "badge-success" : "badge-neutral"}`}>
                        {driver.status.toLowerCase()}
                    </span>
                </div>
            </div>

            {/* Info Cards */}
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem", marginBottom: "2rem",
            }}>
                {/* CDL Card */}
                <div style={{
                    background: "white", borderRadius: "12px", padding: "1.25rem",
                    border: "1px solid #e2e8f0",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", color: "#3b82f6" }}>
                        <Shield size={18} />
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>CDL Information</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Number</span>
                            <span style={{ fontWeight: 500, fontFamily: "monospace" }}>{driver.cdlNumber}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>State</span>
                            <span style={{ fontWeight: 500 }}>{driver.cdlState}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Class</span>
                            <span style={{ fontWeight: 500 }}>{driver.cdlClass}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Expires</span>
                            <span style={{
                                fontWeight: 500,
                                color: cdlDays <= 30 ? "#dc2626" : cdlDays <= 60 ? "#d97706" : "#0f172a",
                            }}>
                                {formatDate(driver.cdlExpiration)}
                                {cdlDays <= 30 && <AlertTriangle size={12} style={{ marginLeft: 4, verticalAlign: "middle" }} />}
                            </span>
                        </div>
                    </div>
                    {driver.endorsements.length > 0 && (
                        <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                            {driver.endorsements.map(e => (
                                <span key={e} style={{
                                    padding: "0.15rem 0.5rem", borderRadius: "6px",
                                    background: "#eff6ff", color: "#3b82f6",
                                    fontSize: "0.75rem", fontWeight: 600,
                                }}>{e}</span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Medical Card */}
                <div style={{
                    background: "white", borderRadius: "12px", padding: "1.25rem",
                    border: "1px solid #e2e8f0",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", color: "#059669" }}>
                        <FileText size={18} />
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Medical Card</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Expires</span>
                        <span style={{
                            fontWeight: 500,
                            color: medDays <= 30 ? "#dc2626" : medDays <= 60 ? "#d97706" : "#0f172a",
                        }}>
                            {formatDate(driver.medicalCardExpiration)}
                        </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                        <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Days left</span>
                        <span style={{
                            fontWeight: 600,
                            color: medDays <= 30 ? "#dc2626" : medDays <= 60 ? "#d97706" : "#059669",
                        }}>
                            {medDays > 0 ? `${medDays} days` : `${Math.abs(medDays)} days overdue`}
                        </span>
                    </div>
                </div>

                {/* Employment */}
                <div style={{
                    background: "white", borderRadius: "12px", padding: "1.25rem",
                    border: "1px solid #e2e8f0",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", color: "#7c3aed" }}>
                        <Calendar size={18} />
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Employment</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Hire Date</span>
                        <span style={{ fontWeight: 500 }}>{formatDate(driver.hireDate)}</span>
                    </div>
                </div>
            </div>

            {/* Documents */}
            {driver.documents.length > 0 && (
                <div style={{
                    background: "white", borderRadius: "12px", padding: "1.25rem",
                    border: "1px solid #e2e8f0", marginBottom: "1.5rem",
                }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}>Documents</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {driver.documents.map(doc => (
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

            {/* Violations */}
            {driver.violations.length > 0 && (
                <div style={{
                    background: "white", borderRadius: "12px", padding: "1.25rem",
                    border: "1px solid #e2e8f0",
                }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem" }}>Violations</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {driver.violations.map(v => (
                            <div key={v.id} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "0.5rem 0", borderBottom: "1px solid #f1f5f9",
                            }}>
                                <div>
                                    <span style={{ fontSize: "0.875rem" }}>{v.description}</span>
                                    <span style={{ fontSize: "0.8rem", color: "#64748b", marginLeft: "0.5rem" }}>
                                        {formatDate(v.violationDate)}
                                    </span>
                                </div>
                                <span className={`badge ${v.resolved ? "badge-success" : "badge-warning"}`}>
                                    {v.resolved ? "Resolved" : v.severity.toLowerCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
