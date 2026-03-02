import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "CSA Scores Explained: What They Mean for Your Trucking Business", description: "Understand FMCSA CSA scores — how they're calculated, the 7 BASICs, intervention thresholds, and how to improve your safety scores.", alternates: { canonical: "/blog/csa-scores-explained" } };

export default function Page() {
    return (
        <BlogPostLayout category="Regulations" title="CSA Scores Explained: What They Are, Why They Matter, and How to Fix Them" date="February 24, 2026" readTime="9 min read" relatedPosts={[{ slug: "fmcsa-compliance-guide", title: "FMCSA Compliance Guide" }, { slug: "common-dot-violations", title: "10 Most Common DOT Violations" }]}>
            <p>Your CSA scores follow you everywhere in this industry. Shippers check them. Brokers check them. Insurance underwriters <em>definitely</em> check them. And most carriers we talk to don&apos;t fully understand how the system works until they&apos;re already in trouble.</p>

            <h2>What Are CSA Scores?</h2>
            <p>CSA stands for <strong>Compliance, Safety, Accountability</strong> — FMCSA&apos;s safety measurement system. It collects data from roadside inspections, crash reports, and compliance reviews, then calculates percentile scores across seven categories called BASICs.</p>
            <p>Higher percentile = worse safety performance. You&apos;re being ranked against similar-sized carriers. A 90th percentile score means you&apos;re performing worse than 90% of comparable carriers. Not great.</p>

            <h2>The 7 BASICs</h2>
            <ul>
                <li><strong>Unsafe Driving</strong> — Speeding, reckless driving, improper lane changes. Intervention threshold: 65th percentile.</li>
                <li><strong>Crash Indicator</strong> — Crash frequency and severity. Threshold: 65th percentile.</li>
                <li><strong>HOS Compliance</strong> — Driving time violations, ELD issues, log falsification. Threshold: 65th percentile.</li>
                <li><strong>Vehicle Maintenance</strong> — Brake, tire, lighting violations from inspections. Threshold: 80th percentile.</li>
                <li><strong>Controlled Substances/Alcohol</strong> — Positive tests, refusals. Threshold: 80th percentile.</li>
                <li><strong>Hazardous Materials</strong> — Hazmat handling violations. Threshold: 80th percentile.</li>
                <li><strong>Driver Fitness</strong> — CDL, medical card, qualification violations. Threshold: 80th percentile.</li>
            </ul>

            <h2>How Scores Are Calculated</h2>
            <p>The system uses a <strong>24-month rolling window</strong>. Recent violations are weighted more heavily than older ones — a violation from last month hurts way more than one from 20 months ago.</p>
            <p>Each inspection or crash earns &quot;severity points&quot; based on the specific violations found. Your total points are divided by the number of inspections to get a raw score, which is then compared to your peer group.</p>
            <p>Carriers with fewer inspections get less reliable scores — which actually works against you. FMCSA applies a &quot;safety event group&quot; methodology that can make small carriers look worse because they have fewer data points.</p>

            <h2>What Triggers Intervention?</h2>
            <p>When you exceed the threshold in any BASIC, FMCSA may take action:</p>
            <ul>
                <li><strong>Warning letter</strong> — You get a letter saying &quot;hey, you look bad in this area.&quot;</li>
                <li><strong>Targeted investigation</strong> — An off-site or on-site review focused on the problem area.</li>
                <li><strong>Comprehensive investigation</strong> — A full compliance review covering everything.</li>
                <li><strong>Cooperation/settlement</strong> — Negotiated remediation plan.</li>
                <li><strong>Out-of-service order</strong> — In the worst cases, operations shut down.</li>
            </ul>

            <h2>How to Improve Your Scores</h2>
            <ol>
                <li><strong>Challenge errors.</strong> Use FMCSA&apos;s DataQs process to dispute inaccurate inspection or crash data. We&apos;ve seen carriers drop 20+ percentile points by correcting bad data.</li>
                <li><strong>Increase clean inspections.</strong> Every clean inspection dilutes your violation rate. If you&apos;re confident in your equipment, don&apos;t avoid scale houses — clean inspections help you.</li>
                <li><strong>Fix the root cause.</strong> If brakes are your problem, invest in brake training for drivers and mechanics. If HOS is the issue, upgrade your log review process.</li>
                <li><strong>Wait it out (carefully).</strong> Violations age off after 24 months. If you clean up your act today, your scores will improve over the next two years automatically.</li>
            </ol>
        </BlogPostLayout>
    );
}
