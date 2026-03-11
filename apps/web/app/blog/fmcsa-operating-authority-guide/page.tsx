import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";
import styles from "../blog.module.css";

export const metadata: Metadata = { title: "FMCSA Operating Authority: MC Number, Broker Authority & More", description: "Complete guide to FMCSA operating authority types — MC numbers, broker authority, freight forwarder. How to apply, activation timeline, and maintaining your authority.", alternates: { canonical: "/blog/fmcsa-operating-authority-guide" }, openGraph: { title: "FMCSA Operating Authority: MC Number, Broker Authority & More", description: "Complete guide to FMCSA operating authority types — MC numbers, broker authority, freight forwarder. How to apply, activation timeline, and maintaining your authority.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Regulations" title="FMCSA Operating Authority: Everything You Need to Know About Your MC Number" date="February 21, 2026" readTime="8 min read" relatedPosts={[{ slug: "fmcsa-compliance-guide", title: "FMCSA Compliance Guide" }, { slug: "boc-3-filing-guide", title: "BOC-3 Filing Guide" }]}>
            <div className={styles.calloutAmber}>
                <h4>Who does this apply to?</h4>
                <p><strong>Operating authority (the federal permission to transport goods or passengers for compensation across state lines)</strong> — also known as an MC number — is required if you haul freight or passengers for hire in interstate commerce. Private carriers (hauling your own goods) generally don&apos;t need an MC number — just a USDOT number.</p>
            </div>

            <p>Everybody talks about their &quot;<strong>MC (Motor Carrier number — your operating authority to haul for hire)</strong>&quot; like it&apos;s a single thing. But operating authority is actually more nuanced than most carriers realize. Get it wrong and FMCSA can fine you up to <strong>$16,864 per trip</strong> you operate without proper authority. Per trip.</p>

            <h2>Types of Operating Authority</h2>
            <ul>
                <li><strong>Motor Carrier (MC)</strong> — For-hire transport of regulated commodities. This is what most carriers need. If someone pays you to haul their freight, you need an MC.</li>
                <li><strong>Broker Authority</strong> — Arranging transportation without actually hauling it. If you&apos;re brokering loads, even occasionally, you need broker authority. Separate from your MC.</li>
                <li><strong>Freight Forwarder Authority</strong> — Assembling shipments from multiple shippers. Less common for small operations.</li>
                <li><strong>Private Carrier</strong> — Hauling your own company&apos;s goods. You need a USDOT number but <em>not</em> an MC number.</li>
            </ul>

            <h2>The Application Process</h2>
            <p>Apply through FMCSA&apos;s Unified Registration System. The application fee is <strong>$300</strong>. Here&apos;s the timeline:</p>
            <ol>
                <li>Submit OP-1 application online — takes about 30 minutes</li>
                <li>Application published in the FMCSA Register — starts a <strong>10-day protest period</strong></li>
                <li>File your insurance (BMC-91) and BOC-3 — both must be on file before authority activates</li>
                <li>Authority activates — typically <strong>20-25 business days</strong> after application</li>
            </ol>
            <p>The most common delay? Insurance. Your insurer needs to file the BMC-91 electronically with FMCSA, and some agencies drag their feet. Call and confirm it&apos;s been filed.</p>

            <h2>Maintaining Your Authority</h2>
            <p>Your MC authority stays active as long as:</p>
            <ul>
                <li>Your insurance filing (BMC-91) remains active with FMCSA</li>
                <li>Your BOC-3 is current</li>
                <li>Your USDOT registration is active (MCS-150 biennial update filed)</li>
                <li>You haven&apos;t received an out-of-service order or revocation</li>
            </ul>
            <p>If your insurance lapses — even for a day — FMCSA begins the revocation process. Your insurer files a cancelation notice, and you have <strong>30 days</strong> to file new coverage before your authority is revoked. Don&apos;t let insurance lapse.</p>

            <h2>Revoking vs. Voluntary Inactivation</h2>
            <p>If you stop operating, you can request voluntary inactivation of your authority through FMCSA. This is cleaner than letting it get revoked. Revocation goes on your record and makes getting future authority harder.</p>
        </BlogPostLayout>
    );
}
