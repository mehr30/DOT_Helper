"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import Link from "next/link";
import {
    Search,
    FileText,
    AlertTriangle,
    Clock,
    CheckCircle,
    FolderOpen,
    ClipboardList,
    Sparkles,
    ArrowRight,
    Edit3,
    Trash2,
    Package,
    Printer,
    PenTool,
    Download,
    Loader2,
    Users,
    Truck,
    Building2,
    ChevronDown,
    Square,
    CheckSquare,
} from "lucide-react";
import styles from "./page.module.css";
import { getSavedDocuments, deleteDocument, SavedDocument } from "./savedDocuments";
import { useDemoMode } from "../../components/DemoModeContext";
import DocumentUpload from "../../components/DocumentUpload";
import SignDocumentModal from "../../components/SignDocumentModal";
import { getDocuments, deleteDocumentRecord, type DocumentData } from "../../actions/documents";

function getStatusBadge(status: string) {
    switch (status) {
        case "expiring":
            return { label: "Expiring Soon", icon: Clock, class: "warning" };
        case "expired":
            return { label: "Expired", icon: AlertTriangle, class: "danger" };
        default:
            return { label: "Current", icon: CheckCircle, class: "success" };
    }
}

function getCategoryLabel(cat: string) {
    switch (cat) {
        case "driver": return "Driver Files";
        case "vehicle": return "Vehicle Records";
        case "company": return "Company Filing";
        case "safety": return "Safety Program";
        default: return cat;
    }
}

function getEntityLabel(doc: DocumentData): string {
    if (doc.driverName) return doc.driverName;
    if (doc.vehicleName) return doc.vehicleName;
    if (doc.companyId) return "Company";
    return "—";
}

function getEntityIcon(doc: DocumentData) {
    if (doc.driverId) return <Users size={12} style={{ color: "#3b82f6" }} />;
    if (doc.vehicleId) return <Truck size={12} style={{ color: "#059669" }} />;
    if (doc.companyId) return <Building2 size={12} style={{ color: "#7c3aed" }} />;
    return null;
}

// Wizard form options for the "Fill a Form" dropdown
const wizardForms = [
    { id: "driverApp", label: "Driver Employment Application", category: "Driver" },
    { id: "annualMVRReview", label: "Annual MVR Review", category: "Driver" },
    { id: "roadTestCert", label: "Road Test Certificate", category: "Driver" },
    { id: "annualCertViolations", label: "Annual Certification of Violations", category: "Driver" },
    { id: "drugAlcoholPolicy", label: "Drug & Alcohol Policy Acknowledgment", category: "Driver" },
    { id: "dvir", label: "Driver Vehicle Inspection Report (DVIR)", category: "Vehicle" },
    { id: "vehicleMaintRecord", label: "Vehicle Maintenance Record", category: "Vehicle" },
    { id: "accidentRegister", label: "Accident Register", category: "Company" },
    { id: "mcs150", label: "MCS-150 Biennial Update", category: "Company" },
    { id: "boc3", label: "BOC-3 Process Agent Designation", category: "Company" },
];

