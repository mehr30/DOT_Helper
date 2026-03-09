/**
 * Shared PDF generation utilities for Greenlight USDOT.
 * Uses jsPDF + jspdf-autotable for professional compliance reports.
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type RGB = [number, number, number];
const BRAND_GREEN: RGB = [22, 92, 48]; // #165C30
const BRAND_DARK: RGB = [15, 46, 26];  // #0F2E1A
const GRAY_600: RGB = [75, 85, 99];
const GRAY_400: RGB = [156, 163, 175];
const RED: RGB = [220, 38, 38];
const AMBER: RGB = [217, 119, 6];
const GREEN: RGB = [22, 163, 74];

function timestamp(): string {
    return new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function dateStamp(): string {
    return new Date().toISOString().split("T")[0] ?? "";
}

/** Add the standard Greenlight USDOT header to a PDF page */
function addHeader(doc: jsPDF, title: string, subtitle?: string) {
    // Green header bar
    doc.setFillColor(...BRAND_GREEN);
    doc.rect(0, 0, 220, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Greenlight USDOT", 14, 12);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(title, 14, 20);

    // Timestamp in header
    doc.setFontSize(7);
    doc.text(`Generated: ${timestamp()}`, 196, 12, { align: "right" });
    doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, 196, 17, { align: "right" });

    // Subtitle below header
    if (subtitle) {
        doc.setTextColor(...GRAY_600);
        doc.setFontSize(9);
        doc.text(subtitle, 14, 36);
    }
}

/** Add page footer */
function addFooter(doc: jsPDF) {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(...GRAY_400);
        doc.text(
            `Greenlight USDOT — Confidential — Generated ${timestamp()} — Page ${i} of ${pageCount}`,
            105,
            287,
            { align: "center" },
        );
    }
}

/** Download the PDF */
function save(doc: jsPDF, filename: string) {
    addFooter(doc);
    doc.save(filename);
}

// ─── Report: Compliance Summary ──────────────────────────────────────────────

export interface CompliancePdfData {
    overall: number;
    categories: Array<{
        name: string;
        score: number;
        items: Array<{
            label: string;
            regulation: string;
            status: string;
            detail?: string;
        }>;
    }>;
    summary: { totalItems: number; compliant: number; actionNeeded: number; expired: number };
}

export function downloadComplianceReport(data: CompliancePdfData) {
    const doc = new jsPDF();
    addHeader(doc, "DOT Compliance Report");

    let y = 34;

    // Overall score
    const scoreColor = data.overall >= 90 ? GREEN : data.overall >= 70 ? AMBER : RED;
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...scoreColor);
    doc.text(`${data.overall}%`, 14, y + 12);
    doc.setFontSize(10);
    doc.setTextColor(...GRAY_600);
    doc.text("Overall Compliance Score", 42, y + 8);
    doc.setFontSize(8);
    doc.text(
        `${data.summary.compliant} compliant  |  ${data.summary.actionNeeded} need attention  |  ${data.summary.expired} expired`,
        42,
        y + 14,
    );

    y += 24;

    // Category breakdown
    for (const cat of data.categories) {
        // Check if we need a new page
        if (y > 250) {
            doc.addPage();
            addHeader(doc, "DOT Compliance Report (continued)");
            y = 36;
        }

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...BRAND_DARK);
        doc.text(`${cat.name} — ${cat.score}%`, 14, y + 6);
        y += 8;

        const rows = cat.items.map((item) => {
            const statusLabel =
                item.status === "compliant"
                    ? "Compliant"
                    : item.status === "expired"
                      ? "EXPIRED"
                      : "Needs Attention";
            return [item.label, item.detail ?? "", statusLabel, item.regulation];
        });

        autoTable(doc, {
            startY: y,
            head: [["Item", "Detail", "Status", "Regulation"]],
            body: rows,
            margin: { left: 14, right: 14 },
            styles: { fontSize: 7.5, cellPadding: 2 },
            headStyles: {
                fillColor: [...BRAND_GREEN],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                fontSize: 7,
            },
            columnStyles: {
                0: { cellWidth: 60 },
                1: { cellWidth: 50 },
                2: { cellWidth: 28 },
                3: { cellWidth: 32, textColor: [...GRAY_400], fontSize: 6.5 },
            },
            didParseCell(data) {
                if (data.column.index === 2 && data.section === "body") {
                    const val = String(data.cell.raw);
                    if (val === "EXPIRED") data.cell.styles.textColor = [...RED];
                    else if (val === "Needs Attention") data.cell.styles.textColor = [...AMBER];
                    else data.cell.styles.textColor = [...GREEN];
                    data.cell.styles.fontStyle = "bold";
                }
            },
        });

        y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;
    }

    save(doc, `compliance-report-${dateStamp()}.pdf`);
}

