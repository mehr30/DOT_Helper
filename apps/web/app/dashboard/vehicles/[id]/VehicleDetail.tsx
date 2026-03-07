"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Truck,
    Wrench,
    FileText,
    Clock,
    CheckCircle,
    AlertTriangle,
    PenTool,
    Download,
    Edit3,
    Save,
    X,
    Loader2,
} from "lucide-react";
import DocumentUpload from "../../../components/DocumentUpload";
import SignDocumentModal from "../../../components/SignDocumentModal";
import { updateVehicle } from "../../../actions/vehicles";

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
        fileUrl: string;
        fileName: string;
        mimeType: string | null;
        signatureCount: number;
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

interface ActionItem {
    severity: "red" | "yellow" | "blue";
    label: string;
    action: string;
    href: string;
}

function getVehicleActionItems(vehicle: VehicleData): ActionItem[] {
    const items: ActionItem[] = [];
    const docTypes = new Set(vehicle.documents.map(d => d.documentType));
    const isPowerUnit = vehicle.vehicleType !== "TRAILER";

    // Annual inspection
    if (!vehicle.annualInspectionDue) {
        items.push({ severity: "red", label: "No annual inspection date on file — every commercial vehicle needs one", action: "Add date", href: "#edit" });
    } else {
        const days = getDaysUntil(vehicle.annualInspectionDue);
        if (days < 0) {
            items.push({ severity: "red", label: `Annual inspection expired ${Math.abs(days)} days ago — vehicle cannot be operated`, action: "Update date", href: "#edit" });
        } else if (days <= 30) {
            items.push({ severity: "red", label: `Annual inspection expires in ${days} days — schedule now`, action: "Update date", href: "#edit" });
        } else if (days <= 60) {
            items.push({ severity: "yellow", label: `Annual inspection expires in ${days} days`, action: "Update date", href: "#edit" });
        }
    }

    // PM schedule
    if (vehicle.nextPmDue) {
        const days = getDaysUntil(vehicle.nextPmDue);
        if (days < 0) {
            items.push({ severity: "yellow", label: `Preventive maintenance overdue by ${Math.abs(days)} days`, action: "Update PM date", href: "#edit" });
        } else if (days <= 14) {
            items.push({ severity: "yellow", label: `Preventive maintenance due in ${days} days`, action: "Update PM date", href: "#edit" });
        }
    }

    // VIN
    if (!vehicle.vin) {
        items.push({ severity: "yellow", label: "No VIN on file", action: "Add VIN", href: "#edit" });
    }

    // Missing documents
    if (!docTypes.has("REGISTRATION")) {
        items.push({ severity: "yellow", label: "Missing: Vehicle registration", action: "Upload", href: "#documents" });
    }
    if (!docTypes.has("INSURANCE")) {
        items.push({ severity: "yellow", label: "Missing: Insurance card / certificate", action: "Upload", href: "#documents" });
    }
    if (!docTypes.has("ANNUAL_INSPECTION")) {
        items.push({ severity: "blue", label: "Missing: Annual inspection report", action: "Upload", href: "#documents" });
    }
    if (isPowerUnit && !docTypes.has("TITLE")) {
        items.push({ severity: "blue", label: "Missing: Vehicle title", action: "Upload", href: "#documents" });
    }

    // Expired documents
    vehicle.documents.forEach(doc => {
        if (doc.expirationDate) {
            const days = getDaysUntil(doc.expirationDate);
            if (days < 0) {
                items.push({ severity: "red", label: `${doc.name} expired ${Math.abs(days)} days ago`, action: "Upload new", href: "#documents" });
            } else if (days <= 30) {
                items.push({ severity: "yellow", label: `${doc.name} expires in ${days} days`, action: "Upload new", href: "#documents" });
            }
        }
    });

    return items;
}

