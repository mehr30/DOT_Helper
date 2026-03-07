"use client";

import { useState } from "react";
import Link from "next/link";
import {
    BarChart3,
    Users,
    Truck,
    FileText,
    Download,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Shield,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { useDemoMode } from "../../components/DemoModeContext";
import EmptyState from "../../components/EmptyState";
import type { ReportData } from "../../actions/reports";

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
    });
}

function getScoreColor(score: number) {
    if (score >= 90) return "#16a34a";
    if (score >= 70) return "#d97706";
    return "#dc2626";
}

function getScoreBg(score: number) {
    if (score >= 90) return "#dcfce7";
    if (score >= 70) return "#fef3c7";
    return "#fef2f2";
}

function getDaysColor(days: number | null) {
    if (days === null) return "#94a3b8";
    if (days <= 0) return "#dc2626";
    if (days <= 30) return "#d97706";
    return "#16a34a";
}

function getDaysLabel(days: number | null) {
    if (days === null) return "Not set";
    if (days <= 0) return `${Math.abs(days)}d overdue`;
    return `${days}d left`;
}

function generateDriverReport(data: ReportData): string {
    let content = `DRIVER QUALIFICATION FILE REPORT\n`;
    content += `${data.companyName}\n`;
    content += `Generated: ${new Date(data.generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}\n`;
    content += "=".repeat(60) + "\n\n";
    content += `Total Active Drivers: ${data.drivers.length}\n`;
    content += `DQ File Compliance: ${data.complianceSummary.driverQualification}%\n\n`;

    data.drivers.forEach(d => {
        content += `${"─".repeat(50)}\n`;
        content += `${d.name}${d.cdlNumber ? ` (${d.cdlState ?? ""} ${d.cdlNumber})` : ""}\n`;
        content += `${"─".repeat(50)}\n`;
        content += `  Status: ${d.status}\n`;
        content += `  Hire Date: ${formatDate(d.hireDate)}\n`;
        content += `  License Expires: ${d.cdlExpiration ? formatDate(d.cdlExpiration) : "Not set"}\n`;
        content += `  DOT Physical Expires: ${d.medicalExpiration ? formatDate(d.medicalExpiration) : "Not set"}\n`;
        content += `  Documents on File: ${d.documentCount}\n`;
        if (d.missingDocs.length > 0) {
            content += `  MISSING DOCUMENTS:\n`;
            d.missingDocs.forEach(doc => { content += `    - ${doc}\n`; });
        }
        content += "\n";
    });
    return content;
}

function generateVehicleReport(data: ReportData): string {
    let content = `VEHICLE MAINTENANCE REPORT\n`;
    content += `${data.companyName}\n`;
    content += `Generated: ${new Date(data.generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}\n`;
    content += "=".repeat(60) + "\n\n";
    content += `Total Active Vehicles: ${data.vehicles.length}\n`;
    content += `Vehicle Compliance: ${data.complianceSummary.vehicleMaintenance}%\n\n`;

    data.vehicles.forEach(v => {
        content += `${"─".repeat(50)}\n`;
        content += `Unit ${v.unitNumber} — ${v.yearMakeModel}\n`;
        content += `${"─".repeat(50)}\n`;
        content += `  VIN: ${v.vin || "Not set"}\n`;
        content += `  Status: ${v.status}\n`;
        content += `  Annual Inspection Due: ${v.inspectionDue ? formatDate(v.inspectionDue) : "Not set"}\n`;
        content += `  Next PM Due: ${v.nextPmDue ? formatDate(v.nextPmDue) : "Not set"}\n`;
        content += `  Documents on File: ${v.documentCount}\n`;
        if (v.missingDocs.length > 0) {
            content += `  MISSING DOCUMENTS:\n`;
            v.missingDocs.forEach(doc => { content += `    - ${doc}\n`; });
        }
        content += "\n";
    });
    return content;
}

