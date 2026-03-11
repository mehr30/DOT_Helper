import BlogPostLayout from "../BlogPostLayout";
import styles from "../blog.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Drug & Alcohol Testing Record Retention: What to Keep and How Long", description: "DOT drug and alcohol testing record retention requirements. Organized by document type with retention periods and storage best practices.", alternates: { canonical: "/blog/drug-testing-record-retention" }, openGraph: { title: "Drug & Alcohol Testing Record Retention: What to Keep & How Long", description: "DOT drug and alcohol testing record retention requirements. Organized by document type with retention periods and storage best practices.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Drug & Alcohol Testing" title="Drug & Alcohol Record Retention: A Cheat Sheet" date="February 5, 2026" readTime="4 min read" relatedPosts={[{ slug: "drug-alcohol-testing-compliance", title: "Drug & Alcohol Testing Guide" }, { slug: "dot-audit-document-checklist", title: "DOT Audit Document Checklist" }]}>
            <p>Drug and alcohol testing generates a lot of paperwork. Or digital files, if you&apos;re doing it right. And different records have different retention periods. Throw out too early and you&apos;re non-compliant during an audit. Keep everything forever and you&apos;re drowning in files.</p>
            <p>Here&apos;s the breakdown under <strong>§382.401</strong> (the FMCSA regulation that specifies how long you must keep drug &amp; alcohol testing records).</p>

            <div className={styles.calloutAmber}>
                <h4>Who does this apply to?</h4>
                <p>These record retention requirements apply to drug &amp; alcohol testing records for <strong>CDL (Commercial Driver&apos;s License) drivers</strong> subject to DOT testing. If you run a testing program for CDL drivers, these are the minimum retention periods you must follow.</p>
            </div>

            <h2>5-Year Retention</h2>
            <ul>
                <li>Positive drug test results (verified by <strong>MRO — Medical Review Officer</strong>, the licensed physician who reviews lab results)</li>
                <li>Alcohol test results of 0.02 BAC or greater</li>
                <li>Refusals to test</li>
                <li><strong>SAP (Substance Abuse Professional)</strong> evaluations and follow-up testing records</li>
                <li>Annual compliance summaries (if you prepare them)</li>
            </ul>

            <h2>3-Year Retention</h2>
            <ul>
                <li>Previous employer drug and alcohol inquiries (§40.25 records)</li>
                <li>Clearinghouse query records</li>
            </ul>

            <h2>2-Year Retention</h2>
            <ul>
                <li>Random selection lists and documentation</li>
                <li>Reasonable suspicion determination documentation</li>
                <li>Post-accident decision documentation (why you did or didn&apos;t test)</li>
                <li>Calibration documentation for <strong>EBT (Evidential Breath Testing device — used for DOT alcohol tests)</strong></li>
            </ul>

            <h2>1-Year Retention</h2>
            <ul>
                <li>Negative drug test results (verified by MRO)</li>
                <li>Alcohol test results below 0.02 BAC</li>
                <li>Canceled test results</li>
            </ul>

            <h2>Indefinite Retention</h2>
            <ul>
                <li>Written drug &amp; alcohol policy</li>
                <li>Driver acknowledgment forms (keep as long as the driver is employed, at minimum)</li>
                <li>Supervisor reasonable suspicion training certificates</li>
            </ul>

            <h2>Storage Tips</h2>
            <p>Keep drug/alcohol records <strong>separate from general personnel files</strong>. Access should be limited to the <strong>DER (Designated Employer Representative — the person at your company responsible for receiving test results)</strong> and individuals with a legitimate need to know. These records contain sensitive medical information.</p>
            <p>Digital storage is fine — and recommended. Backed-up, encrypted, access-controlled digital files beat a locked filing cabinet in every practical way. Just make sure you can produce records quickly if an auditor requests them.</p>
        </BlogPostLayout>
    );
}
