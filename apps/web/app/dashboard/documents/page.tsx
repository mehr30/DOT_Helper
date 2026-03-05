"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    Upload,
    FileText,
    Download,
    MoreVertical,
    AlertTriangle,
    Clock,
    CheckCircle,
    FolderOpen,
    Plus,
    ClipboardList,
    Sparkles,
    ArrowRight,
    Edit3,
    Trash2,
    Package,
    PenTool,
    ExternalLink,
    Loader2,
} from "lucide-react";
import styles from "./page.module.css";
import { getSavedDocuments, deleteDocument, SavedDocument } from "./savedDocuments";
import { useDemoMode } from "../../components/DemoModeContext";
import DocumentUpload from "../../components/DocumentUpload";
import SignDocumentModal from "../../components/SignDocumentModal";
import { getDocuments, deleteDocumentRecord, type DocumentData } from "../../actions/documents";

// Document types and their categories
const documentCategories = [
    { id: "all", name: "All Documents", count: 47 },
    { id: "driver", name: "Driver Files", count: 24 },
    { id: "vehicle", name: "Vehicle Records", count: 15 },
    { id: "company", name: "Company Documents", count: 8 },
];

// Mock documents data
const documents = [
    {
        id: "1",
        name: "CDL - John Smith",
        type: "CDL",
        category: "driver",
        entity: "John Smith",
        uploadDate: "Jan 15, 2026",
        expirationDate: "Feb 15, 2026",
        status: "expiring",
        fileSize: "1.2 MB"
    },
    {
        id: "2",
        name: "Medical Card - Sarah Wilson",
        type: "Medical Certificate",
        category: "driver",
        entity: "Sarah Wilson",
        uploadDate: "Dec 10, 2025",
        expirationDate: "Apr 14, 2026",
        status: "current",
        fileSize: "850 KB"
    },
    {
        id: "3",
        name: "Annual Inspection - Unit 103",
        type: "DOT Inspection",
        category: "vehicle",
        entity: "Unit 103",
        uploadDate: "Feb 22, 2025",
        expirationDate: "Feb 22, 2026",
        status: "expiring",
        fileSize: "2.1 MB"
    },
    {
        id: "4",
        name: "Insurance Certificate",
        type: "Insurance",
        category: "company",
        entity: "Transport Co.",
        uploadDate: "Jan 01, 2026",
        expirationDate: "Jan 01, 2027",
        status: "current",
        fileSize: "1.5 MB"
    },
    {
        id: "5",
        name: "MVR - Mike Johnson",
        type: "MVR",
        category: "driver",
        entity: "Mike Johnson",
        uploadDate: "Nov 20, 2025",
        expirationDate: "Nov 20, 2026",
        status: "current",
        fileSize: "420 KB"
    },
    {
        id: "6",
        name: "Drug Test Results - Emily Brown",
        type: "Drug Test",
        category: "driver",
        entity: "Emily Brown",
        uploadDate: "Jan 25, 2026",
        expirationDate: null,
        status: "current",
        fileSize: "320 KB"
    },
    {
        id: "7",
        name: "MCS-150 Filing",
        type: "FMCSA Filing",
        category: "company",
        entity: "Transport Co.",
        uploadDate: "Mar 15, 2024",
        expirationDate: "Mar 15, 2026",
        status: "expiring",
        fileSize: "180 KB"
    },
];

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

