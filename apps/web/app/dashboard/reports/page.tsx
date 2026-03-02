import { FileText, BarChart3, PieChart, TrendingUp, Download } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

const reportTypes = [
    { name: "Compliance Summary", description: "Overall compliance status across all categories", icon: PieChart },
    { name: "Driver Qualification", description: "DQ file status + expiring documents for all drivers", icon: FileText },
    { name: "Vehicle Maintenance", description: "Inspection schedules, DVIRs, and PM tracking", icon: BarChart3 },
    { name: "CSA Score Trends", description: "Track your BASIC category scores over time", icon: TrendingUp },
];

export default function ReportsPage() {
    return (
        <div style={{ padding: "2rem" }}>
            <header style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>Reports</h1>
                <p style={{ color: "#64748b", fontSize: "0.95rem" }}>Generate and download compliance reports for your fleet</p>
            </header>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.25rem",
            }}>
                {reportTypes.map((report) => {
                    const Icon = report.icon;
                    return (
                        <div key={report.name} style={{
                            background: "white",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            padding: "1.5rem",
                            display: "flex",
                            flexDirection: "column" as const,
                            gap: "1rem",
                        }}>
                            <div style={{
                                width: 44, height: 44,
                                borderRadius: "10px",
                                background: "#eff6ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#3b82f6",
                            }}>
                                <Icon size={22} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.35rem" }}>{report.name}</h3>
                                <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.5 }}>{report.description}</p>
                            </div>
                            <button style={{
                                marginTop: "auto",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                padding: "0.6rem 1rem",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                background: "#f8fafc",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                color: "#334155",
                            }}>
                                <Download size={16} />
                                Generate Report
                            </button>
                        </div>
                    );
                })}
            </div>

            <div style={{
                marginTop: "2rem",
                padding: "1.5rem",
                background: "#f0f9ff",
                borderRadius: "12px",
                border: "1px solid #bae6fd",
                textAlign: "center" as const,
            }}>
                <p style={{ color: "#0369a1", fontSize: "0.95rem" }}>
                    📊 Full report generation with PDF export coming soon. Stay tuned!
                </p>
            </div>
        </div>
    );
}
