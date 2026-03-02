import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "DOT Accident Register Requirements: What You Must Document", description: "Guide to maintaining a DOT accident register under Part 390. What qualifies as a recordable accident, required information, and retention periods.", alternates: { canonical: "/blog/accident-register-requirements" } };

export default function Page() {
    return (
        <BlogPostLayout category="Regulations" title="The DOT Accident Register: What Most Carriers Get Wrong" date="February 7, 2026" readTime="5 min read" relatedPosts={[{ slug: "fmcsa-compliance-guide", title: "FMCSA Compliance Guide" }, { slug: "dot-audit-document-checklist", title: "DOT Audit Document Checklist" }]}>
            <p>This one catches carriers off guard more than almost anything else. An auditor asks for your accident register, and you hand them... nothing. Because you didn&apos;t know you needed one. Or you thought &quot;we haven&apos;t had any accidents&quot; meant you didn&apos;t need to keep one.</p>
            <p>Wrong. You need an accident register regardless of whether you&apos;ve had any accidents.</p>

            <h2>What Is the Accident Register?</h2>
            <p>Under <strong>49 CFR §390.15</strong>, every motor carrier must maintain a register of all accidents (as defined by FMCSA) involving any vehicle operated under its authority. The register must include:</p>
            <ul>
                <li>Date of accident</li>
                <li>City/town and state where it occurred</li>
                <li>Driver&apos;s name</li>
                <li>Number of injuries</li>
                <li>Number of fatalities</li>
                <li>Whether hazardous materials were released</li>
            </ul>

            <h2>What Counts as a &quot;Recordable&quot; Accident?</h2>
            <p>FMCSA&apos;s definition is specific. A recordable accident involves a CMV operating on a public road where:</p>
            <ul>
                <li>A fatality occurred, OR</li>
                <li>Someone was injured and transported for medical treatment, OR</li>
                <li>A vehicle was disabled and had to be towed from the scene</li>
            </ul>
            <p>Fender benders in a parking lot? Not recordable. A sideswipe on the highway where nobody got hurt and both vehicles drove away? Not recordable. A rear-end collision where the other driver went to the ER? That&apos;s recordable — even if it wasn&apos;t your driver&apos;s fault.</p>

            <h2>Retention Period</h2>
            <p>Keep the accident register for <strong>3 years</strong> after the date of the accident. Along with the register, you should also retain copies of any accident reports filed with law enforcement, insurance claims, and photos.</p>

            <h2>The Blank Register</h2>
            <p>If you haven&apos;t had any recordable accidents, you still need to maintain the register — it just has no entries. Having a blank register ready to show an auditor demonstrates you know the requirement exists. It&apos;s a small thing, but it signals to the auditor that you take compliance seriously.</p>
        </BlogPostLayout>
    );
}
