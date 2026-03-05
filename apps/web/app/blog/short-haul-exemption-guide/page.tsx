import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Short-Haul Exemption Explained: 150 Air-Mile Radius Rules", description: "Complete guide to the FMCSA short-haul exemption. Who qualifies, the 150 air-mile radius, timecard exception, and when you lose the exemption.", alternates: { canonical: "/blog/short-haul-exemption-guide" }, openGraph: { title: "Short-Haul Exemption Explained: 150 Air-Mile Radius Rules", description: "Complete guide to the FMCSA short-haul exemption. Who qualifies, the 150 air-mile radius, timecard exception, and when you lose the exemption.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Driver Management" title="The Short-Haul Exemption: Who Qualifies and What It Actually Means" date="February 7, 2026" readTime="6 min read" relatedPosts={[{ slug: "hos-rules-explained", title: "Hours of Service Rules Explained" }, { slug: "eld-compliance-guide", title: "ELD Compliance Guide" }]}>
            <p>The short-haul exemption is one of the more generous provisions in HOS rules — if you qualify. No ELD required. No daily logs. Just a timecard. But the qualification rules have some gotchas that trip up plenty of carriers.</p>

            <h2>CDL Short-Haul (§395.1(e)(1))</h2>
            <p>CDL drivers qualify if they:</p>
            <ul>
                <li>Operate within a <strong>150 air-mile radius</strong> of their normal work reporting location</li>
                <li>Return to their work reporting location and are released within <strong>14 consecutive hours</strong></li>
                <li>Do not exceed <strong>11 hours of driving</strong></li>
                <li>Have used this exemption at least 8 days out of the last 30</li>
            </ul>
            <p>Air miles, not driving miles. 150 air miles is about 172 road miles, give or take depending on the roads. Draw a circle on a map — that&apos;s your operating area.</p>

            <h2>Non-CDL Short-Haul / Timecard Exception (§395.1(e)(2))</h2>
            <p>Non-CDL drivers have an even simpler version. Operate within 150 air miles, 14-hour window, and the carrier just keeps timecards showing start time, end time, and total hours. That&apos;s it.</p>

            <h2>When You Lose the Exemption</h2>
            <p>This is where carriers mess up:</p>
            <ul>
                <li><strong>Go beyond 150 air miles</strong> — even once — and that day requires a full ELD record</li>
                <li><strong>Exceed 14 hours</strong> — the driver must switch to full RODS for that day</li>
                <li><strong>Use the exemption fewer than 8 days in 30</strong> — technically disqualifies the driver from short-haul for that period</li>
            </ul>
            <p>The risk is having an ELD on the truck but &quot;usually&quot; not needing it. When the driver goes outside the exemption criteria — even for one run — they need to know how to use the ELD and create proper logs. Train them on both scenarios.</p>

            <h2>Best Of Both Worlds?</h2>
            <p>Some carriers install ELDs in short-haul trucks anyway. Why? Because the exemption criteria can change on any given day. A last-minute delivery outside the radius, a shift that runs long — suddenly you need RODS and don&apos;t have an ELD. Having one installed (even if usually unused) is cheap insurance against that scenario.</p>
        </BlogPostLayout>
    );
}
