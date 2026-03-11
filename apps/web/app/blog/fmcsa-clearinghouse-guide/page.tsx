import BlogPostLayout from "../BlogPostLayout";
import styles from "../blog.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "FMCSA Clearinghouse Guide: Registration, Queries & Compliance", description: "Complete guide to the FMCSA Drug & Alcohol Clearinghouse for employers. Covers registration, full and limited queries, reporting requirements, and common mistakes.", alternates: { canonical: "/blog/fmcsa-clearinghouse-guide" }, openGraph: { title: "FMCSA Clearinghouse Guide: Registration, Queries & Compliance", description: "Complete guide to the FMCSA Drug & Alcohol Clearinghouse for employers. Covers registration, full and limited queries, reporting requirements, and common mistakes.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Driver Management" title="The FMCSA Clearinghouse: A Practical Guide for Employers" date="February 23, 2026" readTime="8 min read" relatedPosts={[{ slug: "driver-qualification-file-requirements", title: "Driver Qualification File Requirements" }, { slug: "drug-alcohol-testing-compliance", title: "Drug & Alcohol Testing Compliance" }]}>
            <p>The Clearinghouse has been mandatory since January 2020, and it <em>still</em> confuses carriers. Full queries, limited queries, annual queries, driver consent forms — it&apos;s a lot. Let&apos;s cut through the noise and give you exactly what you need to know.</p>

            <div className={styles.calloutAmber}>
                <h4>Who does this apply to?</h4>
                <p>The FMCSA Clearinghouse applies to motor carriers that employ <strong>CDL (Commercial Driver&apos;s License) drivers</strong>. If you have any drivers who hold a CDL and operate CMVs (commercial motor vehicles — vehicles over 26,001 lbs, 16+ passengers, or hazmat), you must register and use the Clearinghouse. Non-CDL drivers are not tracked in the Clearinghouse.</p>
            </div>

            <h2>What Is the Clearinghouse?</h2>
            <p>It&apos;s an FMCSA-run database that tracks <strong>drug and alcohol violations</strong> for CDL holders. Every positive test, every refusal, every return-to-duty — it all goes in the Clearinghouse. Before it existed, a driver could test positive with one carrier and get hired by the next one without anyone knowing.</p>
            <p>Those days are over.</p>

            <h2>Employer Registration</h2>
            <p>You must register at <strong>clearinghouse.fmcsa.dot.gov</strong> as an employer. Registration is free. You&apos;ll need your USDOT number and a company administrator email. Do this <em>before</em> you hire your first driver. An unregistered employer is a compliance violation.</p>

            <h2>Types of Queries</h2>
            <h3>Full Query</h3>
            <p>Required at <strong>pre-employment</strong> for every new CDL driver. Reveals all detailed drug &amp; alcohol violation records. Costs <strong>$1.25 per query</strong>. Requires <strong>electronic driver consent</strong> — the driver must log into the Clearinghouse and approve your query before you can see the results.</p>
            <p>This is where things slow down. Drivers who aren&apos;t tech-savvy struggle with the consent process. Build 2-3 days into your onboarding timeline for this step.</p>

            <h3>Limited Query</h3>
            <p>Required <strong>annually</strong> for all current CDL drivers. Tells you only whether a violation exists — yes or no. Costs <strong>$1.25 per query</strong>. If the result comes back positive, you must follow up with a full query (which requires driver consent).</p>
            <p>You need a <strong>general consent form</strong> signed by the driver to run limited queries. This is a one-time consent, not per-query. Get it signed during onboarding and keep it in the <strong>DQF (Driver Qualification File)</strong>.</p>

            <h2>Reporting Requirements</h2>
            <p>Employers and <strong>MROs (Medical Review Officers — licensed physicians who review lab results)</strong> must report to the Clearinghouse:</p>
            <ul>
                <li>Positive drug test results (reported by MRO)</li>
                <li>Alcohol test results of 0.04+ <strong>BAC (Blood Alcohol Concentration)</strong> (reported by employer)</li>
                <li>Refusals to test (reported by employer)</li>
                <li>Actual knowledge violations (reported by employer)</li>
                <li>Return-to-duty and follow-up test results (reported by <strong>SAP (Substance Abuse Professional)</strong>/employer)</li>
            </ul>

            <h2>Common Mistakes</h2>
            <ul>
                <li><strong>Not running annual limited queries</strong> — This replaced the old §391.23(e) previous employer inquiry as of January 2023. No excuses.</li>
                <li><strong>Forgetting driver consent for full queries</strong> — The driver must provide electronic consent. Paper consent doesn&apos;t count for full queries.</li>
                <li><strong>Not registering as an employer</strong> — We&apos;ve seen carriers 3+ years into operation who never registered. It&apos;s free. Do it today.</li>
                <li><strong>Hiring before the query clears</strong> — Never let a driver behind the wheel before the full query result comes back clean.</li>
            </ul>
        </BlogPostLayout>
    );
}
