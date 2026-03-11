import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";
import styles from "../blog.module.css";

export const metadata: Metadata = { title: "DOT Audit Document Checklist: Every Record You Need Ready", description: "Complete document checklist for DOT compliance reviews. Organized by regulatory area with retention periods and tips for quick retrieval.", alternates: { canonical: "/blog/dot-audit-document-checklist" }, openGraph: { title: "DOT Audit Document Checklist: Every Record You Need Ready", description: "Complete document checklist for DOT compliance reviews. Organized by regulatory area with retention periods and tips for quick retrieval.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Audit Prep" title="DOT Audit Document Checklist: The Files You Better Have Ready" date="February 11, 2026" readTime="7 min read" relatedPosts={[{ slug: "how-to-pass-dot-audit", title: "How to Pass a DOT Audit" }, { slug: "fmcsa-compliance-guide", title: "FMCSA Compliance Guide" }]}>
            <div className={styles.calloutAmber}>
                <h4>Who does this apply to?</h4>
                <p>This audit checklist applies to any motor carrier registered with a USDOT number — whether you operate one truck or fifty. If you&apos;re subject to FMCSA (Federal Motor Carrier Safety Administration) regulations, these are the records you need to have ready.</p>
            </div>

            <p>When the auditor walks in — or more likely, sends that email requesting documents — you don&apos;t want to be scrambling through filing cabinets. We&apos;ve built this checklist from hundreds of audits we&apos;ve seen carriers go through. Print it. Use it. Keep everything on this list within arm&apos;s reach.</p>

            <h2>Company-Level Documents</h2>
            <ul>
                <li>USDOT registration confirmation</li>
                <li>MC (Motor Carrier — your operating authority number) authority grant letter</li>
                <li>BOC-3 proof of filing (a legal document designating a process agent in every state where you operate)</li>
                <li>Current insurance certificate and BMC-91 (the insurance filing your insurer submits to the FMCSA proving you have liability coverage) confirmation</li>
                <li>UCR (Unified Carrier Registration — an annual registration required for interstate carriers) receipt (current year)</li>
                <li>MCS-150 filing confirmation (your biennial update form that keeps your USDOT information current)</li>
                <li>Accident register (past 3 years — <em>every</em> DOT recordable accident)</li>
                <li>Written drug &amp; alcohol policy with driver acknowledgments</li>
                <li>Reasonable suspicion training certificates for supervisors</li>
                <li>FMCSA Clearinghouse (the FMCSA&apos;s online database tracking CDL driver drug and alcohol violations) employer registration confirmation</li>
            </ul>

            <h2>Per-Driver Documents (DQF — Driver Qualification File)</h2>
            <p>A DQF is the collection of records you&apos;re required to maintain for every driver who operates a CMV (commercial motor vehicle — any vehicle over 10,001 lbs GVWR) on your behalf.</p>
            <ul>
                <li>Employment application with 10-year history</li>
                <li>CDL (Commercial Driver&apos;s License) copy (front and back, current) — required for drivers operating vehicles over 26,001 lbs GVWR, vehicles designed to transport 16+ passengers, or hazmat vehicles</li>
                <li>Medical examiner&apos;s certificate (current, not expired)</li>
                <li>Annual MVR (Motor Vehicle Record — a driving history report pulled from the state) for each year of employment</li>
                <li>Road test certificate or CDL equivalent documentation</li>
                <li>Previous employer inquiries (3 years, or Clearinghouse full query)</li>
                <li>Annual certificate of violations</li>
                <li>Pre-employment drug test result (required for CDL drivers only)</li>
                <li>Annual Clearinghouse limited query record (required for CDL drivers only)</li>
                <li>Random/post-accident/reasonable suspicion test results (if any — applies to CDL drivers operating CMVs)</li>
            </ul>

            <h2>HOS (Hours of Service) Records</h2>
            <p>HOS rules limit how long drivers can be on the road before they must rest. These are the records that prove your drivers are following those limits.</p>
            <ul>
                <li>ELD (Electronic Logging Device — the device in the truck that automatically records driving time) data for the past 6 months (must be exportable in standard format)</li>
                <li>Supporting documents: toll receipts, fuel receipts, delivery receipts (6 months)</li>
                <li>Evidence of daily log review by carrier</li>
                <li>Corrective action documentation for any HOS violations found</li>
            </ul>

            <h2>Vehicle Records</h2>
            <ul>
                <li>Annual DOT inspection reports (current, plus 14 months of history)</li>
                <li>DVIRs (Driver Vehicle Inspection Reports — the written report a driver completes after each trip noting any vehicle defects) (past 3 months)</li>
                <li>Preventive maintenance schedule per vehicle</li>
                <li>Maintenance and repair records (1 year while active, 6 months after disposal)</li>
                <li>Vehicle registration for each unit</li>
            </ul>

            <h2>Drug &amp; Alcohol Program Records</h2>
            <p>These records apply specifically to CDL (Commercial Driver&apos;s License) drivers who operate CMVs over 26,001 lbs GVWR, transport 16+ passengers, or haul hazmat. Non-CDL drivers operating lighter CMVs (10,001-26,000 lbs) are not subject to FMCSA drug and alcohol testing requirements.</p>
            <ul>
                <li>Random selection records with dates (2 years)</li>
                <li>All drug test results: negatives (1 year), positives (5 years)</li>
                <li>MRO (Medical Review Officer — the licensed physician who reviews and verifies drug test results) name and contact information</li>
                <li>Collection site information</li>
                <li>Consortium/TPA (Third Party Administrator — a service that manages your testing program) agreement (if using one)</li>
            </ul>

            <h2>Organization Tips</h2>
            <p>Keep everything in a logical structure — either physical or digital. We recommend digital with backups. Name files consistently: <code>DriverLastName_DocumentType_Date</code>. If an auditor asks for John Smith&apos;s 2025 MVR, you should be able to produce it in under 60 seconds. That kind of organization makes a strong first impression on an auditor.</p>
        </BlogPostLayout>
    );
}