export default function DocumentsPage() {
    const { isDemoMode } = useDemoMode();
    const [savedDocs, setSavedDocs] = useState<SavedDocument[]>([]);
    const [realDocs, setRealDocs] = useState<DocumentData[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [signingDoc, setSigningDoc] = useState<{ id: string; name: string; url: string } | null>(null);
    const [isPending, startTransition] = useTransition();
    const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
    const [showFormPicker, setShowFormPicker] = useState(false);

    const loadRealDocs = useCallback(async () => {
        setLoadingDocs(true);
        try {
            const docs = await getDocuments();
            setRealDocs(docs);
        } catch {
            // silently fail — user might not be authenticated
        }
        setLoadingDocs(false);
    }, []);

    useEffect(() => {
        setSavedDocs(getSavedDocuments());
        if (!isDemoMode) {
            loadRealDocs();
        }
    }, [isDemoMode, loadRealDocs]);

    const handleDeleteSavedDoc = (id: string) => {
        deleteDocument(id);
        setSavedDocs(getSavedDocuments());
    };

    const handleDeleteRealDoc = (docId: string) => {
        startTransition(async () => {
            await deleteDocumentRecord(docId);
            setRealDocs(prev => prev.filter(d => d.id !== docId));
            setSelectedDocs(prev => {
                const next = new Set(prev);
                next.delete(docId);
                return next;
            });
        });
    };

    const filteredRealDocs = realDocs.filter(doc => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery ||
            doc.name.toLowerCase().includes(query) ||
            doc.documentType.toLowerCase().includes(query) ||
            (doc.driverName && doc.driverName.toLowerCase().includes(query)) ||
            (doc.vehicleName && doc.vehicleName.toLowerCase().includes(query));
        const matchesCategory = categoryFilter === "all" ||
            (categoryFilter === "driver" && doc.driverId) ||
            (categoryFilter === "vehicle" && doc.vehicleId) ||
            (categoryFilter === "company" && doc.companyId);
        return matchesSearch && matchesCategory;
    });

    const realDocCategories = [
        { id: "all", name: "All Documents", count: realDocs.length, icon: FolderOpen },
        { id: "driver", name: "Driver Files", count: realDocs.filter(d => d.driverId).length, icon: Users },
        { id: "vehicle", name: "Vehicle Records", count: realDocs.filter(d => d.vehicleId).length, icon: Truck },
        { id: "company", name: "Company Documents", count: realDocs.filter(d => d.companyId).length, icon: Building2 },
    ];

    const toggleSelectDoc = (docId: string) => {
        setSelectedDocs(prev => {
            const next = new Set(prev);
            if (next.has(docId)) next.delete(docId);
            else next.add(docId);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedDocs.size === filteredRealDocs.length) {
            setSelectedDocs(new Set());
        } else {
            setSelectedDocs(new Set(filteredRealDocs.map(d => d.id)));
        }
    };

    const handleBulkDownload = () => {
        const docsToDownload = filteredRealDocs.filter(d => selectedDocs.has(d.id) && d.fileUrl);
        docsToDownload.forEach((doc, i) => {
            setTimeout(() => {
                const a = document.createElement("a");
                a.href = doc.fileUrl;
                a.download = doc.fileName || doc.name;
                a.target = "_blank";
                a.click();
            }, i * 300); // Stagger downloads slightly
        });
    };

    const hasAnyDocs = realDocs.length > 0 || savedDocs.length > 0;

    return (
        <div className={styles.page}>
            {/* Compliance Setup Banner — only when no docs exist */}
            {!hasAnyDocs && !loadingDocs && !isDemoMode && (
                <div className={styles.wizardBanner}>
                    <div className={styles.wizardBannerIcon}>
                        <Sparkles size={24} />
                    </div>
                    <div className={styles.wizardBannerContent}>
                        <h3>Set up your DOT compliance profile</h3>
                        <p>
                            Answer a few questions about your business, vehicles, and operations.
                            We&apos;ll figure out exactly which DOT requirements apply to you and
                            set up everything you need — no jargon, no guesswork.
                        </p>
                    </div>
                    <Link href="/dashboard/documents/wizard" className={styles.wizardBannerButton}>
                        <ClipboardList size={18} />
                        Start Compliance Setup
                        <ArrowRight size={16} />
                    </Link>
                </div>
            )}

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Document Management</h1>
                    <p className={styles.subtitle}>
                        Store, organize, and track all your compliance documents
                    </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                    {/* Form Picker Dropdown */}
                    <div style={{ position: "relative" }}>
                        <button
                            onClick={() => setShowFormPicker(!showFormPicker)}
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                                padding: "0.55rem 0.9rem", borderRadius: "8px", border: "1px solid #e2e8f0",
                                background: "white", color: "#475569", fontWeight: 500, fontSize: "0.8rem",
                                cursor: "pointer", whiteSpace: "nowrap",
                            }}
                        >
                            <ClipboardList size={16} />
                            Fill a Form
                            <ChevronDown size={14} />
                        </button>
                        {showFormPicker && (
                            <>
                                <div
                                    style={{ position: "fixed", inset: 0, zIndex: 40 }}
                                    onClick={() => setShowFormPicker(false)}
                                />
                                <div style={{
                                    position: "absolute", right: 0, top: "calc(100% + 4px)",
                                    width: "320px", background: "white", borderRadius: "12px",
                                    border: "1px solid #e2e8f0", boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                                    zIndex: 50, maxHeight: "400px", overflowY: "auto",
                                }}>
                                    {["Driver", "Vehicle", "Company"].map(cat => {
                                        const forms = wizardForms.filter(f => f.category === cat);
                                        return (
                                            <div key={cat}>
                                                <div style={{
                                                    padding: "0.5rem 0.75rem", fontSize: "0.7rem",
                                                    fontWeight: 600, textTransform: "uppercase",
                                                    letterSpacing: "0.05em", color: "#94a3b8",
                                                    borderBottom: "1px solid #f1f5f9",
                                                }}>
                                                    {cat} Forms
                                                </div>
                                                {forms.map(form => (
                                                    <Link
                                                        key={form.id}
                                                        href={`/dashboard/documents/wizard?form=${form.id}`}
                                                        onClick={() => setShowFormPicker(false)}
                                                        style={{
                                                            display: "block", padding: "0.6rem 0.75rem",
                                                            fontSize: "0.82rem", color: "#1e293b",
                                                            textDecoration: "none", borderBottom: "1px solid #f8fafc",
                                                        }}
                                                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                                    >
                                                        {form.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        );
                                    })}
                                    <div style={{ borderTop: "1px solid #e2e8f0" }}>
                                        <Link
                                            href="/dashboard/documents/wizard"
                                            onClick={() => setShowFormPicker(false)}
                                            style={{
                                                display: "flex", alignItems: "center", gap: "0.4rem",
                                                padding: "0.6rem 0.75rem", fontSize: "0.82rem",
                                                color: "#3b82f6", fontWeight: 600, textDecoration: "none",
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                        >
                                            <Sparkles size={14} />
                                            Compliance Assessment
                                            <ArrowRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Upload section */}
            {!isDemoMode && (
                <div style={{ marginBottom: "0.25rem" }}>
                    <DocumentUpload onUploadComplete={() => loadRealDocs()} />
                </div>
            )}

            {/* Wizard-Saved Documents */}
            {savedDocs.length > 0 && (
                <section style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                        <h3 style={{
                            fontSize: "1rem", fontWeight: 700, color: "#0f172a",
                            display: "flex", alignItems: "center", gap: "0.5rem", margin: 0,
                        }}>
                            <ClipboardList size={18} style={{ color: "#3b82f6" }} />
                            Your Compliance Forms
                        </h3>
                        <button
                            onClick={() => {
                                const docs = getSavedDocuments();
                                if (docs.length === 0) return;
                                let content = "DOT COMPLIANCE PACKET\n";
                                content += `Generated: ${new Date().toLocaleDateString()}\n`;
                                content += "=".repeat(50) + "\n\n";
                                docs.forEach(doc => {
                                    content += `${doc.title} (${doc.cfrReference})\n`;
                                    content += `Status: ${doc.status === "completed" ? "Completed" : "Draft"} — ${doc.completedFields}/${doc.totalFields} fields\n`;
                                    content += `-`.repeat(40) + "\n";
                                    Object.entries(doc.data).forEach(([key, val]) => {
                                        if (val) {
                                            const label = key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
                                            content += `  ${label}: ${val === true ? "Yes" : val}\n`;
                                        }
                                    });
                                    content += "\n";
                                });
                                const blob = new Blob([content], { type: "text/plain" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `dot-compliance-packet-${new Date().toISOString().split("T")[0] ?? ""}.txt`;
                                a.click();
                                URL.revokeObjectURL(url);
                            }}
                            style={{
                                display: "flex", alignItems: "center", gap: "0.4rem",
                                padding: "0.5rem 1rem", borderRadius: "8px",
                                border: "1px solid #e2e8f0", background: "white",
                                color: "#475569", fontSize: "0.8rem", fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            <Package size={16} />
                            Download Compliance Packet
                        </button>
                    </div>
                    <div style={{
                        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "0.75rem"
                    }}>
                        {savedDocs.map(doc => (
                            <div key={doc.id} style={{
                                background: "white", border: "1px solid #e2e8f0",
                                borderRadius: "12px", padding: "1rem 1.25rem",
                                display: "flex", flexDirection: "column", gap: "0.5rem",
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <span style={{
                                        fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase",
                                        letterSpacing: "0.05em", padding: "0.2rem 0.5rem", borderRadius: "4px",
                                        background: doc.status === "completed" ? "#dcfce7" : "#fef3c7",
                                        color: doc.status === "completed" ? "#16a34a" : "#92400e",
                                    }}>
                                        {doc.status === "completed" ? "Completed" : "Draft"}
                                    </span>
                                    <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                                        {getCategoryLabel(doc.category)}
                                    </span>
                                </div>
                                <h4 style={{ fontSize: "0.925rem", fontWeight: 600, color: "#0f172a", margin: 0 }}>
                                    {doc.shortTitle}
                                </h4>
                                <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>
                                    {doc.cfrReference} · {doc.completedFields}/{doc.totalFields} fields filled
                                </p>
                                <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>
                                    Saved {new Date(doc.savedAt).toLocaleDateString("en-US", {
                                        month: "short", day: "numeric", year: "numeric",
                                        hour: "numeric", minute: "2-digit",
                                    })}
                                </p>
                                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                                    <Link
                                        href={`/dashboard/documents/wizard?form=${doc.formId}`}
                                        style={{
                                            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                                            gap: "0.3rem", padding: "0.5rem", borderRadius: "8px",
                                            background: "#22c55e", color: "white", fontSize: "0.8rem",
                                            fontWeight: 600, textDecoration: "none",
                                        }}
                                    >
                                        <Edit3 size={14} /> Edit
                                    </Link>
                                    <Link
                                        href={`/dashboard/documents/wizard?form=${doc.formId}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const fields: string[] = [];
                                            const sigs: string[] = [];
                                            const signDate = (doc.data.signDate as string) || (doc.data.certDate as string) || "";
                                            const sigTimestamp = signDate
                                                ? new Date(signDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                                                : new Date(doc.savedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
                                            Object.entries(doc.data).forEach(([key, val]) => {
                                                if (!val) return;
                                                if (typeof val === "string" && val.startsWith("data:image")) {
                                                    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
                                                    sigs.push(`<div style="margin-top:1.5rem"><p style="font-weight:600;margin-bottom:0.25rem">${label}:</p><img src="${val}" style="height:60px;border-bottom:1px solid #333" /><p style="font-size:0.8rem;color:#64748b;margin-top:0.25rem">Signed: ${sigTimestamp}</p></div>`);
                                                } else {
                                                    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
                                                    fields.push(`<tr><td style="padding:0.3rem 1rem 0.3rem 0;font-weight:500;color:#475569;white-space:nowrap">${label}</td><td style="padding:0.3rem 0">${val === true ? "Yes" : val}</td></tr>`);
                                                }
                                            });
                                            const w = window.open("", "_blank");
                                            if (w) {
                                                w.document.write(`<html><head><title>${doc.title}</title><style>body{font-family:system-ui;padding:2rem;max-width:700px;margin:0 auto}h1{font-size:1.3rem}table{border-collapse:collapse;width:100%}td{border-bottom:1px solid #eee;font-size:0.9rem}@media print{body{padding:0.5in}}</style></head><body><h1>${doc.title}</h1><p style="color:#64748b">${doc.cfrReference} &mdash; Generated ${new Date().toLocaleDateString()}</p><hr/><table>${fields.join("")}</table>${sigs.join("")}<script>window.print()</script></body></html>`);
                                                w.document.close();
                                            }
                                        }}
                                        style={{
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            gap: "0.3rem", padding: "0.5rem 0.75rem", borderRadius: "8px",
                                            border: "1px solid #e2e8f0", background: "white",
                                            color: "#475569", fontSize: "0.8rem", fontWeight: 500,
                                            textDecoration: "none", cursor: "pointer",
                                        }}
                                    >
                                        <Printer size={14} />
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteSavedDoc(doc.id)}
                                        style={{
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            gap: "0.3rem", padding: "0.5rem 0.75rem", borderRadius: "8px",
                                            border: "1px solid #e2e8f0", background: "white",
                                            color: "#ef4444", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer",
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Real Documents for authenticated users */}
            {!isDemoMode && (
                <>
                    {/* Category Stats */}
                    <div className={styles.statsRow}>
                        {realDocCategories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                                <button
                                    key={cat.id}
                                    className={`${styles.categoryCard} ${categoryFilter === cat.id ? styles.active : ""}`}
                                    onClick={() => setCategoryFilter(cat.id)}
                                >
                                    <Icon size={20} />
                                    <span className={styles.categoryName}>{cat.name}</span>
                                    <span className={styles.categoryCount}>{cat.count}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search + Bulk Actions */}
                    <div className={styles.toolbar}>
                        <div className={styles.searchBox}>
                            <Search size={18} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search by name, type, driver, or vehicle..."
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {selectedDocs.size > 0 && (
                            <button
                                onClick={handleBulkDownload}
                                style={{
                                    display: "flex", alignItems: "center", gap: "0.4rem",
                                    padding: "0.5rem 1rem", borderRadius: "8px",
                                    background: "#16a34a", color: "white", border: "none",
                                    fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <Download size={16} />
                                Download {selectedDocs.size} Selected
                            </button>
                        )}
                    </div>

                    {/* Documents Table */}
                    {loadingDocs ? (
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            gap: "0.5rem", padding: "3rem", color: "#64748b",
                        }}>
                            <Loader2 size={20} className={styles.spinner} /> Loading documents...
                        </div>
                    ) : filteredRealDocs.length > 0 ? (
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "36px", paddingRight: 0 }}>
                                            <button
                                                onClick={toggleSelectAll}
                                                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex", padding: 0 }}
                                            >
                                                {selectedDocs.size === filteredRealDocs.length && filteredRealDocs.length > 0
                                                    ? <CheckSquare size={16} />
                                                    : <Square size={16} />
                                                }
                                            </button>
                                        </th>
                                        <th>Document</th>
                                        <th>Type</th>
                                        <th>Associated With</th>
                                        <th>Uploaded</th>
                                        <th>Expires</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRealDocs.map((doc) => {
                                        const isExpired = doc.expirationDate && new Date(doc.expirationDate) < new Date();
                                        const isExpiring = doc.expirationDate && !isExpired &&
                                            (new Date(doc.expirationDate).getTime() - Date.now()) < 30 * 24 * 60 * 60 * 1000;
                                        const status = isExpired ? "expired" : isExpiring ? "expiring" : "current";
                                        const badge = getStatusBadge(status);
                                        const BadgeIcon = badge.icon;
                                        const isSelected = selectedDocs.has(doc.id);

                                        return (
                                            <tr key={doc.id} style={{ background: isSelected ? "#f0fdf4" : undefined }}>
                                                <td style={{ paddingRight: 0 }}>
                                                    <button
                                                        onClick={() => toggleSelectDoc(doc.id)}
                                                        style={{ background: "none", border: "none", cursor: "pointer", color: isSelected ? "#16a34a" : "#cbd5e1", display: "flex", padding: 0 }}
                                                    >
                                                        {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                                                    </button>
                                                </td>
                                                <td>
                                                    <div className={styles.docCell}>
                                                        <div className={styles.docIcon}>
                                                            <FileText size={20} />
                                                        </div>
                                                        <div className={styles.docInfo}>
                                                            <span className={styles.docName}>{doc.name}</span>
                                                            <span className={styles.docSize}>
                                                                {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(0)} KB` : doc.fileUrl ? "—" : "Form"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={styles.docType}>
                                                        {doc.documentType.replace(/_/g, " ")}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem" }}>
                                                        {getEntityIcon(doc)}
                                                        <span style={{ color: "#1e293b" }}>{getEntityLabel(doc)}</span>
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={styles.docDate}>
                                                        {new Date(doc.createdAt).toLocaleDateString("en-US", {
                                                            month: "short", day: "numeric", year: "numeric",
                                                        })}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={styles.docDate}>
                                                        {doc.expirationDate
                                                            ? new Date(doc.expirationDate).toLocaleDateString("en-US", {
                                                                month: "short", day: "numeric", year: "numeric",
                                                            })
                                                            : "—"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`${styles.statusBadge} ${styles[badge.class]}`}>
                                                        <BadgeIcon size={14} />
                                                        {badge.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className={styles.actions}>
                                                        <button
                                                            className={styles.actionBtn}
                                                            title="Sign"
                                                            onClick={() => setSigningDoc({
                                                                id: doc.id,
                                                                name: doc.name,
                                                                url: doc.fileUrl,
                                                            })}
                                                        >
                                                            <PenTool size={16} />
                                                        </button>
                                                        {doc.fileUrl ? (
                                                            <a
                                                                href={doc.fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={styles.actionBtn}
                                                                title="Download"
                                                            >
                                                                <Download size={16} />
                                                            </a>
                                                        ) : (
                                                            <Link
                                                                href={`/dashboard/documents/wizard?form=${doc.fileName?.replace(/^wizard_/, "").replace(/_d_.*|_v_.*/, "") || ""}`}
                                                                className={styles.actionBtn}
                                                                title="Open in wizard"
                                                                style={{ color: "#16a34a" }}
                                                            >
                                                                <FileText size={16} />
                                                            </Link>
                                                        )}
                                                        <button
                                                            className={styles.actionBtn}
                                                            title="Delete"
                                                            onClick={() => handleDeleteRealDoc(doc.id)}
                                                            disabled={isPending}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{
                            textAlign: "center", padding: "3rem 2rem",
                            background: "white", borderRadius: "12px", border: "1px solid #e2e8f0",
                        }}>
                            <FileText size={40} style={{ color: "#cbd5e1", marginBottom: "0.75rem" }} />
                            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b", margin: "0 0 0.25rem" }}>
                                {searchQuery || categoryFilter !== "all" ? "No documents match your filters" : "No documents uploaded yet"}
                            </h3>
                            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                                {searchQuery || categoryFilter !== "all"
                                    ? "Try adjusting your search or filter."
                                    : "Upload your first document using the button above, or go to a driver/vehicle page to upload documents there."}
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Demo mode content */}
            {isDemoMode && <>
                <div className={styles.statsRow}>
                    {[
                        { id: "all", name: "All Documents", count: 47 },
                        { id: "driver", name: "Driver Files", count: 24 },
                        { id: "vehicle", name: "Vehicle Records", count: 15 },
                        { id: "company", name: "Company Documents", count: 8 },
                    ].map((cat) => (
                        <button
                            key={cat.id}
                            className={`${styles.categoryCard} ${cat.id === "all" ? styles.active : ""}`}
                        >
                            <FolderOpen size={20} />
                            <span className={styles.categoryName}>{cat.name}</span>
                            <span className={styles.categoryCount}>{cat.count}</span>
                        </button>
                    ))}
                </div>

                <div className={styles.toolbar}>
                    <div className={styles.searchBox}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search by name, type, driver, or vehicle..."
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Document</th>
                                <th>Type</th>
                                <th>Associated With</th>
                                <th>Uploaded</th>
                                <th>Expires</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: "CDL Copy", type: "CDL", entity: "John Smith", entityIcon: "driver", uploaded: "Jan 15, 2026", expires: "Feb 15, 2026", status: "expiring" },
                                { name: "DOT Physical Card", type: "Medical Certificate", entity: "Sarah Wilson", entityIcon: "driver", uploaded: "Dec 10, 2025", expires: "Apr 14, 2026", status: "current" },
                                { name: "Annual Inspection Report", type: "Annual Inspection", entity: "Unit 103", entityIcon: "vehicle", uploaded: "Feb 22, 2025", expires: "Feb 22, 2026", status: "expiring" },
                                { name: "Insurance Certificate", type: "Insurance", entity: "Company", entityIcon: "company", uploaded: "Jan 01, 2026", expires: "Jan 01, 2027", status: "current" },
                                { name: "Annual MVR Review", type: "MVR", entity: "Mike Johnson", entityIcon: "driver", uploaded: "Nov 20, 2025", expires: "Nov 20, 2026", status: "current" },
                                { name: "Pre-Employment Drug Test", type: "Drug Test", entity: "Emily Brown", entityIcon: "driver", uploaded: "Jan 25, 2026", expires: null, status: "current" },
                                { name: "MCS-150 Filing", type: "FMCSA Filing", entity: "Company", entityIcon: "company", uploaded: "Mar 15, 2024", expires: "Mar 15, 2026", status: "expiring" },
                            ].map((doc, i) => {
                                const badge = getStatusBadge(doc.status);
                                const BadgeIcon = badge.icon;
                                return (
                                    <tr key={i}>
                                        <td>
                                            <div className={styles.docCell}>
                                                <div className={styles.docIcon}><FileText size={20} /></div>
                                                <div className={styles.docInfo}>
                                                    <span className={styles.docName}>{doc.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className={styles.docType}>{doc.type}</span></td>
                                        <td>
                                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem" }}>
                                                {doc.entityIcon === "driver" ? <Users size={12} style={{ color: "#3b82f6" }} /> :
                                                 doc.entityIcon === "vehicle" ? <Truck size={12} style={{ color: "#059669" }} /> :
                                                 <Building2 size={12} style={{ color: "#7c3aed" }} />}
                                                <span style={{ color: "#1e293b" }}>{doc.entity}</span>
                                            </span>
                                        </td>
                                        <td><span className={styles.docDate}>{doc.uploaded}</span></td>
                                        <td><span className={styles.docDate}>{doc.expires || "—"}</span></td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[badge.class]}`}>
                                                <BadgeIcon size={14} />{badge.label}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button className={styles.actionBtn} title="Download"><Download size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </>}

            {signingDoc && (
                <SignDocumentModal
                    documentId={signingDoc.id}
                    documentName={signingDoc.name}
                    documentUrl={signingDoc.url}
                    signerRole="owner"
                    onClose={() => setSigningDoc(null)}
                    onSigned={() => {
                        setSigningDoc(null);
                        loadRealDocs();
                    }}
                />
            )}
        </div>
    );
}