// ─── Report: Driver Records ──────────────────────────────────────────────────

export interface DriverReportData {
    companyName: string;
    drivers: Array<{
        name: string;
        status: string;
        cdlNumber?: string | null;
        cdlState?: string | null;
        cdlExpiration?: string | null;
        cdlDaysLeft: number | null;
        medicalExpiration?: string | null;
        medicalDaysLeft: number | null;
        hireDate: string;
        documentCount: number;
        missingDocs: string[];
    }>;
    complianceScore: number;
}

export function downloadDriverReport(data: DriverReportData) {
    const doc = new jsPDF();
    addHeader(doc, "Driver Records Report", `${data.companyName} — ${data.drivers.length} active driver${data.drivers.length !== 1 ? "s" : ""} — Compliance: ${data.complianceScore}%`);

    const rows = data.drivers.map((d) => {
        const fmtDate = (iso: string | null | undefined) =>
            iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Not set";
        const daysLabel = (days: number | null) => {
            if (days === null) return "Not set";
            if (days <= 0) return `${Math.abs(days)}d overdue`;
            return `${days}d left`;
        };
        return [
            d.name,
            d.cdlNumber ? `${d.cdlState ?? ""} ${d.cdlNumber}` : "—",
            daysLabel(d.cdlDaysLeft),
            daysLabel(d.medicalDaysLeft),
            String(d.documentCount),
            d.missingDocs.length > 0 ? d.missingDocs.join(", ") : "Complete",
        ];
    });

    autoTable(doc, {
        startY: 42,
        head: [["Driver", "License #", "License", "DOT Physical", "Docs", "Missing"]],
        body: rows,
        margin: { left: 14, right: 14 },
        styles: { fontSize: 7.5, cellPadding: 2.5 },
        headStyles: { fillColor: [...BRAND_GREEN], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7 },
        columnStyles: {
            0: { cellWidth: 36, fontStyle: "bold" },
            5: { cellWidth: 42 },
        },
        didParseCell(data) {
            if ((data.column.index === 2 || data.column.index === 3) && data.section === "body") {
                const val = String(data.cell.raw);
                if (val.includes("overdue")) data.cell.styles.textColor = [...RED];
                else if (val.includes("Not set")) data.cell.styles.textColor = [...GRAY_400];
                else data.cell.styles.textColor = [...GREEN];
                data.cell.styles.fontStyle = "bold";
            }
            if (data.column.index === 5 && data.section === "body") {
                const val = String(data.cell.raw);
                if (val !== "Complete") data.cell.styles.textColor = [...AMBER];
                else data.cell.styles.textColor = [...GREEN];
            }
        },
    });

    save(doc, `driver-records-report-${dateStamp()}.pdf`);
}

// ─── Report: Vehicle Maintenance ─────────────────────────────────────────────

export interface VehicleReportData {
    companyName: string;
    vehicles: Array<{
        unitNumber: string;
        yearMakeModel: string;
        vin: string | null;
        status: string;
        inspectionDue: string | null;
        inspectionDaysLeft: number | null;
        nextPmDue: string | null;
        pmDaysLeft: number | null;
        documentCount: number;
        missingDocs: string[];
    }>;
    complianceScore: number;
}