function generateComplianceSummary(data: ReportData): string {
    let content = `COMPLIANCE SUMMARY REPORT\n`;
    content += `${data.companyName}\n`;
    content += `Generated: ${new Date(data.generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}\n`;
    content += "=".repeat(60) + "\n\n";
    content += `OVERALL COMPLIANCE SCORE: ${data.complianceSummary.overall}%\n\n`;
    content += `Category Scores:\n`;
    content += `  Driver Qualification: ${data.complianceSummary.driverQualification}%\n`;
    content += `  Vehicle Maintenance:  ${data.complianceSummary.vehicleMaintenance}%\n`;
    content += `  Drug & Alcohol:       ${data.complianceSummary.drugAlcohol}%\n`;
    content += `  Company & Authority:  ${data.complianceSummary.companyAuthority}%\n\n`;
    content += `Fleet Summary:\n`;
    content += `  Active Drivers:  ${data.drivers.length}\n`;
    content += `  Active Vehicles: ${data.vehicles.length}\n`;
    content += `  Total Documents: ${data.documentCounts.total}\n`;
    content += `  Expiring Soon:   ${data.documentCounts.expiringSoon}\n`;
    content += `  Expired:         ${data.documentCounts.expired}\n\n`;

    // Urgent items
    const urgentItems: string[] = [];
    data.drivers.forEach(d => {
        if (d.cdlDaysLeft !== null && d.cdlDaysLeft <= 0) urgentItems.push(`[EXPIRED] ${d.name} — License expired ${Math.abs(d.cdlDaysLeft)} days ago`);
        else if (d.cdlDaysLeft !== null && d.cdlDaysLeft <= 30) urgentItems.push(`[URGENT] ${d.name} — License expires in ${d.cdlDaysLeft} days`);
        if (d.medicalDaysLeft !== null && d.medicalDaysLeft <= 0) urgentItems.push(`[EXPIRED] ${d.name} — DOT physical expired ${Math.abs(d.medicalDaysLeft)} days ago`);
        else if (d.medicalDaysLeft !== null && d.medicalDaysLeft <= 30) urgentItems.push(`[URGENT] ${d.name} — DOT physical expires in ${d.medicalDaysLeft} days`);
    });
    data.vehicles.forEach(v => {
        if (v.inspectionDaysLeft !== null && v.inspectionDaysLeft <= 0) urgentItems.push(`[EXPIRED] Unit ${v.unitNumber} — Annual inspection overdue by ${Math.abs(v.inspectionDaysLeft)} days`);
        else if (v.inspectionDaysLeft !== null && v.inspectionDaysLeft <= 30) urgentItems.push(`[URGENT] Unit ${v.unitNumber} — Annual inspection due in ${v.inspectionDaysLeft} days`);
    });

    if (urgentItems.length > 0) {
        content += `ITEMS REQUIRING IMMEDIATE ACTION:\n`;
        urgentItems.forEach(item => { content += `  ${item}\n`; });
    } else {
        content += `No items require immediate action.\n`;
    }

    return content;
}

