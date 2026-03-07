"use client";

import { useState, useRef, useTransition } from "react";
import Link from "next/link";
import { Upload, FileText, X, CheckCircle, AlertCircle, AlertTriangle, Loader2, ArrowLeft } from "lucide-react";
import { createDocumentRecord } from "../actions/documents";
import styles from "./DocumentUpload.module.css";

const DRIVER_DOCUMENT_TYPES = [
    { value: "CDL", label: "CDL / License Copy", hint: "Photo or scan of their driver's license" },
    { value: "MEDICAL_CERTIFICATE", label: "DOT Physical Card", hint: "The card they get after their DOT physical exam" },
    { value: "MVR", label: "Driving Record (MVR)", hint: "Official driving history from the state DMV" },
    { value: "EMPLOYMENT_APPLICATION", label: "Employment Application", hint: "Their signed job application" },
    { value: "DRUG_TEST_RESULT", label: "Drug Test Result", hint: "Pre-employment or random drug/alcohol test" },
    { value: "ROAD_TEST_CERTIFICATE", label: "Road Test Certificate", hint: "Proof they passed a behind-the-wheel test" },
    { value: "TRAINING_CERTIFICATE", label: "Training Certificate", hint: "Safety training, entry-level driver training, etc." },
    { value: "CLEARINGHOUSE_CONSENT", label: "Clearinghouse Consent", hint: "Written consent to query the FMCSA Drug & Alcohol Clearinghouse" },
    { value: "OTHER", label: "Other", hint: "" },
];

const VEHICLE_DOCUMENT_TYPES = [
    { value: "REGISTRATION", label: "Registration", hint: "Current vehicle registration" },
    { value: "INSURANCE", label: "Insurance Card / Certificate", hint: "Proof of insurance for this vehicle" },
    { value: "ANNUAL_INSPECTION", label: "Annual Inspection Report", hint: "The yearly safety inspection (required by DOT)" },
    { value: "LEASE_AGREEMENT", label: "Lease Agreement", hint: "If the vehicle is leased" },
    { value: "TITLE", label: "Title", hint: "Vehicle title document" },
    { value: "OTHER", label: "Other", hint: "" },
];

const COMPANY_DOCUMENT_TYPES = [
    { value: "OPERATING_AUTHORITY", label: "Operating Authority (MC#)", hint: "Your FMCSA operating authority grant letter" },
    { value: "BOC3", label: "BOC-3 Filing", hint: "Designation of process agents" },
    { value: "UCR", label: "UCR Registration", hint: "Unified Carrier Registration — required annually" },
    { value: "IFTA_LICENSE", label: "IFTA License", hint: "International Fuel Tax Agreement license" },
    { value: "INSURANCE_POLICY", label: "Insurance Policy", hint: "Commercial auto liability policy" },
    { value: "OTHER", label: "Other", hint: "" },
];

// Document types that require an expiration date for compliance tracking
const EXPIRATION_REQUIRED_TYPES = new Set([
    "CDL", "MEDICAL_CERTIFICATE",
    "REGISTRATION", "INSURANCE", "ANNUAL_INSPECTION",
    "UCR", "IFTA_LICENSE", "INSURANCE_POLICY",
]);

interface DocumentUploadProps {
    driverId?: string;
    vehicleId?: string;
    defaultDocType?: string;
    autoOpen?: boolean;
    onUploadComplete?: () => void;
    drivers?: { id: string; name: string }[];
    vehicles?: { id: string; label: string }[];
    existingDocuments?: { documentType: string; driverId: string | null; vehicleId: string | null; companyId: string | null }[];
}

const ALL_DOC_TYPES = [...DRIVER_DOCUMENT_TYPES, ...VEHICLE_DOCUMENT_TYPES, ...COMPANY_DOCUMENT_TYPES];

type EntityTarget = "company" | "driver" | "vehicle";