export function downloadVehicleReport(data: VehicleReportData) {
    const doc = new jsPDF();
    addHeader(doc, "Vehicle Maintenance Report", `${data.companyName} — ${data.vehicles.length} vehicle${data.vehicles.length !== 1 ? "s" : ""} — Compliance: ${data.complianceScore}%`);

    const daysLabel = (days: number | null) => {
        if (days === null) return "Not set";
        if (days <= 0) return `${Math.abs(days)}d overdue`;
        return `${days}d left`;
    };

    const rows = data.vehicles.map((v) => [
        `Unit ${v.unitNumber}`,
        v.yearMakeModel,
        daysLabel(v.inspectionDaysLeft),
        daysLabel(v.pmDaysLeft),
        String(v.documentCount),
        v.missingDocs.length > 0 ? v.missingDocs.join(", ") : "Complete",
    ]);

    autoTable(doc, {
        startY: 42,
        head: [["Vehicle", "Year/Make/Model", "Inspection", "Next PM", "Docs", "Missing"]],
        body: rows,
        margin: { left: 14, right: 14 },
        styles: { fontSize: 7.5, cellPadding: 2.5 },
        headStyles: { fillColor: [...BRAND_GREEN], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 7 },
        columnStyles: {
            0: { cellWidth: 22, fontStyle: "bold" },
            1: { cellWidth: 38 },
            5: { cellWidth: 38 },
        },
        didParseCell(data) {
            if ((data.column.index === 2 || data.column.index === 3) && data.section === "body") {
                const val = String(data.cell.raw);
                if (val.includes("overdue")) data.cell.styles.textColor = [...RED];
                else if (val.includes("Not set")) data.cell.styles.textColor = [...GRAY_400];
                else data.cell.styles.textColor = [...GREEN];
                data.cell.styles.fontStyle = "bold";
            }
            if (data.column.index === 5 && data.section === "body") {
                const val = String(data.cell.raw);
                if (val !== "Complete") data.cell.styles.textColor = [...AMBER];
                else data.cell.styles.textColor = [...GREEN];
            }
        },
    });

    save(doc, `vehicle-maintenance-report-${dateStamp()}.pdf`);
}

// ─── Report: Document Inventory ──────────────────────────────────────────────

export interface DocInventoryData {
    companyName: string;
    total: number;
    driverDocs: number;
    vehicleDocs: number;
    companyDocs: number;
    expiringSoon: number;
    expired: number;
}

export function downloadDocInventory(data: DocInventoryData) {
    const doc = new jsPDF();
    addHeader(doc, "Document Inventory", data.companyName);

    const rows = [
        ["Total Documents", String(data.total)],
        ["Driver Documents", String(data.driverDocs)],
        ["Vehicle Documents", String(data.vehicleDocs)],
        ["Company Documents", String(data.companyDocs)],
        ["Expiring Soon", String(data.expiringSoon)],
        ["Expired", String(data.expired)],
    ];

    autoTable(doc, {
        startY: 42,
        head: [["Category", "Count"]],
        body: rows,
        margin: { left: 14, right: 14 },
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [...BRAND_GREEN], textColor: [255, 255, 255], fontStyle: "bold" },
        columnStyles: {
            0: { cellWidth: 100, fontStyle: "bold" },
            1: { halign: "center", cellWidth: 40 },
        },
        didParseCell(cellData) {
            if (cellData.column.index === 0 && cellData.section === "body") {
                const val = String(cellData.cell.raw);
                if (val === "Expired") cellData.cell.styles.textColor = [...RED];
                else if (val === "Expiring Soon") cellData.cell.styles.textColor = [...AMBER];
            }
        },
    });

    save(doc, `document-inventory-${dateStamp()}.pdf`);
}

