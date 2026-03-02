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
    Plus
} from "lucide-react";
import styles from "./page.module.css";

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

export default function DocumentsPage() {
    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Document Management</h1>
                    <p className={styles.subtitle}>
                        Store, organize, and track all your compliance documents
                    </p>
                </div>
                <Link href="/dashboard/documents/upload" className="btn btn-primary">
                    <Upload size={18} />
                    Upload Document
                </Link>
            </header>

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
                <button className={styles.filterButton}>
                    <Filter size={18} />
                    Filter
                </button>
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
        </div>
    );
}