export default function DocumentUpload({
    driverId,
    vehicleId,
    defaultDocType,
    autoOpen,
    onUploadComplete,
    drivers,
    vehicles,
    existingDocuments,
}: DocumentUploadProps) {
    // If driverId or vehicleId is pre-set (from detail pages / compliance links), lock the entity
    const entityLocked = !!(driverId || vehicleId);
    const initialTarget: EntityTarget = driverId ? "driver" : vehicleId ? "vehicle" : "company";

    const [entityTarget, setEntityTarget] = useState<EntityTarget>(initialTarget);
    const [selectedDriverId, setSelectedDriverId] = useState<string>("");
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");

    // Effective entity IDs: prop overrides user selection
    const effectiveDriverId = driverId ?? (entityTarget === "driver" ? selectedDriverId || undefined : undefined);
    const effectiveVehicleId = vehicleId ?? (entityTarget === "vehicle" ? selectedVehicleId || undefined : undefined);

    // Pick doc types based on entity target
    const docTypes = entityTarget === "driver" ? DRIVER_DOCUMENT_TYPES
        : entityTarget === "vehicle" ? VEHICLE_DOCUMENT_TYPES
        : COMPANY_DOCUMENT_TYPES;

    const resolvedDefault = defaultDocType && docTypes.some(t => t.value === defaultDocType)
        ? defaultDocType
        : "";

    const [isOpen, setIsOpen] = useState(autoOpen ?? false);
    const [file, setFile] = useState<File | null>(null);
    const [docType, setDocType] = useState(resolvedDefault);
    const cameFromCompliance = !!defaultDocType;
    const [docName, setDocName] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const expirationRequired = EXPIRATION_REQUIRED_TYPES.has(docType);

    // Check for duplicate documents
    const isDuplicate = docType && existingDocuments?.some(d => {
        if (d.documentType !== docType) return false;
        if (effectiveDriverId) return d.driverId === effectiveDriverId;
        if (effectiveVehicleId) return d.vehicleId === effectiveVehicleId;
        return !!d.companyId;
    });

    const docTypeLabel = ALL_DOC_TYPES.find(t => t.value === docType)?.label ?? docType;

    const handleEntityChange = (target: EntityTarget) => {
        setEntityTarget(target);
        setDocType("");
        setSelectedDriverId("");
        setSelectedVehicleId("");
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            if (!docName) setDocName(selected.name.replace(/\.[^.]+$/, ""));
            setError("");
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files[0];
        if (dropped) {
            setFile(dropped);
            if (!docName) setDocName(dropped.name.replace(/\.[^.]+$/, ""));
            setError("");
        }
    };

    const canSubmit = file && docType && docName.trim()
        && (!expirationRequired || expirationDate)
        && (entityTarget !== "driver" || entityLocked || selectedDriverId)
        && (entityTarget !== "vehicle" || entityLocked || selectedVehicleId);

    const handleUpload = async () => {
        if (!file) { setError("Please select a file"); return; }
        if (!docType) { setError("Please select a document type"); return; }
        if (!docName.trim()) { setError("Please enter a document name"); return; }
        if (expirationRequired && !expirationDate) {
            setError("This document type requires an expiration date for compliance tracking");
            return;
        }
        if (entityTarget === "driver" && !entityLocked && !selectedDriverId) {
            setError("Please select a driver for this document");
            return;
        }
        if (entityTarget === "vehicle" && !entityLocked && !selectedVehicleId) {
            setError("Please select a vehicle for this document");
            return;
        }

        setUploading(true);
        setError("");

        try {
            // Upload file
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", { method: "POST", body: formData });

            let data;
            try {
                data = await res.json();
            } catch {
                setError("Upload failed — server returned an unexpected response.");
                setUploading(false);
                return;
            }

            if (!res.ok) {
                setError(data.error || "Upload failed");
                setUploading(false);
                return;
            }

            // Create document record
            startTransition(async () => {
                try {
                    await createDocumentRecord({
                        name: docName.trim(),
                        documentType: docType,
                        fileName: data.fileName,
                        fileUrl: data.url,
                        fileSize: data.fileSize,
                        mimeType: data.mimeType,
                        driverId: effectiveDriverId,
                        vehicleId: effectiveVehicleId,
                        expirationDate: expirationDate || undefined,
                    });

                    setSuccess(true);
                    setUploading(false);
                    onUploadComplete?.();

                    // Don't auto-close when user came from compliance — let them click "Return"
                    if (!cameFromCompliance) {
                        setTimeout(() => {
                            setFile(null);
                            setDocName("");
                            setDocType(resolvedDefault);
                            setExpirationDate("");
                            setSuccess(false);
                            setIsOpen(false);
                        }, 1500);
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to save document record. Please try again.");
                    setUploading(false);
                }
            });
        } catch {
            setError("Upload failed. Please try again.");
            setUploading(false);
        }
    };

    if (!isOpen) {
        return (
            <button className={styles.uploadButton} onClick={() => setIsOpen(true)}>
                <Upload size={18} />
                Upload Document
            </button>
        );
    }

    return (
        <div className={styles.uploadPanel}>
            <div className={styles.uploadHeader}>
                <h3 className={styles.uploadTitle}>Upload Document</h3>
                <button className={styles.closeButton} onClick={() => { setIsOpen(false); setFile(null); setError(""); }}>
                    <X size={18} />
                </button>
            </div>

            {success ? (
                <div className={styles.successState}>
                    <CheckCircle size={32} />
                    <span>Document uploaded successfully!</span>
                    {cameFromCompliance && (
                        <Link
                            href="/dashboard/compliance"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "0.35rem",
                                marginTop: "0.75rem", padding: "0.5rem 1rem", borderRadius: "8px",
                                background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0",
                                fontSize: "0.82rem", fontWeight: 600, textDecoration: "none",
                            }}
                        >
                            <ArrowLeft size={14} /> Return to Compliance Checklist
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    {/* Context banner when arriving from compliance */}
                    {cameFromCompliance && (() => {
                        const docInfo = ALL_DOC_TYPES.find(t => t.value === defaultDocType);
                        return docInfo ? (
                            <div style={{
                                display: "flex", alignItems: "flex-start", gap: "0.5rem",
                                padding: "0.75rem 1rem", borderRadius: "8px",
                                background: "#eff6ff", border: "1px solid #bfdbfe",
                                marginBottom: "0.75rem", fontSize: "0.82rem", color: "#1e40af",
                            }}>
                                <FileText size={16} style={{ flexShrink: 0, marginTop: "1px" }} />
                                <div>
                                    <strong>Upload: {docInfo.label}</strong>
                                    {docInfo.hint && <div style={{ color: "#3b82f6", marginTop: "0.15rem" }}>{docInfo.hint}</div>}
                                </div>
                            </div>
                        ) : null;
                    })()}

                    {/* Entity selector — only when not locked to a specific driver/vehicle */}
                    {!entityLocked && drivers && vehicles && (
                        <div style={{ marginBottom: "0.75rem" }}>
                            <label className={styles.label} style={{ marginBottom: "0.4rem", display: "block" }}>
                                This document is for:
                            </label>
                            <div style={{ display: "flex", gap: "0.25rem", background: "#f1f5f9", borderRadius: "8px", padding: "3px" }}>
                                {([
                                    { key: "company" as const, label: "Company" },
                                    { key: "driver" as const, label: "A Driver" },
                                    { key: "vehicle" as const, label: "A Vehicle" },
                                ]).map(opt => (
                                    <button
                                        key={opt.key}
                                        onClick={() => handleEntityChange(opt.key)}
                                        style={{
                                            flex: 1, padding: "0.45rem 0.5rem", borderRadius: "6px",
                                            border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                                            background: entityTarget === opt.key ? "white" : "transparent",
                                            color: entityTarget === opt.key ? "#0f172a" : "#64748b",
                                            boxShadow: entityTarget === opt.key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            {/* Driver dropdown */}
                            {entityTarget === "driver" && (
                                <select
                                    value={selectedDriverId}
                                    onChange={(e) => setSelectedDriverId(e.target.value)}
                                    className={styles.select}
                                    style={{ marginTop: "0.4rem" }}
                                >
                                    <option value="" disabled>Select a driver...</option>
                                    {drivers.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            )}

                            {/* Vehicle dropdown */}
                            {entityTarget === "vehicle" && (
                                <select
                                    value={selectedVehicleId}
                                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                                    className={styles.select}
                                    style={{ marginTop: "0.4rem" }}
                                >
                                    <option value="" disabled>Select a vehicle...</option>
                                    {vehicles.map(v => (
                                        <option key={v.id} value={v.id}>{v.label}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}

                    {/* Drop zone */}
                    <div
                        className={`${styles.dropZone} ${file ? styles.hasFile : ""}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        {file ? (
                            <div className={styles.selectedFile}>
                                <FileText size={24} />
                                <div>
                                    <span className={styles.fileName}>{file.name}</span>
                                    <span className={styles.fileSize}>
                                        {(file.size / 1024).toFixed(0)} KB
                                    </span>
                                </div>
                                <button
                                    className={styles.removeFile}
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className={styles.dropPrompt}>
                                <Upload size={24} />
                                <span>Drop file here or click to browse</span>
                                <span className={styles.dropHint}>PDF, JPG, PNG, DOC up to 10MB</span>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                            onChange={handleFileSelect}
                            style={{ display: "none" }}
                        />
                    </div>

                    {/* Form fields */}
                    <div className={styles.formFields}>
                        <div className={styles.field}>
                            <label className={styles.label}>Document Name</label>
                            <input
                                type="text"
                                value={docName}
                                onChange={(e) => setDocName(e.target.value)}
                                placeholder="e.g., John Smith CDL Copy"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.fieldRow}>
                            <div className={styles.field}>
                                <label className={styles.label}>What type of document is this?</label>
                                <select
                                    value={docType}
                                    onChange={(e) => setDocType(e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="" disabled>Select document type...</option>
                                    {docTypes.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                                {docTypes.find(t => t.value === docType)?.hint && (
                                    <span style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.2rem", display: "block" }}>
                                        {docTypes.find(t => t.value === docType)?.hint}
                                    </span>
                                )}
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>
                                    Expiration Date{expirationRequired ? (
                                        <span style={{ color: "#dc2626", marginLeft: "0.2rem" }}>*</span>
                                    ) : " (if any)"}
                                </label>
                                <input
                                    type="date"
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    className={styles.input}
                                />
                                {expirationRequired && (
                                    <span style={{ fontSize: "0.7rem", color: "#dc2626", marginTop: "0.2rem", display: "block" }}>
                                        This document expires — the date is needed for compliance tracking
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Duplicate warning */}
                    {isDuplicate && (
                        <div style={{
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            padding: "0.6rem 0.75rem", borderRadius: "8px",
                            background: "#fffbeb", border: "1px solid #fef3c7",
                            fontSize: "0.78rem", color: "#92400e", marginTop: "0.25rem",
                        }}>
                            <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                            A {docTypeLabel} is already on file. Uploading will add another copy.
                        </div>
                    )}

                    {error && (
                        <div className={styles.error}>
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    <button
                        className={styles.submitButton}
                        onClick={handleUpload}
                        disabled={uploading || !canSubmit}
                    >
                        {uploading ? (
                            <><Loader2 size={18} className={styles.spinner} /> Uploading...</>
                        ) : (
                            <><Upload size={18} /> Upload Document</>
                        )}
                    </button>
                </>
            )}
        </div>
    );
}
