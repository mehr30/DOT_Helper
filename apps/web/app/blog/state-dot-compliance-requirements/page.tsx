import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";
import styles from "../blog.module.css";

export const metadata: Metadata = { title: "State DOT Compliance: Requirements That Go Beyond Federal Rules", description: "Overview of state-specific DOT compliance requirements that differ from federal FMCSA rules. Covers intrastate authority, state inspections, emissions, and permits.", alternates: { canonical: "/blog/state-dot-compliance-requirements" }, openGraph: { title: "State DOT Compliance: Requirements That Go Beyond Federal Rules", description: "Overview of state-specific DOT compliance requirements that differ from federal FMCSA rules. Covers intrastate authority, state inspections, emissions, and permits.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Compliance" title="State DOT Compliance: The Requirements You Might Be Missing" date="February 8, 2026" readTime="7 min read" relatedPosts={[{ slug: "dot-compliance-checklist", title: "The Ultimate DOT Compliance Checklist" }, { slug: "dot-compliance-costs-fines", title: "DOT Compliance Costs & Fines" }]}>
            <div className={styles.calloutAmber}>
                <h4>Who does this apply to?</h4>
                <p>State DOT requirements apply on top of federal FMCSA rules. If you operate <strong>CMVs (commercial motor vehicles — any vehicle over 10,001 lbs GVWR used for business purposes)</strong> in any state, you may need to meet additional state-specific regulations — especially if you only operate within one state (<strong>intrastate — operating only within a single state</strong>).</p>
            </div>

            <p>Here&apos;s something that trips up even experienced carriers: federal DOT compliance doesn&apos;t cover everything. Every state has its own set of rules, and they can differ significantly from what FMCSA requires.</p>
            <p>We hear it all the time — &quot;But I&apos;m federally compliant!&quot; Great. But Texas, California, New York, and 47 other states have their own opinions about what &quot;compliant&quot; means.</p>

            <h2>Where States Differ</h2>

            <h3>Intrastate Operating Authority</h3>
            <p>Many states require a <strong>separate state-level operating authority</strong> for intrastate carriers. Texas calls it a TxDMV Motor Carrier registration. California has its own <strong>CARB (California Air Resources Board — the state agency that sets emissions standards for trucks operating in California)</strong> requirements. Some states have no separate requirement at all. You need to check your base state and every state you operate in.</p>

            <h3>Vehicle Safety Inspections</h3>
            <p>While FMCSA requires an annual DOT inspection everywhere, <strong>19 states</strong> require additional state-specific vehicle safety inspections. Pennsylvania, for example, requires a separate state inspection with its own sticker. New York has similar requirements. Others — like Florida — don&apos;t require state inspections at all.</p>

            <h3>Emissions Requirements</h3>
            <p>California leads here with its CARB requirements. If you operate a diesel truck in California — even if you&apos;re just passing through — you may need to comply with CARB&apos;s truck and bus regulation. That could mean DPF filters, newer engines, or outright prohibitions on older trucks.</p>
            <p>Several other states are adopting California-style emissions rules under the Advanced Clean Trucks regulation.</p>

            <h3>Oversize/Overweight Permits</h3>
            <p>Weight limits vary by state. Federal bridge formula aside, states set their own axle weight limits, total weight limits, and permit requirements. Running a 5-axle combination at 80,000 lbs is legal federally and in most states — but some states have lower limits or seasonal weight restrictions (hello, spring thaw).</p>

            <h3>Drug &amp; Alcohol Testing Variations</h3>
            <p>A few states require <strong>additional drug testing panels</strong> beyond the federal 5-panel test. Ohio, for example, requires fentanyl testing for state-regulated drivers. Check your state&apos;s DOT website for specifics.</p>

            <h2>How to Stay on Top of State Rules</h2>
            <ul>
                <li>Check your base state&apos;s DOT website for intrastate requirements</li>
                <li>Review CARB requirements if you operate in or through California</li>
                <li>Verify state inspection requirements for every state in your operating area</li>
                <li>Use a compliance management tool that tracks both federal <em>and</em> state requirements</li>
                <li>Join your state trucking association — they&apos;re usually the first to know about regulatory changes</li>
            </ul>
        </BlogPostLayout>
    );
}