export default function VehicleDetail({ vehicle }: { vehicle: VehicleData }) {
    const vTypeMap: Record<string, string> = {
        TRACTOR: "Semi-Truck", STRAIGHT_TRUCK: "Straight Truck", PICKUP: "Pickup",
        VAN: "Van", SUV: "SUV", TRAILER: "Trailer", BUS: "Bus",
    };
    const vType = vTypeMap[vehicle.vehicleType] ?? vehicle.vehicleType.toLowerCase().replace("_", " ");
    const inspDays = vehicle.annualInspectionDue ? getDaysUntil(vehicle.annualInspectionDue) : null;
    const actionItems = getVehicleActionItems(vehicle);
    const [signingDoc, setSigningDoc] = useState<{ id: string; name: string; url: string } | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const router = useRouter();

    // Inline edit state
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editData, setEditData] = useState({
        unitNumber: vehicle.unitNumber,
        make: vehicle.make || "",
        model: vehicle.model || "",
        year: vehicle.year?.toString() || "",
        vin: vehicle.vin || "",
        licensePlate: vehicle.licensePlate || "",
        licensePlateState: vehicle.licensePlateState || "",
        vehicleType: vehicle.vehicleType,
        annualInspectionDue: vehicle.annualInspectionDue?.split("T")[0] || "",
        nextPmDue: vehicle.nextPmDue?.split("T")[0] || "",
    });
    const [editError, setEditError] = useState<string | null>(null);

    const handleSaveEdit = async () => {
        setSaving(true);
        setEditError(null);
        const result = await updateVehicle({
            id: vehicle.id,
            ...editData,
            year: editData.year ? parseInt(editData.year) : undefined,
        });
        setSaving(false);
        if (result.error) {
            setEditError(result.error);
        } else {
            setEditing(false);
            router.refresh();
        }
    };

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
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className={`badge ${vehicle.status === "ACTIVE" ? "badge-success" :
                        vehicle.status === "MAINTENANCE" ? "badge-warning" : "badge-neutral"
                        }`}>
                        {vehicle.status === "ACTIVE" && <CheckCircle size={12} />}
                        {vehicle.status === "MAINTENANCE" && <Wrench size={12} />}
                        {vehicle.status.toLowerCase()}
                    </span>
                    {!editing && (
                        <button
                            onClick={() => setEditing(true)}
                            style={{
                                display: "flex", alignItems: "center", gap: "0.35rem",
                                padding: "0.45rem 0.85rem", borderRadius: "8px",
                                border: "1px solid #e2e8f0", background: "white",
                                cursor: "pointer", fontSize: "0.85rem", fontWeight: 500,
                                color: "#475569",
                            }}
                        >
                            <Edit3 size={14} /> Edit
                        </button>
                    )}
                </div>
            </div>

            {/* Action Items */}
            {!editing && actionItems.length > 0 && (
                <div style={{
                    background: "white", borderRadius: "12px", padding: "1rem 1.25rem",
                    border: "1px solid #e2e8f0", marginBottom: "1.5rem",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                        <AlertTriangle size={16} style={{ color: "#f59e0b" }} />
                        <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0f172a" }}>
                            Needs Attention ({actionItems.length})
                        </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {actionItems.map((item, i) => (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", gap: "0.75rem",
                                padding: "0.5rem 0.6rem", borderRadius: "8px",
                                background: item.severity === "red" ? "#fef2f2" : item.severity === "yellow" ? "#fffbeb" : "#eff6ff",
                            }}>
                                <div style={{
                                    width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                                    background: item.severity === "red" ? "#ef4444" : item.severity === "yellow" ? "#f59e0b" : "#3b82f6",
                                }} />
                                <span style={{
                                    flex: 1, fontSize: "0.82rem",
                                    color: item.severity === "red" ? "#991b1b" : item.severity === "yellow" ? "#92400e" : "#1e40af",
                                }}>
                                    {item.label}
                                </span>
                                {item.href === "#edit" ? (
                                    <button
                                        onClick={() => setEditing(true)}
                                        style={{
                                            padding: "0.25rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem",
                                            fontWeight: 600, border: "none", cursor: "pointer",
                                            background: item.severity === "red" ? "#fee2e2" : item.severity === "yellow" ? "#fef3c7" : "#dbeafe",
                                            color: item.severity === "red" ? "#dc2626" : item.severity === "yellow" ? "#d97706" : "#2563eb",
                                        }}
                                    >
                                        {item.action}
                                    </button>
                                ) : item.href === "#documents" ? (
                                    <button
                                        onClick={() => document.getElementById("vehicle-documents")?.scrollIntoView({ behavior: "smooth" })}
                                        style={{
                                            padding: "0.25rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem",
                                            fontWeight: 600, border: "none", cursor: "pointer",
                                            background: item.severity === "red" ? "#fee2e2" : item.severity === "yellow" ? "#fef3c7" : "#dbeafe",
                                            color: item.severity === "red" ? "#dc2626" : item.severity === "yellow" ? "#d97706" : "#2563eb",
                                        }}
                                    >
                                        {item.action}
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        style={{
                                            padding: "0.25rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem",
                                            fontWeight: 600, textDecoration: "none",
                                            background: item.severity === "red" ? "#fee2e2" : item.severity === "yellow" ? "#fef3c7" : "#dbeafe",
                                            color: item.severity === "red" ? "#dc2626" : item.severity === "yellow" ? "#d97706" : "#2563eb",
                                        }}
                                    >
                                        {item.action}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Edit Form */}
            {editing && (
                <div style={{
                    background: "white", borderRadius: "12px", padding: "1.5rem",
                    border: "1px solid #e2e8f0", marginBottom: "2rem",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>Edit Vehicle</h3>
                        <button onClick={() => setEditing(false)} style={{
                            display: "flex", alignItems: "center", gap: "0.3rem",
                            padding: "0.35rem 0.7rem", border: "1px solid #e2e8f0", borderRadius: "6px",
                            background: "white", cursor: "pointer", fontSize: "0.8rem", color: "#64748b",
                        }}>
                            <X size={14} /> Cancel
                        </button>
                    </div>
                    {editError && (
                        <div style={{
                            padding: "0.5rem 0.75rem", marginBottom: "1rem",
                            background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px",
                            color: "#dc2626", fontSize: "0.85rem",
                        }}>
                            {editError}
                        </div>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#475569", marginBottom: "0.25rem" }}>
                                Unit Number
                            </label>
                            <input
                                type="text"
                                value={editData.unitNumber}
                                onChange={(e) => setEditData(prev => ({ ...prev, unitNumber: e.target.value }))}
                                style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "0.875rem" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#475569", marginBottom: "0.25rem" }}>
                                Vehicle Type
                            </label>
                            <select
                                value={editData.vehicleType}
                                onChange={(e) => setEditData(prev => ({ ...prev, vehicleType: e.target.value }))}
                                style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "0.875rem", background: "white" }}
                            >
                                <option value="TRACTOR">Semi-Truck</option>
                                <option value="STRAIGHT_TRUCK">Straight Truck</option>
                                <option value="PICKUP">Pickup</option>
                                <option value="VAN">Van</option>
                                <option value="SUV">SUV</option>
                                <option value="TRAILER">Trailer</option>
                                <option value="BUS">Bus</option>
                            </select>
                        </div>
                        {[
                            { key: "make", label: "Make", type: "text" },
                            { key: "model", label: "Model", type: "text" },
                            { key: "year", label: "Year", type: "number" },
                            { key: "vin", label: "VIN", type: "text" },
                            { key: "licensePlate", label: "License Plate", type: "text" },
                            { key: "licensePlateState", label: "Plate State (e.g. TX)", type: "text" },
                            { key: "annualInspectionDue", label: "Annual Inspection Due", type: "date" },
                            { key: "nextPmDue", label: "Next Scheduled Service", type: "date" },
                        ].map(({ key, label, type }) => (
                            <div key={key}>
                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#475569", marginBottom: "0.25rem" }}>
                                    {label}
                                </label>
                                <input
                                    type={type}
                                    value={editData[key as keyof typeof editData]}
                                    onChange={(e) => setEditData(prev => ({ ...prev, [key]: e.target.value }))}
                                    style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "0.875rem" }}
                                />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1.25rem" }}>
                        <button onClick={handleSaveEdit} disabled={saving} style={{
                            display: "flex", alignItems: "center", gap: "0.35rem",
                            padding: "0.5rem 1.25rem", border: "none", borderRadius: "8px",
                            background: "#16a34a", cursor: "pointer", fontSize: "0.85rem",
                            fontWeight: 600, color: "white",
                            opacity: saving ? 0.7 : 1,
                        }}>
                            {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={14} />}
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
            )}

            {/* Info Cards */}
            {!editing && (
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
                        <div>
                            <span style={{ color: "#f59e0b", fontSize: "0.85rem", fontWeight: 500 }}>Not on file</span>
                            <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: "0.4rem 0 0", lineHeight: 1.4 }}>
                                Every commercial vehicle needs a yearly safety inspection by a certified inspector. Click Edit to add the date once you have it.
                            </p>
                        </div>
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
                            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Last Service</span>
                            <span style={{ fontWeight: 500 }}>
                                {vehicle.lastPmDate ? formatDate(vehicle.lastPmDate) : "—"}
                            </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Next Scheduled Service</span>
                            <span style={{ fontWeight: 500 }}>
                                {vehicle.nextPmDue ? formatDate(vehicle.nextPmDue) : "—"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            )}

            {/* Documents */}
            <div id="vehicle-documents" style={{
                background: "white", borderRadius: "12px", padding: "1.25rem",
                border: "1px solid #e2e8f0", marginBottom: "1.5rem",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>Documents</h3>
                    <DocumentUpload
                        key={refreshKey}
                        vehicleId={vehicle.id}
                        onUploadComplete={() => { setRefreshKey(k => k + 1); router.refresh(); }}
                    />
                </div>
                {vehicle.documents.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {vehicle.documents.map(doc => {
                            const expDays = doc.expirationDate ? getDaysUntil(doc.expirationDate) : null;
                            return (
                                <div key={doc.id} style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "0.75rem 0.5rem", borderBottom: "1px solid #f1f5f9",
                                    gap: "0.75rem",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: 0 }}>
                                        <FileText size={16} style={{ color: "#64748b", flexShrink: 0 }} />
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>{doc.name}</div>
                                            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                                                {doc.documentType.replace(/_/g, " ")}
                                                {doc.expirationDate && (
                                                    <span style={{
                                                        marginLeft: "0.5rem",
                                                        color: expDays !== null && expDays <= 30 ? "#dc2626" : "#94a3b8",
                                                    }}>
                                                        · Exp: {formatDate(doc.expirationDate)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                                        {doc.signatureCount > 0 && (
                                            <span style={{
                                                display: "inline-flex", alignItems: "center", gap: "0.2rem",
                                                fontSize: "0.7rem", color: "#16a34a", fontWeight: 600,
                                                padding: "0.15rem 0.4rem", borderRadius: "4px",
                                                background: "#dcfce7",
                                            }}>
                                                <CheckCircle size={10} /> Signed
                                            </span>
                                        )}
                                        <button
                                            onClick={() => setSigningDoc({ id: doc.id, name: doc.name, url: doc.fileUrl })}
                                            title="Sign document"
                                            style={{
                                                display: "flex", alignItems: "center", padding: "0.35rem",
                                                border: "1px solid #e2e8f0", borderRadius: "6px",
                                                background: "white", cursor: "pointer", color: "#64748b",
                                            }}
                                        >
                                            <PenTool size={14} />
                                        </button>
                                        {doc.fileUrl ? (
                                            <a
                                                href={doc.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Download / View"
                                                style={{
                                                    display: "flex", alignItems: "center", padding: "0.35rem",
                                                    border: "1px solid #e2e8f0", borderRadius: "6px",
                                                    background: "white", color: "#64748b",
                                                }}
                                            >
                                                <Download size={14} />
                                            </a>
                                        ) : (
                                            <Link
                                                href={`/dashboard/documents/wizard?form=${doc.fileName?.replace(/^wizard_/, "").replace(/_d_.*|_v_.*/, "") || ""}`}
                                                title="Open in wizard"
                                                style={{
                                                    display: "flex", alignItems: "center", padding: "0.35rem",
                                                    border: "1px solid #e2e8f0", borderRadius: "6px",
                                                    background: "white", color: "#16a34a",
                                                }}
                                            >
                                                <FileText size={14} />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div>
                        <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "0 0 0.75rem" }}>
                            No documents uploaded yet. Here&apos;s what you should have on file for each vehicle:
                        </p>
                        <div style={{
                            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem 1rem",
                            padding: "0.75rem", background: "#f8fafc", borderRadius: "8px",
                            fontSize: "0.78rem", color: "#475569",
                        }}>
                            <span>&#x2022; Current registration</span>
                            <span>&#x2022; Insurance card / certificate</span>
                            <span>&#x2022; Annual inspection report</span>
                            <span>&#x2022; Vehicle title</span>
                            <span>&#x2022; Lease agreement (if leased)</span>
                        </div>
                        <p style={{ color: "#94a3b8", fontSize: "0.72rem", margin: "0.5rem 0 0" }}>
                            Click &quot;Upload Document&quot; above to add these.
                        </p>
                    </div>
                )}
            </div>

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

            {signingDoc && (
                <SignDocumentModal
                    documentId={signingDoc.id}
                    documentName={signingDoc.name}
                    documentUrl={signingDoc.url}
                    signerRole="owner"
                    onClose={() => setSigningDoc(null)}
                    onSigned={() => {
                        setSigningDoc(null);
                        setRefreshKey(k => k + 1);
                    }}
                />
            )}
        </div>
    );
}
