import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";
import styles from "../blog.module.css";

export const metadata: Metadata = { title: "DOT Insurance Requirements: Minimums, Filing & Common Pitfalls", description: "Guide to DOT/FMCSA insurance requirements for motor carriers. Covers minimum coverage amounts, BMC-91 filing, what happens when insurance lapses, and how to save.", alternates: { canonical: "/blog/dot-insurance-requirements" }, openGraph: { title: "DOT Insurance Requirements: Minimums, Filing & Common Pitfalls", description: "Guide to DOT/FMCSA insurance requirements for motor carriers. Covers minimum coverage amounts, BMC-91 filing, what happens when insurance lapses, and how to save.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Regulations" title="DOT Insurance Requirements: What You Need, What It Costs, and What Happens When It Lapses" date="February 17, 2026" readTime="7 min read" relatedPosts={[{ slug: "fmcsa-compliance-guide", title: "FMCSA Compliance Guide" }, { slug: "fmcsa-operating-authority-guide", title: "FMCSA Operating Authority Guide" }]}>
            <div className={styles.calloutAmber}>
                <h4>Who does this apply to?</h4>
                <p>DOT insurance requirements apply to any motor carrier with operating authority (<strong>MC number — Motor Carrier number, your operating authority</strong>) that transports goods or passengers in interstate commerce. Minimum coverage levels depend on what you haul.</p>
            </div>

            <p>Insurance is the single biggest operating expense for most small carriers. And FMCSA doesn&apos;t just require you to <em>have</em> insurance — they require specific minimums, a specific filing method, and continuous coverage. Let your policy lapse for even a day? Your authority starts the revocation clock.</p>

            <h2>Minimum Coverage Requirements (<strong>Part 387 — the FMCSA regulation that sets minimum insurance requirements</strong>)</h2>
            <ul>
                <li><strong>General freight (non-hazmat):</strong> $750,000 public liability</li>
                <li><strong>Oil transport (hazmat):</strong> $1,000,000 public liability</li>
                <li><strong>Other hazardous materials:</strong> $5,000,000 public liability</li>
                <li><strong>Passenger carriers (16+ seats):</strong> $5,000,000 public liability</li>
                <li><strong>Freight brokers:</strong> $75,000 surety bond or trust fund (BMC-84/85)</li>
            </ul>
            <p>These are <em>minimums</em>. Most carriers carry $1M or more even for general freight because shippers require it. Good luck getting freight from a major shipper with only $750K coverage.</p>

            <h2>The <strong>BMC-91 (the insurance filing form your insurer submits to the FMCSA to prove you have liability coverage)</strong> Filing</h2>
            <p>Your insurance company must file a Form BMC-91 electronically with FMCSA. This is how the government knows you have active coverage. You can check your filing status at <em>safer.fmcsa.dot.gov</em>.</p>
            <p>Some insurance agencies are slow to file. After binding your policy, call FMCSA or check SAFER within 48 hours to confirm the filing shows up. Don&apos;t assume it&apos;s done — verify it.</p>

            <h2>What Happens When Insurance Lapses</h2>
            <p>Here&apos;s the sequence:</p>
            <ol>
                <li>Your insurer files a <strong>BMC-35 (a similar filing used by some carriers as a surety bond instead of insurance — in this context, it&apos;s also the cancellation notice form)</strong> with FMCSA</li>
                <li>FMCSA sends you a letter giving you <strong>30 days</strong> to file new coverage</li>
                <li>If no new BMC-91 is filed within 30 days, your operating authority is <strong>revoked</strong></li>
                <li>If you continue operating without authority — up to <strong>$16,864 per violation</strong></li>
            </ol>
            <p>We&apos;ve talked to carriers who switched insurance companies and assumed there was automatic continuity. There isn&apos;t. You need the new insurer to file a new BMC-91 before the old one expires. Overlap, don&apos;t gap.</p>

            <h2>Reducing Your Premiums</h2>
            <ul>
                <li><strong>Clean CSA scores</strong> can save you 15-30% on premiums.</li>
                <li><strong>Dash cameras</strong> — many insurers offer discounts for forward-facing cams.</li>
                <li><strong>Safety programs</strong> — documented driver training and policies show insurers you&apos;re serious.</li>
                <li><strong>Higher deductibles</strong> — if your cash flow supports it, a higher deductible lowers your premium.</li>
                <li><strong>Shop annually</strong> — trucking insurance is one market where loyalty doesn&apos;t always pay. Get quotes every renewal.</li>
            </ul>
        </BlogPostLayout>
    );
}