function downloadText(content: string, filename: string) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export default function ReportsContent({ data }: { data: ReportData | null }) {
    const { isDemoMode } = useDemoMode();
    const [expandedReport, setExpandedReport] = useState<string | null>(null);

    if (!data && !isDemoMode) {
        return (
            <div style={{ padding: "2rem" }}>
                <header style={{ marginBottom: "1rem" }}>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Reports</h1>
                    <p style={{ color: "#64748b" }}>Generate and download compliance reports for your fleet</p>
                </header>
                <EmptyState
                    icon={BarChart3}
                    title="No report data yet"
                    description="Add drivers and vehicles to generate compliance reports. Reports include DQ file status, vehicle maintenance, and overall compliance scores."
                    primaryAction={{ label: "Add Drivers", href: "/dashboard/drivers/new" }}
                    secondaryAction={{ label: "Add Vehicles", href: "/dashboard/vehicles/new" }}
                />
            </div>
        );
    }

    // Use real data or demo data
    const reportData: ReportData = data ?? {
        companyName: "Transport Co.",
        generatedAt: new Date().toISOString(),
        drivers: [
            { id: "1", name: "John Smith", status: "ACTIVE", cdlNumber: "D1234567", cdlState: "TX", cdlExpiration: "2026-02-15T00:00:00Z", cdlDaysLeft: -19, medicalExpiration: "2026-06-01T00:00:00Z", medicalDaysLeft: 87, hireDate: "2024-03-01T00:00:00Z", documentCount: 5, missingDocs: [] },
            { id: "2", name: "Sarah Wilson", status: "ACTIVE", cdlNumber: "D7654321", cdlState: "TX", cdlExpiration: "2026-09-15T00:00:00Z", cdlDaysLeft: 193, medicalExpiration: "2026-04-14T00:00:00Z", medicalDaysLeft: 39, hireDate: "2023-11-15T00:00:00Z", documentCount: 3, missingDocs: ["MVR / Driving record"] },
            { id: "3", name: "Mike Johnson", status: "ACTIVE", cdlNumber: "D9876543", cdlState: "KS", cdlExpiration: "2027-01-01T00:00:00Z", cdlDaysLeft: 301, medicalExpiration: "2026-03-01T00:00:00Z", medicalDaysLeft: -5, hireDate: "2025-06-01T00:00:00Z", documentCount: 2, missingDocs: ["Employment application", "Drug test result"] },
        ],
        vehicles: [
            { id: "1", unitNumber: "101", yearMakeModel: "2022 Kenworth T680", vin: "1NKWL00X1NR000001", status: "ACTIVE", inspectionDue: "2026-04-20T00:00:00Z", inspectionDaysLeft: 45, nextPmDue: "2026-03-20T00:00:00Z", pmDaysLeft: 14, documentCount: 3, missingDocs: [] },
            { id: "2", unitNumber: "102", yearMakeModel: "2021 Peterbilt 579", vin: "2NP2LN0X7MT000002", status: "ACTIVE", inspectionDue: "2026-06-15T00:00:00Z", inspectionDaysLeft: 101, nextPmDue: null, pmDaysLeft: null, documentCount: 2, missingDocs: ["Insurance"] },
            { id: "3", unitNumber: "103", yearMakeModel: "2020 Kenworth T680", vin: "1NKWL00X0LR000003", status: "ACTIVE", inspectionDue: "2026-02-22T00:00:00Z", inspectionDaysLeft: -12, nextPmDue: null, pmDaysLeft: null, documentCount: 1, missingDocs: ["Registration", "Insurance"] },
        ],
        documentCounts: { total: 16, driverDocs: 10, vehicleDocs: 6, companyDocs: 0, expiringSoon: 3, expired: 1 },
        complianceSummary: { overall: 78, driverQualification: 82, vehicleMaintenance: 67, drugAlcohol: 100, companyAuthority: 85 },
    };

    const toggle = (report: string) => {
        setExpandedReport(expandedReport === report ? null : report);
    };

    const dateStamp = new Date().toISOString().split("T")[0] ?? "";

    return (
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <header style={{ marginBottom: "1.5rem" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.25rem" }}>Reports</h1>
                <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                    Generate and download compliance reports for {reportData.companyName}
                </p>
            </header>

            {/* Score Overview */}
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "0.75rem", marginBottom: "1.5rem",
            }}>
                {[
                    { label: "Overall", score: reportData.complianceSummary.overall, icon: Shield },
                    { label: "Driver DQ", score: reportData.complianceSummary.driverQualification, icon: Users },
                    { label: "Vehicles", score: reportData.complianceSummary.vehicleMaintenance, icon: Truck },
                    { label: "Documents", score: Math.round(((reportData.documentCounts.total - reportData.documentCounts.expired) / Math.max(reportData.documentCounts.total, 1)) * 100), icon: FileText },
                ].map(item => {
                    const Icon = item.icon;
                    return (
                        <div key={item.label} style={{
                            background: "white", borderRadius: "12px", padding: "1rem",
                            border: "1px solid #e2e8f0", textAlign: "center",
                        }}>
                            <Icon size={20} style={{ color: getScoreColor(item.score), marginBottom: "0.35rem" }} />
                            <div style={{
                                fontSize: "1.5rem", fontWeight: 700,
                                color: getScoreColor(item.score),
                            }}>
                                {item.score}%
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>
                                {item.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Stats */}
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "0.5rem", marginBottom: "1.5rem",
            }}>
                {[
                    { label: "Active Drivers", value: reportData.drivers.length, color: "#3b82f6" },
                    { label: "Active Vehicles", value: reportData.vehicles.length, color: "#059669" },
                    { label: "Total Documents", value: reportData.documentCounts.total, color: "#7c3aed" },
                    { label: "Expiring Soon", value: reportData.documentCounts.expiringSoon, color: "#d97706" },
                    { label: "Expired", value: reportData.documentCounts.expired, color: "#dc2626" },
                ].map(stat => (
                    <div key={stat.label} style={{
                        background: "white", borderRadius: "10px", padding: "0.75rem",
                        border: "1px solid #e2e8f0",
                    }}>
                        <div style={{ fontSize: "1.25rem", fontWeight: 700, color: stat.color }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Report Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {/* Compliance Summary */}
                <ReportCard
                    title="Compliance Summary"
                    description="Overall compliance scores and items requiring immediate action"
                    icon={Shield}
                    expanded={expandedReport === "compliance"}
                    onToggle={() => toggle("compliance")}
                    onDownload={() => downloadText(generateComplianceSummary(reportData), `compliance-summary-${dateStamp}.txt`)}
                >
                    <div style={{ padding: "1rem" }}>
                        {/* Urgent items */}
                        {(() => {
                            const urgent: Array<{ label: string; severity: "red" | "yellow" }> = [];
                            reportData.drivers.forEach(d => {
                                if (d.cdlDaysLeft !== null && d.cdlDaysLeft <= 0) urgent.push({ label: `${d.name} — License expired`, severity: "red" });
                                else if (d.cdlDaysLeft !== null && d.cdlDaysLeft <= 30) urgent.push({ label: `${d.name} — License expires in ${d.cdlDaysLeft} days`, severity: "yellow" });
                                if (d.medicalDaysLeft !== null && d.medicalDaysLeft <= 0) urgent.push({ label: `${d.name} — DOT physical expired`, severity: "red" });
                                else if (d.medicalDaysLeft !== null && d.medicalDaysLeft <= 30) urgent.push({ label: `${d.name} — DOT physical expires in ${d.medicalDaysLeft} days`, severity: "yellow" });
                            });
                            reportData.vehicles.forEach(v => {
                                if (v.inspectionDaysLeft !== null && v.inspectionDaysLeft <= 0) urgent.push({ label: `Unit ${v.unitNumber} — Inspection overdue`, severity: "red" });
                                else if (v.inspectionDaysLeft !== null && v.inspectionDaysLeft <= 30) urgent.push({ label: `Unit ${v.unitNumber} — Inspection due in ${v.inspectionDaysLeft} days`, severity: "yellow" });
                            });

                            if (urgent.length === 0) return (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem", background: "#dcfce7", borderRadius: "8px", color: "#16a34a", fontSize: "0.85rem", fontWeight: 600 }}>
                                    <CheckCircle size={16} /> All clear — no items need immediate action
                                </div>
                            );

                            return (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                                        Items Requiring Immediate Action ({urgent.length})
                                    </div>
                                    {urgent.map((item, i) => (
                                        <div key={i} style={{
                                            display: "flex", alignItems: "center", gap: "0.5rem",
                                            padding: "0.4rem 0.6rem", borderRadius: "6px",
                                            background: item.severity === "red" ? "#fef2f2" : "#fffbeb",
                                            fontSize: "0.82rem",
                                        }}>
                                            {item.severity === "red" ? <XCircle size={14} style={{ color: "#dc2626" }} /> : <AlertTriangle size={14} style={{ color: "#d97706" }} />}
                                            <span style={{ color: item.severity === "red" ? "#991b1b" : "#92400e" }}>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>
                </ReportCard>

                {/* Driver Qualification */}
                <ReportCard
                    title="Driver Qualification Files"
                    description={`DQ file status for ${reportData.drivers.length} active driver${reportData.drivers.length !== 1 ? "s" : ""}`}
                    icon={Users}
                    expanded={expandedReport === "drivers"}
                    onToggle={() => toggle("drivers")}
                    onDownload={() => downloadText(generateDriverReport(reportData), `driver-qualification-report-${dateStamp}.txt`)}
                >
                    {reportData.drivers.length > 0 ? (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                                        <th style={{ textAlign: "left", padding: "0.6rem 0.75rem", color: "#64748b", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase" }}>Driver</th>
                                        <th style={{ textAlign: "left", padding: "0.6rem 0.75rem", color: "#64748b", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase" }}>License</th>
                                        <th style={{ textAlign: "left", padding: "0.6rem 0.75rem", color: "#64748b", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase" }}>DOT Physical</th>
                                        <th style={{ textAlign: "left", padding: "0.6rem 0.75rem", color: "#64748b", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase" }}>Docs</th>
                                        <th style={{ textAlign: "left", padding: "0.6rem 0.75rem", color: "#64748b", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase" }}>Missing</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.drivers.map(d => (
                                        <tr key={d.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={{ padding: "0.6rem 0.75rem" }}>
                                                <Link href={`/dashboard/drivers/${d.id}`} style={{ color: "#1e293b", fontWeight: 500, textDecoration: "none" }}>
                                                    {d.name}
                                                </Link>
                                                {d.cdlNumber && <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{d.cdlState} {d.cdlNumber}</div>}
                                            </td>
                                            <td style={{ padding: "0.6rem 0.75rem" }}>
                                                <span style={{ color: getDaysColor(d.cdlDaysLeft), fontWeight: 600, fontSize: "0.78rem" }}>
                                                    {getDaysLabel(d.cdlDaysLeft)}
                                                </span>
                                            </td>
                                            <td style={{ padding: "0.6rem 0.75rem" }}>
                                                <span style={{ color: getDaysColor(d.medicalDaysLeft), fontWeight: 600, fontSize: "0.78rem" }}>
                                                    {getDaysLabel(d.medicalDaysLeft)}
                                                </span>
                                            </td>
                                            <td style={{ padding: "0.6rem 0.75rem", color: "#475569" }}>{d.documentCount}</td>
                                            <td style={{ padding: "0.6rem 0.75rem" }}>
                                                {d.missingDocs.length > 0 ? (
                                                    <span style={{ color: "#d97706", fontSize: "0.78rem" }}>
                                                        {d.missingDocs.join(", ")}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: "#16a34a", fontSize: "0.78rem" }}>Complete</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: "1.5rem", textAlign: "center", color: "#64748b", fontSize: "0.85rem" }}>
                            No active drivers. <Link href="/dashboard/drivers/new" style={{ color: "#3b82f6" }}>Add your first driver</Link>
                        </div>
                    )}
                </ReportCard>

                {/* Vehicle Maintenance */}
                <ReportCard
                    title="Vehicle Maintenance Report"
                    description={`Inspection and PM status for ${reportData.vehicles.length} vehicle${reportData.vehicles.length !== 1 ? "s" : ""}`}
                    icon={Truck}
                    expanded={expandedReport === "vehicles"}
                    onToggle={() => toggle("vehicles")}
                    onDownload={() => downloadText(generateVehicleReport(reportData), `vehicle-maintenance-report-${dateStamp}.txt`)}
                >
                    {reportData.vehicles.length > 0 ? (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                                        <th style={{ textAlign: "left", padding: "0.6rem 0.75rem", color: "#64748b", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase" }}>Vehicle</th>
                                        <th style={{ textAlign: "left", padding: "0.6rem 0.75rem", color: "#64748b", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase" }}>Annual Inspection</th>
                                        <th style={{ textAlign: "left", padding: "0.6rem 0.75rem", color: "#64748b", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase" }}>Next PM</th>
                                        <th style={{ textAlign: "left", padding: "0.6rem 0.75rem", color: "#64748b", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase" }}>Docs</th>
                                        <th style={{ textAlign: "left", padding: "0.6rem 0.75rem", color: "#64748b", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase" }}>Missing</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.vehicles.map(v => (
                                        <tr key={v.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                            <td style={{ padding: "0.6rem 0.75rem" }}>
                                                <Link href={`/dashboard/vehicles/${v.id}`} style={{ color: "#1e293b", fontWeight: 500, textDecoration: "none" }}>
                                                    Unit {v.unitNumber}
                                                </Link>
                                                <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{v.yearMakeModel}</div>
                                            </td>
                                            <td style={{ padding: "0.6rem 0.75rem" }}>
                                                <span style={{ color: getDaysColor(v.inspectionDaysLeft), fontWeight: 600, fontSize: "0.78rem" }}>
                                                    {getDaysLabel(v.inspectionDaysLeft)}
                                                </span>
                                            </td>
                                            <td style={{ padding: "0.6rem 0.75rem" }}>
                                                <span style={{ color: getDaysColor(v.pmDaysLeft), fontWeight: 600, fontSize: "0.78rem" }}>
                                                    {getDaysLabel(v.pmDaysLeft)}
                                                </span>
                                            </td>
                                            <td style={{ padding: "0.6rem 0.75rem", color: "#475569" }}>{v.documentCount}</td>
                                            <td style={{ padding: "0.6rem 0.75rem" }}>
                                                {v.missingDocs.length > 0 ? (
                                                    <span style={{ color: "#d97706", fontSize: "0.78rem" }}>
                                                        {v.missingDocs.join(", ")}
                                                    </span>
                                                ) : (
                                                    <span style={{ color: "#16a34a", fontSize: "0.78rem" }}>Complete</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ padding: "1.5rem", textAlign: "center", color: "#64748b", fontSize: "0.85rem" }}>
                            No active vehicles. <Link href="/dashboard/vehicles/new" style={{ color: "#3b82f6" }}>Add your first vehicle</Link>
                        </div>
                    )}
                </ReportCard>

                {/* Document Inventory */}
                <ReportCard
                    title="Document Inventory"
                    description={`${reportData.documentCounts.total} documents on file — ${reportData.documentCounts.expiringSoon} expiring, ${reportData.documentCounts.expired} expired`}
                    icon={FileText}
                    expanded={expandedReport === "documents"}
                    onToggle={() => toggle("documents")}
                    onDownload={() => {
                        let content = `DOCUMENT INVENTORY\n${reportData.companyName}\nGenerated: ${new Date().toLocaleDateString()}\n${"=".repeat(50)}\n\n`;
                        content += `Total Documents: ${reportData.documentCounts.total}\n`;
                        content += `  Driver Documents: ${reportData.documentCounts.driverDocs}\n`;
                        content += `  Vehicle Documents: ${reportData.documentCounts.vehicleDocs}\n`;
                        content += `  Company Documents: ${reportData.documentCounts.companyDocs}\n`;
                        content += `  Expiring Soon: ${reportData.documentCounts.expiringSoon}\n`;
                        content += `  Expired: ${reportData.documentCounts.expired}\n`;
                        downloadText(content, `document-inventory-${dateStamp}.txt`);
                    }}
                >
                    <div style={{ padding: "1rem" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                            {[
                                { label: "Driver Documents", count: reportData.documentCounts.driverDocs, icon: Users, color: "#3b82f6" },
                                { label: "Vehicle Documents", count: reportData.documentCounts.vehicleDocs, icon: Truck, color: "#059669" },
                                { label: "Company Documents", count: reportData.documentCounts.companyDocs, icon: FileText, color: "#7c3aed" },
                            ].map(item => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.label} style={{
                                        padding: "0.75rem", borderRadius: "8px",
                                        background: "#f8fafc", textAlign: "center",
                                    }}>
                                        <Icon size={16} style={{ color: item.color, marginBottom: "0.25rem" }} />
                                        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: item.color }}>{item.count}</div>
                                        <div style={{ fontSize: "0.7rem", color: "#64748b" }}>{item.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ marginTop: "0.75rem", textAlign: "center" }}>
                            <Link
                                href="/dashboard/documents"
                                style={{ fontSize: "0.82rem", color: "#3b82f6", textDecoration: "none", fontWeight: 500 }}
                            >
                                View all documents →
                            </Link>
                        </div>
                    </div>
                </ReportCard>
            </div>
        </div>
    );
}

function ReportCard({
    title,
    description,
    icon: Icon,
    expanded,
    onToggle,
    onDownload,
    children,
}: {
    title: string;
    description: string;
    icon: React.ElementType;
    expanded: boolean;
    onToggle: () => void;
    onDownload: () => void;
    children: React.ReactNode;
}) {
    return (
        <div style={{
            background: "white", borderRadius: "12px",
            border: "1px solid #e2e8f0", overflow: "hidden",
        }}>
            <div
                onClick={onToggle}
                style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "1rem 1.25rem", cursor: "pointer",
                }}
            >
                <div style={{
                    width: 40, height: 40, borderRadius: "10px",
                    background: "#eff6ff", display: "flex",
                    alignItems: "center", justifyContent: "center", color: "#3b82f6",
                    flexShrink: 0,
                }}>
                    <Icon size={20} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#0f172a" }}>{title}</div>
                    <div style={{ fontSize: "0.78rem", color: "#64748b" }}>{description}</div>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onDownload(); }}
                    style={{
                        display: "flex", alignItems: "center", gap: "0.35rem",
                        padding: "0.4rem 0.75rem", borderRadius: "6px",
                        border: "1px solid #e2e8f0", background: "white",
                        cursor: "pointer", fontSize: "0.78rem", fontWeight: 500,
                        color: "#475569", whiteSpace: "nowrap",
                    }}
                >
                    <Download size={14} /> Download
                </button>
                {expanded ? <ChevronUp size={18} style={{ color: "#94a3b8" }} /> : <ChevronDown size={18} style={{ color: "#94a3b8" }} />}
            </div>
            {expanded && (
                <div style={{ borderTop: "1px solid #e2e8f0" }}>
                    {children}
                </div>
            )}
        </div>
    );
}
