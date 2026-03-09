"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    Download,
    PenTool,
    CheckCircle,
    ExternalLink,
    Edit3,
    Save,
    X,
    Loader2,
} from "lucide-react";
import DocumentUpload from "../../../components/DocumentUpload";
import SignDocumentModal from "../../../components/SignDocumentModal";
import { updateDriver } from "../../../actions/drivers";
import { formatPhone } from "../../../../lib/formatPhone";

interface DriverData {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    licenseType: string;
    operatesCMV: boolean;
    cdlNumber: string | null;
    cdlState: string | null;
    cdlClass: string | null;
    cdlExpiration: string | null;
    medicalCardExpiration: string | null;
    hireDate: string;
    clearinghouseQueryDate: string | null;
    lastDrugTestDate: string | null;
    status: string;
    endorsements: string[];
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

const DOC_TYPE_LABELS: Record<string, string> = {
    CDL: "CDL / License Copy",
    MEDICAL_CERTIFICATE: "DOT Physical Card",
    MVR: "Driving Record (MVR)",
    EMPLOYMENT_APPLICATION: "Employment Application",
    DRUG_TEST_RESULT: "Drug Test Result",
    ROAD_TEST_CERTIFICATE: "Road Test Certificate",
    TRAINING_CERTIFICATE: "Training Certificate",
    CLEARINGHOUSE_CONSENT: "Clearinghouse Consent",
    REGISTRATION: "Registration",
    INSURANCE: "Insurance Card",
    ANNUAL_INSPECTION: "Annual Inspection Report",
    LEASE_AGREEMENT: "Lease Agreement",
    TITLE: "Title",
    OPERATING_AUTHORITY: "Operating Authority",
    BOC3: "BOC-3 Filing",
    UCR: "UCR Registration",
    IFTA_LICENSE: "IFTA License",
    INSURANCE_POLICY: "Insurance Policy",
    OTHER: "Other",
};

function friendlyDocType(type: string): string {
    return DOC_TYPE_LABELS[type] ?? type.replace(/_/g, " ");
}

interface ActionItem {
    severity: "red" | "yellow" | "blue";
    label: string;
    action: string;
    href: string;
}

function getDriverActionItems(driver: DriverData): ActionItem[] {
    const items: ActionItem[] = [];
    const isCDL = driver.licenseType === "CDL";
    const needsDOTPhysical = isCDL || driver.operatesCMV;
    const docTypes = new Set(driver.documents.map(d => d.documentType));

    // License issues
    if (!driver.cdlNumber) {
        items.push({ severity: "yellow", label: "No license number on file", action: "Add license info", href: "#edit" });
    } else if (driver.cdlExpiration) {
        const days = getDaysUntil(driver.cdlExpiration);
        if (days < 0) {
            items.push({ severity: "red", label: `License expired ${Math.abs(days)} days ago — driver cannot legally drive`, action: "Update expiration", href: "#edit" });
        } else if (days <= 30) {
            items.push({ severity: "red", label: `License expires in ${days} days — renew immediately`, action: "Update expiration", href: "#edit" });
        } else if (days <= 60) {
            items.push({ severity: "yellow", label: `License expires in ${days} days — schedule renewal`, action: "Update expiration", href: "#edit" });
        }
    }

    // DOT physical / medical card — required for CDL and CMV operators
    if (needsDOTPhysical) {
        if (!driver.medicalCardExpiration) {
            items.push({ severity: "red", label: `No DOT physical on file — required for ${isCDL ? "CDL drivers" : "drivers operating vehicles over 10,001 lbs"}`, action: "Add DOT physical date", href: "#edit" });
        } else {
            const days = getDaysUntil(driver.medicalCardExpiration);
            if (days < 0) {
                items.push({ severity: "red", label: `DOT physical expired ${Math.abs(days)} days ago — driver cannot legally drive`, action: "Update date", href: "#edit" });
            } else if (days <= 30) {
                items.push({ severity: "red", label: `DOT physical expires in ${days} days — schedule exam now`, action: "Update date", href: "#edit" });
            } else if (days <= 60) {
                items.push({ severity: "yellow", label: `DOT physical expires in ${days} days`, action: "Update date", href: "#edit" });
            }
        }
    }

    // Missing documents — tiered by CDL vs CMV vs regular
    if (!docTypes.has("CDL") && isCDL) {
        items.push({ severity: "yellow", label: "Missing: Copy of driver's license", action: "Upload", href: "#documents" });
    }
    if (!docTypes.has("MEDICAL_CERTIFICATE") && needsDOTPhysical) {
        items.push({ severity: "yellow", label: "Missing: DOT physical card", action: "Upload", href: "#documents" });
    }
    if (!docTypes.has("EMPLOYMENT_APPLICATION") && needsDOTPhysical) {
        items.push({ severity: "blue", label: "Missing: Employment application", action: "Fill out", href: `/dashboard/documents/wizard?form=driverApp&driver=${driver.id}` });
    }
    if (!docTypes.has("MVR") && needsDOTPhysical) {
        items.push({ severity: "blue", label: "Missing: Driving record (MVR) / Annual review", action: "Fill out", href: `/dashboard/documents/wizard?form=annualMVRReview&driver=${driver.id}` });
    }
    if (!docTypes.has("DRUG_TEST_RESULT") && isCDL) {
        items.push({ severity: "yellow", label: "Missing: Pre-employment drug test result", action: "Upload", href: "#documents" });
    }
    if (!docTypes.has("ROAD_TEST_CERTIFICATE") && isCDL) {
        items.push({ severity: "blue", label: "Missing: Road test certificate", action: "Fill out", href: `/dashboard/documents/wizard?form=roadTestCert&driver=${driver.id}` });
    }
    if (!docTypes.has("CLEARINGHOUSE_CONSENT") && isCDL) {
        items.push({ severity: "blue", label: "Missing: Clearinghouse consent form", action: "Fill out", href: `/dashboard/documents/wizard?form=drugAlcoholPolicy&driver=${driver.id}` });
    }

    return items;
}

export default function DriverDetail({ driver }: { driver: DriverData }) {
    const cdlDays = driver.cdlExpiration ? getDaysUntil(driver.cdlExpiration) : null;
    // Check for medical certificate: prefer driver record date, fall back to uploaded doc expiration
    const medCertDoc = driver.documents.find(d => d.documentType === "MEDICAL_CERTIFICATE");
    const effectiveMedExpiration = driver.medicalCardExpiration ?? medCertDoc?.expirationDate ?? null;
    const medDays = effectiveMedExpiration ? getDaysUntil(effectiveMedExpiration) : null;
    const isCDL = driver.licenseType === "CDL";
    const needsDOTPhysical = isCDL || driver.operatesCMV;
    const actionItems = getDriverActionItems(driver);
    const [signingDoc, setSigningDoc] = useState<{ id: string; name: string; url: string } | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const router = useRouter();

    // Inline edit state
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editData, setEditData] = useState({
        firstName: driver.firstName,
        lastName: driver.lastName,
        email: driver.email || "",
        phone: driver.phone || "",
        licenseType: driver.licenseType as string,
        operatesCMV: driver.operatesCMV,
        cdlNumber: driver.cdlNumber || "",
        cdlState: driver.cdlState || "",
        cdlClass: driver.cdlClass || "",
        cdlExpiration: driver.cdlExpiration?.split("T")[0] || "",
        medicalCardExpiration: driver.medicalCardExpiration?.split("T")[0] || "",
        hireDate: driver.hireDate.split("T")[0],
        clearinghouseQueryDate: driver.clearinghouseQueryDate?.split("T")[0] || "",
        lastDrugTestDate: driver.lastDrugTestDate?.split("T")[0] || "",
    });
    const editIsCDL = editData.licenseType === "CDL";
    const [editError, setEditError] = useState<string | null>(null);

