"use client";

import { useState, useRef, useTransition } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
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

interface DocumentUploadProps {
    driverId?: string;
    vehicleId?: string;
    onUploadComplete?: () => void;
}

export default function DocumentUpload({ driverId, vehicleId, onUploadComplete }: DocumentUploadProps) {
    const docTypes = driverId ? DRIVER_DOCUMENT_TYPES : vehicleId ? VEHICLE_DOCUMENT_TYPES : COMPANY_DOCUMENT_TYPES;
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [docType, setDocType] = useState(docTypes[0]?.value || "OTHER");
    const [docName, setDocName] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleUpload = async () => {
        if (!file) { setError("Please select a file"); return; }
        if (!docName.trim()) { setError("Please enter a document name"); return; }

        setUploading(true);
        setError("");

        try {
            // Upload file
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Upload failed");
                setUploading(false);
                return;
            }

            // Create document record
            startTransition(async () => {
                await createDocumentRecord({
                    name: docName.trim(),
                    documentType: docType,
                    fileName: data.fileName,
                    fileUrl: data.url,
                    fileSize: data.fileSize,
                    mimeType: data.mimeType,
                    driverId,
                    vehicleId,
                    expirationDate: expirationDate || undefined,
                });

                setSuccess(true);
                setUploading(false);

                // Reset after 2s
                setTimeout(() => {
                    setFile(null);
                    setDocName("");
                    setDocType("OTHER");
                    setExpirationDate("");
                    setSuccess(false);
                    setIsOpen(false);
                    onUploadComplete?.();
                }, 1500);
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
                </div>
            ) : (
                <>
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
                                <label className={styles.label}>Expiration Date (if any)</label>
                                <input
                                    type="date"
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    className={styles.input}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className={styles.error}>
                            <AlertCircle size={14} />
                            {error}
                        </div>
                    )}

                    <button
                        className={styles.submitButton}
                        onClick={handleUpload}
                        disabled={uploading || !file}
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
