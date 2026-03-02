import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Interstate vs Intrastate Trucking: Compliance Differences Explained", description: "Key differences between interstate and intrastate trucking compliance. Which regulations apply, exemptions, and how to determine your operation type.", alternates: { canonical: "/blog/interstate-vs-intrastate-compliance" } };

export default function Page() {
    return (
        <BlogPostLayout category="Regulations" title="Interstate vs Intrastate: Which Rules Apply to You?" date="February 9, 2026" readTime="6 min read" relatedPosts={[{ slug: "fmcsa-compliance-guide", title: "FMCSA Compliance Guide" }, { slug: "state-dot-compliance-requirements", title: "State DOT Compliance Requirements" }]}>
            <p>This question comes up constantly: &quot;I only haul within my state — do federal DOT rules still apply to me?&quot; Short answer: maybe. Longer answer: it depends on what you&apos;re hauling, how big your truck is, and what your state says.</p>

            <h2>The Basic Distinction</h2>
            <p><strong>Interstate</strong> means commerce that crosses state lines or affects interstate commerce — even if your truck never leaves the state. Here&apos;s the part that surprises people: if you&apos;re hauling goods that originated in or are destined for another state, that&apos;s interstate commerce, even if <em>your</em> portion of the trip stays within one state.</p>
            <p><strong>Intrastate</strong> means purely within-state commerce. The goods originated in your state and are delivered within your state. No part of the shipment&apos;s journey crosses state lines.</p>

            <h2>Who Regulates What</h2>
            <p>Interstate carriers fall fully under <strong>FMCSA federal regulations</strong> — Parts 382, 383, 387, 390-397. No wiggle room.</p>
            <p>Intrastate carriers are regulated by their <strong>state DOT</strong>, which may adopt some, all, or different versions of federal rules. Most states have adopted federal HOS and drug testing rules for intrastate carriers, but some have exemptions for certain operation types (agriculture, short-haul, etc.).</p>

            <h2>Key Differences</h2>
            <ul>
                <li><strong>MC Number:</strong> Required for interstate for-hire carriers. Not required for purely intrastate operations (though some states have their own equivalent).</li>
                <li><strong>Insurance minimums:</strong> Federal minimums ($750K+) apply to interstate. States set their own intrastate minimums, which are sometimes lower.</li>
                <li><strong>ELD mandate:</strong> Applies to interstate drivers. Most states have adopted it for intrastate too, but a few still have exemptions.</li>
                <li><strong>CDL requirements:</strong> Federal CDL standards apply to both interstate and intrastate. You need a CDL regardless.</li>
                <li><strong>Medical card:</strong> Interstate drivers must use a National Registry examiner. Intrastate drivers may use other qualified physicians depending on state rules.</li>
            </ul>

            <h2>The Gray Area</h2>
            <p>Many carriers operate in both interstate and intrastate commerce. If even one load per year is interstate, you&apos;re an interstate carrier for compliance purposes. You can&apos;t switch back and forth. When in doubt, comply with federal rules — they&apos;re almost always the stricter standard, and you&apos;ll be covered either way.</p>
        </BlogPostLayout>
    );
}