export default function DocumentsPage() {
    const { isDemoMode } = useDemoMode();
    const [savedDocs, setSavedDocs] = useState<SavedDocument[]>([]);
    const [realDocs, setRealDocs] = useState<DocumentData[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [signingDoc, setSigningDoc] = useState<{ id: string; name: string; url: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    const loadRealDocs = async () => {
        setLoadingDocs(true);
        try {
            const docs = await getDocuments();
            setRealDocs(docs);
        } catch {
            // silently fail — user might not be authenticated
        }
        setLoadingDocs(false);
    };

    useEffect(() => {
        setSavedDocs(getSavedDocuments());
        if (!isDemoMode) {
            loadRealDocs();
        }
    }, [isDemoMode]);

    const handleDeleteSavedDoc = (id: string) => {
        deleteDocument(id);
        setSavedDocs(getSavedDocuments());
    };

    const handleDeleteRealDoc = (docId: string) => {
        startTransition(async () => {
            await deleteDocumentRecord(docId);
            setRealDocs(prev => prev.filter(d => d.id !== docId));
        });
    };

    const filteredRealDocs = realDocs.filter(doc => {
        const matchesSearch = !searchQuery ||
            doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.documentType.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" ||
            (categoryFilter === "driver" && doc.driverId) ||
            (categoryFilter === "vehicle" && doc.vehicleId) ||
            (categoryFilter === "company" && doc.companyId);
        return matchesSearch && matchesCategory;
    });

    const realDocCategories = [
        { id: "all", name: "All Documents", count: realDocs.length },
        { id: "driver", name: "Driver Files", count: realDocs.filter(d => d.driverId).length },
        { id: "vehicle", name: "Vehicle Records", count: realDocs.filter(d => d.vehicleId).length },
        { id: "company", name: "Company Documents", count: realDocs.filter(d => d.companyId).length },
    ];

    return (
        <div className={styles.page}>
            {/* Compliance Setup Banner */}
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

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Document Management</h1>
                    <p className={styles.subtitle}>
                        Store, organize, and track all your compliance documents
                    </p>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <Link href="/dashboard/documents/wizard" className="btn btn-secondary" style={{
                        display: "inline-flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0",
                        background: "white", color: "#475569", fontWeight: 500, fontSize: "0.875rem",
                        textDecoration: "none", whiteSpace: "nowrap",
                    }}>
                        <ClipboardList size={18} />
                        Fill a Form
                    </Link>
                    {!isDemoMode && (
                        <DocumentUpload onUploadComplete={() => loadRealDocs()} />
                    )}
                </div>
            </header>

            {/* Wizard-Saved Documents */}
            {savedDocs.length > 0 && (
                <section style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                        <h3 style={{
                            fontSize: "1rem", fontWeight: 700, color: "#0f172a",
                            display: "flex", alignItems: "center", gap: "0.5rem", margin: 0,
                        }}>
                            <ClipboardList size={18} style={{ color: "#3b82f6" }} />
                            Your Compliance Documents
                        </h3>
                        <button
                            onClick={() => {
                                // Generate a simple text summary of all saved docs for now
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
                                a.download = `dot-compliance-packet-${new Date().toISOString().split("T")[0]}.txt`;
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
                                        {doc.status === "completed" ? "✓ Completed" : "● Draft"}
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
                                            background: "#3b82f6", color: "white", fontSize: "0.8rem",
                                            fontWeight: 600, textDecoration: "none",
                                        }}
                                    >
                                        <Edit3 size={14} /> Edit
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
                        {realDocCategories.map((cat) => (
                            <button
                                key={cat.id}
                                className={`${styles.categoryCard} ${categoryFilter === cat.id ? styles.active : ""}`}
                                onClick={() => setCategoryFilter(cat.id)}
                            >
                                <FolderOpen size={20} />
                                <span className={styles.categoryName}>{cat.name}</span>
                                <span className={styles.categoryCount}>{cat.count}</span>
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className={styles.toolbar}>
                        <div className={styles.searchBox}>
                            <Search size={18} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search documents..."
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
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
                                        <th>Document</th>
                                        <th>Type</th>
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

                                        return (
                                            <tr key={doc.id}>
                                                <td>
                                                    <div className={styles.docCell}>
                                                        <div className={styles.docIcon}>
                                                            <FileText size={20} />
                                                        </div>
                                                        <div className={styles.docInfo}>
                                                            <span className={styles.docName}>{doc.name}</span>
                                                            <span className={styles.docSize}>
                                                                {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(0)} KB` : "—"}
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
                                                        <a
                                                            href={doc.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={styles.actionBtn}
                                                            title="View / Download"
                                                        >
                                                            <ExternalLink size={16} />
                                                        </a>
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

            {isDemoMode && <>
                {/* Stats */}
                <div className={styles.statsRow}>
                    {documentCategories.map((cat) => (
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

                {/* Toolbar */}
                <div className={styles.toolbar}>
                    <div className={styles.searchBox}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                {/* Documents Table */}
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
                            {documents.map((doc) => {
                                const status = getStatusBadge(doc.status);
                                const StatusIcon = status.icon;

                                return (
                                    <tr key={doc.id}>
                                        <td>
                                            <div className={styles.docCell}>
                                                <div className={styles.docIcon}>
                                                    <FileText size={20} />
                                                </div>
                                                <div className={styles.docInfo}>
                                                    <span className={styles.docName}>{doc.name}</span>
                                                    <span className={styles.docSize}>{doc.fileSize}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={styles.docType}>{doc.type}</span>
                                        </td>
                                        <td>
                                            <span className={styles.docEntity}>{doc.entity}</span>
                                        </td>
                                        <td>
                                            <span className={styles.docDate}>{doc.uploadDate}</span>
                                        </td>
                                        <td>
                                            <span className={styles.docDate}>
                                                {doc.expirationDate || "—"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[status.class]}`}>
                                                <StatusIcon size={14} />
                                                {status.label}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button className={styles.actionBtn} title="Download">
                                                    <Download size={16} />
                                                </button>
                                                <button className={styles.actionBtn} title="More">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Quick Upload Box */}
                <div className={styles.uploadBox}>
                    <div className={styles.uploadContent}>
                        <Plus size={24} />
                        <div>
                            <h3>Quick Upload</h3>
                            <p>Drag and drop files here or click to browse</p>
                        </div>
                    </div>
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