    const handleSaveEdit = async () => {
        setSaving(true);
        setEditError(null);
        const result = await updateDriver({ id: driver.id, ...editData });
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
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className={`badge ${driver.status === "ACTIVE" ? "badge-success" : "badge-neutral"}`}>
                        {driver.status.toLowerCase()}
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
                                        onClick={() => document.getElementById("driver-documents")?.scrollIntoView({ behavior: "smooth" })}
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
                        <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>Edit Driver</h3>
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
                    {/* License Type Selector */}
                    <div style={{
                        marginBottom: "1rem", padding: "0.75rem 1rem",
                        background: "#f0fdf4", borderRadius: "10px",
                        border: "1px solid #bbf7d0",
                    }}>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#15803d", marginBottom: "0.4rem" }}>
                            What type of license does this driver hold?
                        </label>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            {[
                                { value: "CDL", label: "CDL (26,001+ lbs)", desc: "Requires drug testing, Clearinghouse, DOT physical" },
                                { value: "NON_CDL", label: "Regular License", desc: "Standard driver's license" },
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setEditData(prev => ({
                                        ...prev,
                                        licenseType: opt.value,
                                        operatesCMV: opt.value === "CDL" ? true : prev.operatesCMV,
                                    }))}
                                    style={{
                                        flex: 1, padding: "0.6rem 0.75rem", borderRadius: "8px",
                                        border: `2px solid ${editData.licenseType === opt.value ? "#16a34a" : "#e2e8f0"}`,
                                        background: editData.licenseType === opt.value ? "#f0fdf4" : "white",
                                        cursor: "pointer", textAlign: "left",
                                    }}
                                >
                                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0f172a" }}>{opt.label}</div>
                                    <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "0.15rem" }}>{opt.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        {[
                            { key: "firstName", label: "First Name", type: "text" },
                            { key: "lastName", label: "Last Name", type: "text" },
                            { key: "email", label: "Email", type: "email" },
                            { key: "phone", label: "Phone", type: "tel" },
                            { key: "cdlNumber", label: "License Number", type: "text" },
                            { key: "cdlState", label: "Issuing State", type: "text" },
                            ...(editIsCDL ? [{ key: "cdlClass", label: "CDL Class", type: "text" }] : []),
                            { key: "cdlExpiration", label: "License Expiration", type: "date" },
                            ...((editIsCDL || editData.operatesCMV) ? [{ key: "medicalCardExpiration", label: "DOT Physical Expiration", type: "date" }] : []),
                            { key: "hireDate", label: "Hire Date", type: "date" },
                            ...(editIsCDL ? [
                                { key: "clearinghouseQueryDate", label: "Last Clearinghouse Query", type: "date" },
                                { key: "lastDrugTestDate", label: "Last Drug Test", type: "date" },
                            ] : []),
                        ].map(({ key, label, type }) => (
                            <div key={key}>
                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#475569", marginBottom: "0.25rem" }}>
                                    {label}
                                </label>
                                <input
                                    type={type}
                                    value={editData[key as keyof typeof editData] as string}
                                    onChange={(e) => setEditData(prev => ({ ...prev, [key]: type === "tel" ? formatPhone(e.target.value) : e.target.value }))}
                                    style={{
                                        width: "100%", padding: "0.5rem 0.75rem",
                                        border: "1px solid #e2e8f0", borderRadius: "8px",
                                        fontSize: "0.875rem",
                                    }}
                                    autoComplete="off"
                                />
                            </div>
                        ))}
                    </div>
                    {/* CMV toggle — only shown for Non-CDL drivers */}
                    {!editIsCDL && (
                        <div style={{
                            marginTop: "1rem", padding: "0.75rem 1rem",
                            background: editData.operatesCMV ? "#f0fdf4" : "#f8fafc",
                            borderRadius: "8px",
                            border: `1px solid ${editData.operatesCMV ? "#bbf7d0" : "#e2e8f0"}`,
                        }}>
                            <label style={{
                                display: "flex", alignItems: "center", gap: "0.5rem",
                                cursor: "pointer", fontSize: "0.85rem", fontWeight: 500,
                                color: "#334155",
                            }}>
                                <input
                                    type="checkbox"
                                    checked={editData.operatesCMV}
                                    onChange={(e) => setEditData(prev => ({ ...prev, operatesCMV: e.target.checked }))}
                                    style={{ width: 16, height: 16, accentColor: "#16a34a" }}
                                />
                                This driver operates vehicles over 10,001 lbs
                            </label>
                            <p style={{ margin: "0.35rem 0 0 1.6rem", fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5 }}>
                                Check this if the driver uses work trucks, box trucks, or any vehicle + trailer combo over 10,001 lbs GVWR (check the sticker inside the driver&apos;s door). This triggers DOT physical, driving record, and employment application requirements — but <strong>not</strong> drug testing (that&apos;s only for CDL holders driving 26,001+ lbs).
                            </p>
                        </div>
                    )}
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
                {/* License Card */}
                <div style={{
                    background: "white", borderRadius: "12px", padding: "1.25rem",
                    border: "1px solid #e2e8f0",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", color: "#3b82f6" }}>
                        <Shield size={18} />
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                            {isCDL ? "CDL Information" : "License Information"}
                        </span>
                        {!isCDL && (
                            <span style={{
                                fontSize: "0.7rem", fontWeight: 600, padding: "0.1rem 0.4rem",
                                borderRadius: "4px", background: "#f1f5f9", color: "#64748b",
                            }}>{driver.operatesCMV ? "Non-CDL · CMV" : "Non-CDL"}</span>
                        )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {driver.cdlNumber && (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Number</span>
                                <span style={{ fontWeight: 500, fontFamily: "monospace" }}>{driver.cdlNumber}</span>
                            </div>
                        )}
                        {driver.cdlState && (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#64748b", fontSize: "0.85rem" }}>State</span>
                                <span style={{ fontWeight: 500 }}>{driver.cdlState}</span>
                            </div>
                        )}
                        {isCDL && driver.cdlClass && (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Class</span>
                                <span style={{ fontWeight: 500 }}>Class {driver.cdlClass}</span>
                            </div>
                        )}
                        {driver.cdlExpiration && (
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Expires</span>
                                <span style={{
                                    fontWeight: 500,
                                    color: cdlDays !== null && cdlDays <= 30 ? "#dc2626" : cdlDays !== null && cdlDays <= 60 ? "#d97706" : "#0f172a",
                                }}>
                                    {formatDate(driver.cdlExpiration)}
                                    {cdlDays !== null && cdlDays <= 30 && <AlertTriangle size={12} style={{ marginLeft: 4, verticalAlign: "middle" }} />}
                                </span>
                            </div>
                        )}
                        {!driver.cdlNumber && !driver.cdlExpiration && (
                            <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>No license details on file</span>
                        )}
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

                {/* DOT Physical / Medical Card */}
                <div style={{
                    background: "white", borderRadius: "12px", padding: "1.25rem",
                    border: "1px solid #e2e8f0",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", color: "#059669" }}>
                        <FileText size={18} />
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>DOT Physical</span>
                    </div>
                    {effectiveMedExpiration ? (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Expires</span>
                                <span style={{
                                    fontWeight: 500,
                                    color: medDays !== null && medDays <= 30 ? "#dc2626" : medDays !== null && medDays <= 60 ? "#d97706" : "#0f172a",
                                }}>
                                    {formatDate(effectiveMedExpiration)}
                                </span>
                            </div>
                            {medDays !== null && (
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                                    <span style={{ color: "#64748b", fontSize: "0.85rem" }}>Days left</span>
                                    <span style={{
                                        fontWeight: 600,
                                        color: medDays <= 30 ? "#dc2626" : medDays <= 60 ? "#d97706" : "#059669",
                                    }}>
                                        {medDays > 0 ? `${medDays} days` : `${Math.abs(medDays)} days overdue`}
                                    </span>
                                </div>
                            )}
                        </>
                    ) : (
                        <div>
                            <span style={{ color: needsDOTPhysical ? "#f59e0b" : "#94a3b8", fontSize: "0.85rem", fontWeight: 500 }}>
                                Not on file
                            </span>
                            <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: "0.4rem 0 0", lineHeight: 1.4 }}>
                                {isCDL
                                    ? "CDL drivers need a DOT physical exam before they can drive. The doctor gives them a \"medical card\" — click Edit above to add the expiration date once they have it."
                                    : driver.operatesCMV
                                    ? "Required for drivers operating vehicles over 10,001 lbs. Click Edit to add the expiration date."
                                    : "Not required for this driver's vehicle weight class."}
                            </p>
                        </div>
                    )}
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
            )}

            {/* Documents */}
            <div id="driver-documents" style={{
                background: "white", borderRadius: "12px", padding: "1.25rem",
                border: "1px solid #e2e8f0", marginBottom: "1.5rem",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>Documents</h3>
                    <DocumentUpload
                        key={refreshKey}
                        driverId={driver.id}
                        onUploadComplete={() => { setRefreshKey(k => k + 1); router.refresh(); }}
                    />
                </div>
                {driver.documents.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {driver.documents.map(doc => {
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
                                                {friendlyDocType(doc.documentType)}
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
                            No documents uploaded yet. Here&apos;s what you should have on file for each driver:
                        </p>
                        <div style={{
                            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem 1rem",
                            padding: "0.75rem", background: "#f8fafc", borderRadius: "8px",
                            fontSize: "0.78rem", color: "#475569",
                        }}>
                            <span>&#x2022; Copy of their driver&apos;s license</span>
                            <span>&#x2022; DOT physical card</span>
                            <span>&#x2022; Employment application</span>
                            <span>&#x2022; Driving record (MVR)</span>
                            <span>&#x2022; Pre-employment drug test</span>
                            <span>&#x2022; Road test certificate</span>
                        </div>
                        <p style={{ color: "#94a3b8", fontSize: "0.72rem", margin: "0.5rem 0 0" }}>
                            Click &quot;Upload Document&quot; above to add these. You can also fill out forms in the Documents wizard.
                        </p>
                    </div>
                )}
            </div>

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

            {signingDoc && (
                <SignDocumentModal
                    documentId={signingDoc.id}
                    documentName={signingDoc.name}
                    documentUrl={signingDoc.url}
                    signerRole="driver"
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