// ─── Report: Compliance Forms Packet ─────────────────────────────────────────

export interface SavedFormData {
    title: string;
    shortTitle: string;
    cfrReference: string;
    status: string;
    completedFields: number;
    totalFields: number;
    savedAt: string;
    category: string;
    data: Record<string, unknown>;
}

export function downloadCompliancePacket(forms: SavedFormData[]) {
    const doc = new jsPDF();
    addHeader(doc, "DOT Compliance Forms Packet", `${forms.length} form${forms.length !== 1 ? "s" : ""}`);

    let y = 42;

    for (let fi = 0; fi < forms.length; fi++) {
        const form = forms[fi]!;

        if (y > 240) {
            doc.addPage();
            addHeader(doc, "DOT Compliance Forms Packet (continued)");
            y = 36;
        }

        // Form header
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...BRAND_DARK);
        doc.text(form.title, 14, y);
        y += 4;

        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...GRAY_400);
        doc.text(
            `${form.cfrReference}  |  ${form.status === "completed" ? "Completed" : "Draft"}  |  ${form.completedFields}/${form.totalFields} fields  |  Saved ${new Date(form.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`,
            14,
            y,
        );
        y += 5;

        // Form fields
        const fields: string[][] = [];
        const signatures: Array<{ label: string; dataUrl: string; timestamp: string }> = [];

        const signDate = (form.data.signDate as string) || (form.data.certDate as string) || "";
        const sigTimestamp = signDate
            ? new Date(signDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
            : new Date(form.savedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

        Object.entries(form.data).forEach(([key, val]) => {
            if (!val) return;
            const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
            if (typeof val === "string" && val.startsWith("data:image")) {
                signatures.push({ label, dataUrl: val, timestamp: sigTimestamp });
            } else {
                fields.push([label, val === true ? "Yes" : String(val)]);
            }
        });

        if (fields.length > 0) {
            autoTable(doc, {
                startY: y,
                body: fields,
                margin: { left: 14, right: 14 },
                styles: { fontSize: 7.5, cellPadding: 2 },
                columnStyles: {
                    0: { cellWidth: 55, fontStyle: "bold", textColor: [...GRAY_600] },
                },
                theme: "plain",
                didDrawCell(data) {
                    if (data.section === "body") {
                        // Bottom border
                        doc.setDrawColor(230, 230, 230);
                        doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
                    }
                },
            });
            y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 3;
        }

        // Signatures with timestamps
        for (const sig of signatures) {
            if (y > 255) {
                doc.addPage();
                addHeader(doc, "DOT Compliance Forms Packet (continued)");
                y = 36;
            }

            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...GRAY_600);
            doc.text(`${sig.label}:`, 14, y);
            y += 2;

            try {
                doc.addImage(sig.dataUrl, "PNG", 14, y, 50, 15);
                y += 17;
            } catch {
                doc.setFontSize(7);
                doc.setTextColor(...GRAY_400);
                doc.text("[Signature on file]", 14, y + 4);
                y += 8;
            }

            // Signature line
            doc.setDrawColor(100, 100, 100);
            doc.line(14, y, 80, y);
            y += 3;

            doc.setFontSize(6.5);
            doc.setTextColor(...GRAY_400);
            doc.text(`Signed: ${sig.timestamp}`, 14, y);
            y += 6;
        }

        // Separator between forms
        if (fi < forms.length - 1) {
            y += 3;
            doc.setDrawColor(200, 200, 200);
            doc.setLineDashPattern([2, 2], 0);
            doc.line(14, y, 196, y);
            doc.setLineDashPattern([], 0);
            y += 6;
        }
    }

    save(doc, `dot-compliance-forms-${dateStamp()}.pdf`);
}

// ─── Single Form Print as PDF ────────────────────────────────────────────────

export function downloadFormPdf(form: SavedFormData) {
    downloadCompliancePacket([form]);
}
