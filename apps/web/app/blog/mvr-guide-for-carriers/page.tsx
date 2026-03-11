import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";
import styles from "../blog.module.css";

export const metadata: Metadata = { title: "Motor Vehicle Records (MVR): What Carriers Need to Know", description: "Guide to MVR requirements for motor carriers — when to pull them, what to look for, how to handle bad records, and annual review obligations.", alternates: { canonical: "/blog/mvr-guide-for-carriers" }, openGraph: { title: "Motor Vehicle Records (MVR): What Carriers Need to Know", description: "Guide to MVR requirements for motor carriers — when to pull them, what to look for, how to handle bad records, and annual review obligations.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Driver Management" title="MVRs: How to Pull Them, Read Them, and Act on Them" date="February 10, 2026" readTime="6 min read" relatedPosts={[{ slug: "driver-qualification-file-requirements", title: "Driver Qualification File Requirements" }, { slug: "cdl-requirements-guide", title: "CDL Requirements" }]}>
            <div className={styles.calloutAmber}>
                <h4>Who does this apply to?</h4>
                <p><strong>MVR (Motor Vehicle Record)</strong> requirements apply to all motor carriers employing drivers of <strong>CMVs (commercial motor vehicles &mdash; any vehicle over 10,001 lbs GVWR)</strong>. You must pull MVRs for both <strong>CDL (Commercial Driver&apos;s License)</strong> and non-CDL CMV drivers.</p>
            </div>

            <p>The Motor Vehicle Record is your window into a driver&apos;s history. Speeding tickets. Suspensions. DUIs. It&apos;s all there. And if you&apos;re not pulling MVRs correctly &mdash; or not pulling them at all &mdash; you&apos;re flying blind on driver risk and violating <strong>Part 391 (the FMCSA regulation covering driver qualification &mdash; it sets the rules for who can drive a CMV and what documentation you need)</strong>.</p>

            <h2>When to Pull an MVR</h2>
            <p><strong>At hire:</strong> Pull an MVR from every state where the driver held a license in the past 3 years. If they lived in Texas and Oklahoma in the past 3 years, that&apos;s two MVRs you need.</p>
            <p><strong>Annually:</strong> Pull a fresh MVR from the driver&apos;s current state of licensure every 12 months. Compare it against the Annual Certificate of Violations the driver provides.</p>

            <h2>How to Pull MVRs</h2>
            <p>Each state has its own process and fee. Most states offer online ordering through their DMV website. Costs range from <strong>$2-$12 per record</strong>. Some states have bulk pricing for carriers.</p>
            <p>Alternatively, use a third-party MVR provider. They&apos;ll pull from all states through one interface. Slightly more expensive ($5-$15 per record) but saves you from dealing with 50 different state systems.</p>

            <h2>What to Look For</h2>
            <ul>
                <li><strong>Moving violations</strong> &mdash; especially speeding, reckless driving, lane violations</li>
                <li><strong>License suspension or revocation</strong> &mdash; immediate disqualification situation</li>
                <li><strong>DUI/DWI</strong> &mdash; CDL disqualifying offense</li>
                <li><strong>At-fault accidents</strong> &mdash; may affect your hiring decision and insurance</li>
                <li><strong>CDL status</strong> &mdash; verify it&apos;s active and matches what the driver told you</li>
                <li><strong>Medical certificate status</strong> &mdash; some states show whether the driver&apos;s med card is on file with the state</li>
            </ul>

            <h2>Annual Review Process</h2>
            <p>When the annual MVR comes in, you must review it within a reasonable time and take action on any disqualifying violations. Compare it to the driver&apos;s Annual Certificate of Violations. If the driver said &quot;no violations&quot; but the MVR shows three speeding tickets &mdash; that&apos;s a conversation you need to have.</p>
            <p>Document your review with a date and signature from the person who reviewed it. This goes in the <strong>DQF (Driver Qualification File &mdash; the folder of documents you keep for each driver)</strong> alongside the MVR.</p>

            <h2>What If the Record Is Bad?</h2>
            <p>A single speeding ticket doesn&apos;t mean you fire someone. But patterns matter. Multiple violations, reckless driving, or any CDL-disqualifying offense requires action. Your decision should be documented &mdash; whether it&apos;s counseling, retraining, or termination.</p>
            <p>Whatever you decide, write it down. &quot;We reviewed the MVR and took no action&quot; is better documentation than no documentation at all.</p>
        </BlogPostLayout>
    );
}
