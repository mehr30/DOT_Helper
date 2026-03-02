import Link from "next/link";
import { Truck, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import styles from "../blog.module.css";

export const metadata: Metadata = {
    title: "FMCSA Compliance Guide for Small Fleet Owners (2026)",
    description: "Complete FMCSA compliance guide for small fleets. Covers operating authority, insurance, CSA scores, safety management, and how to avoid violations and fines.",
    alternates: { canonical: "/blog/fmcsa-compliance-guide" },
    openGraph: {
        title: "FMCSA Compliance Guide for Small Fleet Owners",
        description: "Everything small fleet owners need to know about FMCSA regulations and compliance requirements.",
        type: "article",
        publishedTime: "2026-02-18T00:00:00Z",
    },
};

export default function FmcsaComplianceGuidePost() {
    return (
        <div className={styles.blogLayout}>
            <nav className={styles.nav}>
                <Link href="/" className={styles.logoLink}>
                    <div className={styles.logoIcon}><Truck size={22} /></div>
                    <span className={styles.logoText}>DOT Helper</span>
                </Link>
                <div className={styles.navLinks}>
                    <Link href="/blog" className={styles.navLink}>← Blog</Link>
                    <Link href="/pricing" className={styles.navLink}>Pricing</Link>
                    <Link href="/login" className={styles.loginBtn}>Sign In</Link>
                </div>
            </nav>

            <article className={styles.article}>
                <header className={styles.articleHeader}>
                    <div className={styles.articleCategory}>Regulations</div>
                    <h1 className={styles.articleTitle}>FMCSA Compliance Guide for Small Fleet Owners</h1>
                    <div className={styles.articleMeta}>
                        <span>By DOT Helper Team</span><span>•</span>
                        <span>February 18, 2026</span><span>•</span><span>14 min read</span>
                    </div>
                </header>

                <div className={styles.articleContent}>
                    <p>
                        The <strong>Federal Motor Carrier Safety Administration (FMCSA)</strong> regulates all commercial motor vehicles (CMVs) operating in interstate commerce. For small fleet owners, understanding these regulations isn&apos;t just about avoiding fines — it&apos;s about protecting your drivers, your business, and the public.
                    </p>
                    <p>
                        This guide breaks down the key <strong>FMCSA compliance requirements</strong> that every small fleet owner must know in 2026.
                    </p>

                    <h2>What Is FMCSA and Why Does It Matter?</h2>
                    <p>
                        FMCSA is the federal agency within the DOT responsible for regulating and overseeing the safety of commercial motor vehicles. They issue regulations (Title 49 CFR Parts 300-399), conduct compliance reviews, manage the CSA program, and can shut down unsafe carriers.
                    </p>
                    <p>
                        If you operate vehicles over 10,001 lbs GVWR, transport 9+ passengers for hire, or haul hazardous materials — you fall under FMCSA jurisdiction.
                    </p>

                    <h2>Getting Started: Operating Authority</h2>
                    <p>Before you can legally haul freight, you need:</p>
                    <ul>
                        <li><strong>USDOT Number</strong> — Your unique identifier. Apply at <em>fmcsa.dot.gov</em>. Free to obtain.</li>
                        <li><strong>Motor Carrier (MC) Authority</strong> — Required for for-hire carriers. Costs $300 to apply. Takes 20-25 business days to process.</li>
                        <li><strong>Insurance Filing</strong> — File your BMC-91 (financial responsibility) through your insurance provider. Must be on file with FMCSA before authority activates.</li>
                        <li><strong>BOC-3</strong> — Designate process agents in every state. Filed through a BOC-3 service provider.</li>
                        <li><strong>UCR Registration</strong> — Annual registration. Fee depends on fleet size (starts at around $176 for 0-2 power units).</li>
                    </ul>

                    <h2>Understanding CSA Scores</h2>
                    <p>
                        The <strong>Compliance, Safety, Accountability (CSA)</strong> program is FMCSA&apos;s safety measurement system. It evaluates carriers across <strong>7 BASICs</strong> (Behavior Analysis and Safety Improvement Categories):
                    </p>
                    <ul>
                        <li><strong>Unsafe Driving</strong> — Speeding, reckless driving, lane violations</li>
                        <li><strong>Crash Indicator</strong> — Crash history and patterns</li>
                        <li><strong>HOS Compliance</strong> — Driving time violations, log falsification</li>
                        <li><strong>Vehicle Maintenance</strong> — Brake, tire, and lighting violations</li>
                        <li><strong>Controlled Substances/Alcohol</strong> — Positive tests, refusals</li>
                        <li><strong>Hazardous Materials</strong> — Hazmat handling and documentation</li>
                        <li><strong>Driver Fitness</strong> — CDL, medical card, and qualification violations</li>
                    </ul>

                    <div className={styles.callout}>
                        <h4>📊 Why CSA Scores Matter</h4>
                        <p>High CSA scores can trigger interventions ranging from warning letters to full compliance reviews. Many shippers and brokers also check CSA scores before awarding freight — poor scores directly impact your revenue.</p>
                    </div>

                    <h2>Key Regulatory Areas for Small Fleets</h2>

                    <h3>Driver Qualification (Part 391)</h3>
                    <p>You must maintain a complete qualification file for every driver. This includes employment applications, CDL verification, medical certificates, MVRs, road test certificates, and Clearinghouse queries. Files must be maintained for 3 years after employment ends.</p>

                    <h3>Hours of Service (Part 395)</h3>
                    <p>All CMV drivers must comply with federal HOS rules and record their duty status on an ELD. As a carrier, you&apos;re responsible for monitoring compliance, reviewing logs daily, and taking corrective action when violations occur.</p>

                    <h3>Vehicle Maintenance (Part 396)</h3>
                    <p>Carriers must have a systematic maintenance program for each vehicle, including regular preventive maintenance, annual DOT inspections, and prompt repair of defects identified on DVIRs.</p>

                    <h3>Drug &amp; Alcohol Testing (Part 382)</h3>
                    <p>A comprehensive testing program is required: pre-employment, random, post-accident, reasonable suspicion, return-to-duty, and follow-up testing. You must also register with the FMCSA Clearinghouse and conduct annual queries.</p>

                    <h3>Insurance Requirements (Part 387)</h3>
                    <p>Minimum liability insurance requirements: $750,000 for general commodities, $1,000,000 for oil (hazmat), $5,000,000 for other hazardous materials. Must be filed with FMCSA and remain active at all times.</p>

                    <h2>Common FMCSA Violations and Fines</h2>
                    <p>Here are the most expensive violations small carriers face:</p>
                    <ul>
                        <li><strong>Operating without authority</strong> — Up to $16,864 per violation</li>
                        <li><strong>False log entries</strong> — Up to $16,864 per offense</li>
                        <li><strong>Using a disqualified driver</strong> — Up to $16,864 per violation</li>
                        <li><strong>No drug/alcohol testing program</strong> — Up to $16,864</li>
                        <li><strong>No annual vehicle inspection</strong> — $1,270-$12,695 per vehicle</li>
                        <li><strong>Recordkeeping violations</strong> — $1,270-$12,695 per violation</li>
                    </ul>

                    <h2>How DOT Helper Simplifies FMCSA Compliance</h2>
                    <p>
                        Managing all these requirements across multiple drivers and vehicles is a full-time job. <strong>DOT Helper</strong> was built specifically for small fleet owners who need to stay FMCSA compliant without hiring a dedicated compliance officer. Our platform tracks every requirement, sends automated alerts, and keeps your documentation organized and audit-ready.
                    </p>

                    <div className={styles.articleCta}>
                        <h3>Simplify Your FMCSA Compliance Today</h3>
                        <p>Join thousands of small fleet owners who trust DOT Helper to manage their compliance.</p>
                        <Link href="/pricing" className={styles.articleCtaBtn}>
                            Start Your Free Trial <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
