"use client";

import { useState, useRef, useTransition } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { createDocumentRecord } from "../actions/documents";
import styles from "./DocumentUpload.module.css";

const DOCUMENT_TYPES = [
    { value: "CDL", label: "CDL Copy" },
    { value: "MEDICAL_CERTIFICATE", label: "Medical Certificate" },
    { value: "MVR", label: "Motor Vehicle Record (MVR)" },
    { value: "ROAD_TEST_CERTIFICATE", label: "Road Test Certificate" },
    { value: "EMPLOYMENT_APPLICATION", label: "Employment Application" },
    { value: "DRUG_TEST_RESULT", label: "Drug Test Result" },
    { value: "TRAINING_CERTIFICATE", label: "Training Certificate" },
    { value: "CLEARINGHOUSE_CONSENT", label: "Clearinghouse Consent" },
    { value: "REGISTRATION", label: "Registration" },
    { value: "INSURANCE", label: "Insurance" },
    { value: "ANNUAL_INSPECTION", label: "Annual Inspection Report" },
    { value: "LEASE_AGREEMENT", label: "Lease Agreement" },
    { value: "TITLE", label: "Title" },
    { value: "OPERATING_AUTHORITY", label: "Operating Authority" },
    { value: "BOC3", label: "BOC-3" },
    { value: "UCR", label: "UCR" },
    { value: "IFTA_LICENSE", label: "IFTA License" },
    { value: "INSURANCE_POLICY", label: "Insurance Policy" },
    { value: "OTHER", label: "Other" },
];

interface DocumentUploadProps {
    driverId?: string;
    vehicleId?: string;
    onUploadComplete?: () => void;
}

export default function DocumentUpload({ driverId, vehicleId, onUploadComplete }: DocumentUploadProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [docType, setDocType] = useState("OTHER");
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
                                <label className={styles.label}>Document Type</label>
                                <select
                                    value={docType}
                                    onChange={(e) => setDocType(e.target.value)}
                                    className={styles.select}
                                >
                                    {DOCUMENT_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Expiration Date (optional)</label>
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
