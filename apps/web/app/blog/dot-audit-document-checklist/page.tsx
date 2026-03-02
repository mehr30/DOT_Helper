import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "DOT Audit Document Checklist: Every Record You Need Ready", description: "Complete document checklist for DOT compliance reviews. Organized by regulatory area with retention periods and tips for quick retrieval.", alternates: { canonical: "/blog/dot-audit-document-checklist" } };

export default function Page() {
    return (
        <BlogPostLayout category="Audit Prep" title="DOT Audit Document Checklist: The Files You Better Have Ready" date="February 11, 2026" readTime="7 min read" relatedPosts={[{ slug: "how-to-pass-dot-audit", title: "How to Pass a DOT Audit" }, { slug: "fmcsa-compliance-guide", title: "FMCSA Compliance Guide" }]}>
            <p>When the auditor walks in — or more likely, sends that email requesting documents — you don&apos;t want to be scrambling through filing cabinets. We&apos;ve built this checklist from hundreds of audits we&apos;ve seen carriers go through. Print it. Use it. Keep everything on this list within arm&apos;s reach.</p>

            <h2>Company-Level Documents</h2>
            <ul>
                <li>USDOT registration confirmation</li>
                <li>MC authority grant letter</li>
                <li>BOC-3 proof of filing</li>
                <li>Current insurance certificate and BMC-91 confirmation</li>
                <li>UCR receipt (current year)</li>
                <li>MCS-150 filing confirmation</li>
                <li>Accident register (past 3 years — <em>every</em> DOT recordable accident)</li>
                <li>Written drug &amp; alcohol policy with driver acknowledgments</li>
                <li>Reasonable suspicion training certificates for supervisors</li>
                <li>FMCSA Clearinghouse employer registration confirmation</li>
            </ul>

            <h2>Per-Driver Documents (DQF)</h2>
            <ul>
                <li>Employment application with 10-year history</li>
                <li>CDL copy (front and back, current)</li>
                <li>Medical examiner&apos;s certificate (current, not expired)</li>
                <li>Annual MVR for each year of employment</li>
                <li>Road test certificate or CDL equivalent documentation</li>
                <li>Previous employer inquiries (3 years, or Clearinghouse full query)</li>
                <li>Annual certificate of violations</li>
                <li>Pre-employment drug test result</li>
                <li>Annual Clearinghouse limited query record</li>
                <li>Random/post-accident/reasonable suspicion test results (if any)</li>
            </ul>

            <h2>HOS Records</h2>
            <ul>
                <li>ELD data for the past 6 months (must be exportable in standard format)</li>
                <li>Supporting documents: toll receipts, fuel receipts, delivery receipts (6 months)</li>
                <li>Evidence of daily log review by carrier</li>
                <li>Corrective action documentation for any HOS violations found</li>
            </ul>

            <h2>Vehicle Records</h2>
            <ul>
                <li>Annual DOT inspection reports (current, plus 14 months of history)</li>
                <li>DVIRs (past 3 months)</li>
                <li>Preventive maintenance schedule per vehicle</li>
                <li>Maintenance and repair records (1 year while active, 6 months after disposal)</li>
                <li>Vehicle registration for each unit</li>
            </ul>

            <h2>Drug &amp; Alcohol Program Records</h2>
            <ul>
                <li>Random selection records with dates (2 years)</li>
                <li>All drug test results: negatives (1 year), positives (5 years)</li>
                <li>MRO name and contact information</li>
                <li>Collection site information</li>
                <li>Consortium/TPA agreement (if using one)</li>
            </ul>

            <h2>Organization Tips</h2>
            <p>Keep everything in a logical structure — either physical or digital. We recommend digital with backups. Name files consistently: <code>DriverLastName_DocumentType_Date</code>. If an auditor asks for John Smith&apos;s 2025 MVR, you should be able to produce it in under 60 seconds. That kind of organization makes a strong first impression on an auditor.</p>
        </BlogPostLayout>
    );
}
