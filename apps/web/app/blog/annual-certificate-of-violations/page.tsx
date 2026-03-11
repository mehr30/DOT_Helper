import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";
import styles from "../blog.module.css";

export const metadata: Metadata = { title: "Annual Certificate of Violations: The Easy Filing Most Carriers Miss", description: "How to manage the annual certificate of violations for CDL drivers. What it is, when it's due, what to review, and how to stay compliant.", alternates: { canonical: "/blog/annual-certificate-of-violations" }, openGraph: { title: "Annual Certificate of Violations: The Easy Filing Most Carriers Miss", description: "How to manage the annual certificate of violations for CDL drivers. What it is, when it's due, what to review, and how to stay compliant.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Driver Management" title="The Annual Certificate of Violations: Quick, Easy, and Almost Always Missing" date="February 2, 2026" readTime="4 min read" relatedPosts={[{ slug: "driver-qualification-file-requirements", title: "Driver Qualification File Requirements" }, { slug: "mvr-guide-for-carriers", title: "MVR Guide for Carriers" }]}>
            <div className={styles.calloutAmber}>
                <h4>Who does this apply to?</h4>
                <p>The annual certificate of violations applies to every driver operating a <strong>CMV (commercial motor vehicle &mdash; any vehicle over 10,001 lbs GVWR used for business)</strong>. This includes both CDL and non-CDL CMV drivers.</p>
            </div>

            <p>For how simple this requirement is, it&apos;s staggering how often it&apos;s missing from <strong>DQFs (Driver Qualification Files &mdash; the folder of documents you keep for each driver)</strong>. The annual certificate of violations takes about 3 minutes to complete. Missing it? That&apos;s a compliance violation that shows up in audits constantly.</p>

            <h2>What Is It?</h2>
            <p>Under federal driver qualification rules (specifically the regulation requiring drivers to report violations annually), every driver must provide a written list of all traffic violations they were convicted of (or forfeited bond for) in the preceding 12 months. If they had no violations, they certify that fact. Either way, it goes on paper and into the DQF.</p>

            <h2>When Is It Due?</h2>
            <p>Annually. The regulation doesn&apos;t specify a universal date &mdash; most carriers use either the driver&apos;s hire anniversary or align it with their annual <strong>MVR (Motor Vehicle Record)</strong> pull to knock both out at once. The latter approach is smart because you can cross-reference the driver&apos;s self-reported violations against the MVR immediately.</p>

            <h2>The Form</h2>
            <p><strong>FMCSA (Federal Motor Carrier Safety Administration)</strong> doesn&apos;t mandate a specific form. Just a written statement that includes:</p>
            <ul>
                <li>Driver&apos;s name and signature</li>
                <li>Date</li>
                <li>List of all violations OR a certification of no violations</li>
                <li>For each violation: date, location, type of violation, type of vehicle driven</li>
            </ul>
            <p>Some carriers use a simple one-page template. Others use their compliance software to generate and track it. Either works.</p>

            <h2>What You Do With It</h2>
            <p>Review the certificate alongside the annual MVR. If the driver reported no violations but the MVR shows two speeding tickets &mdash; that&apos;s a problem you need to address. If everything matches, file both in the DQF with a signed reviewer acknowledgment and date.</p>
            <p>Simple? Yes. Important? Absolutely. Set a recurring task and stop letting this one slip through the cracks.</p>
        </BlogPostLayout>
    );
}
