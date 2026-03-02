import Link from "next/link";
import { Truck, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import styles from "../blog.module.css";

export const metadata: Metadata = {
    title: "Hours of Service (HOS) Rules Explained: 2026 Complete Guide",
    description: "Plain-English guide to FMCSA Hours of Service rules. Covers the 11-hour driving limit, 14-hour window, 30-minute break, 60/70-hour cycle, and sleeper berth provisions.",
    alternates: { canonical: "/blog/hos-rules-explained" },
    openGraph: { title: "HOS Rules Explained — 2026 Complete Guide", description: "Complete guide to Hours of Service regulations for truck drivers.", type: "article", publishedTime: "2026-02-05T00:00:00Z" },
};

export default function HOSRulesExplainedPost() {
    return (
        <div className={styles.blogLayout}>
            <nav className={styles.nav}>
                <Link href="/" className={styles.logoLink}><div className={styles.logoIcon}><Truck size={22} /></div><span className={styles.logoText}>DOT Helper</span></Link>
                <div className={styles.navLinks}><Link href="/blog" className={styles.navLink}>← Blog</Link><Link href="/pricing" className={styles.navLink}>Pricing</Link><Link href="/login" className={styles.loginBtn}>Sign In</Link></div>
            </nav>
            <article className={styles.article}>
                <header className={styles.articleHeader}>
                    <div className={styles.articleCategory}>HOS</div>
                    <h1 className={styles.articleTitle}>Hours of Service (HOS) Rules Explained: 2026 Complete Guide</h1>
                    <div className={styles.articleMeta}><span>By DOT Helper Team</span><span>•</span><span>February 5, 2026</span><span>•</span><span>11 min read</span></div>
                </header>
                <div className={styles.articleContent}>
                    <p><strong>Hours of Service (HOS)</strong> regulations are among the most important — and most frequently violated — FMCSA rules. They exist to prevent fatigued driving, which is a leading cause of commercial vehicle accidents. Understanding these rules is critical for both drivers and carriers.</p>

                    <h2>The Four Duty Statuses</h2>
                    <p>Under HOS rules, a driver&apos;s time is recorded in four categories:</p>
                    <ul>
                        <li><strong>Off Duty</strong> — Free from all work responsibilities. Time to rest and recover.</li>
                        <li><strong>Sleeper Berth</strong> — Resting in the vehicle&apos;s sleeper berth compartment.</li>
                        <li><strong>Driving</strong> — Operating the CMV on a public road.</li>
                        <li><strong>On Duty (Not Driving)</strong> — Working but not driving: loading, fueling, inspections, paperwork.</li>
                    </ul>

                    <h2>Key HOS Rules for Property-Carrying Drivers</h2>

                    <h3>11-Hour Driving Limit</h3>
                    <p>A driver may drive a maximum of <strong>11 hours</strong> after 10 consecutive hours off duty. Once 11 hours of driving time are used, driving must stop until another 10 consecutive hours off duty are taken.</p>

                    <h3>14-Hour Duty Window</h3>
                    <p>A driver may not drive after the <strong>14th consecutive hour</strong> after coming on duty, regardless of breaks taken during that time. The 14-hour clock starts when you go on duty and does not stop for off-duty time (except qualifying sleeper berth splits).</p>

                    <div className={styles.callout}>
                        <h4>⚠️ Key Difference</h4>
                        <p>The 11-hour driving limit stops when you&apos;re not driving. The 14-hour window does NOT stop — it runs continuously from your first on-duty moment. This is the most misunderstood HOS rule.</p>
                    </div>

                    <h3>30-Minute Break Requirement</h3>
                    <p>A driver must take a <strong>30-minute break</strong> after <strong>8 cumulative hours of driving</strong>. The break can be off-duty, sleeper berth, or on-duty not driving (per the 2020 rule change). You cannot drive again until the break is complete.</p>

                    <h3>60/70-Hour Limit</h3>
                    <p>A driver cannot drive after accumulating:</p>
                    <ul>
                        <li><strong>60 hours on duty</strong> in a 7-day period, OR</li>
                        <li><strong>70 hours on duty</strong> in an 8-day period</li>
                    </ul>
                    <p>The cycle used depends on whether your company operates vehicles 7 days a week (use 70/8) or fewer (use 60/7).</p>

                    <h3>34-Hour Restart</h3>
                    <p>A driver can reset their 60/70-hour clock by taking <strong>34 consecutive hours off duty</strong>. This starts a new 7-day or 8-day period. There is currently no limit to how many restarts a driver can take.</p>

                    <h3>Sleeper Berth Provision</h3>
                    <p>Drivers using a sleeper berth can split their 10-hour off-duty period into two parts:</p>
                    <ul>
                        <li><strong>7/3 split</strong> — One period of at least 7 hours in the sleeper berth + one period of at least 3 hours (off duty or sleeper berth)</li>
                        <li>Neither period counts against the 14-hour window when paired</li>
                    </ul>

                    <h2>Short-Haul Exemption</h2>
                    <p>Drivers who operate within a <strong>150 air-mile radius</strong> of their normal work reporting location can use the short-haul exemption if they:</p>
                    <ul>
                        <li>Return to their work reporting location within 14 hours</li>
                        <li>Do not exceed 11 hours of driving</li>
                        <li>Have operated this way for at least 8 days in the past 30</li>
                    </ul>
                    <p>Short-haul drivers are <strong>exempt from the ELD mandate</strong> and do not need to keep RODS (Records of Duty Status).</p>

                    <h2>ELD Requirements</h2>
                    <p>Since the ELD mandate went into full effect, all drivers required to keep RODS must use a registered <strong>Electronic Logging Device</strong>. The ELD must be:</p>
                    <ul>
                        <li>Registered on FMCSA&apos;s approved ELD list</li>
                        <li>Properly connected to the vehicle&apos;s engine ECM</li>
                        <li>Able to produce records in standard format for roadside inspection</li>
                        <li>Supported by the driver&apos;s ability to annotate and edit logs</li>
                    </ul>

                    <h2>Common HOS Violations and Penalties</h2>
                    <ul>
                        <li><strong>Driving beyond 11-hour limit</strong> — $16,864 max per offense</li>
                        <li><strong>Driving beyond 14-hour window</strong> — $16,864 max per offense</li>
                        <li><strong>False log entry</strong> — $16,864 per offense; can also result in driver disqualification</li>
                        <li><strong>No ELD in use</strong> — Out-of-service order + $1,270-$12,695 fine</li>
                        <li><strong>60/70 hour violation</strong> — $16,864 max per offense</li>
                    </ul>

                    <h2>How Carriers Should Monitor HOS Compliance</h2>
                    <ul>
                        <li>Review ELD data <strong>daily</strong> — don&apos;t wait for end-of-week reviews</li>
                        <li>Address unidentified driving events within 24 hours</li>
                        <li>Track each driver&apos;s 60/70-hour running total in real-time</li>
                        <li>Document corrective actions for any violations</li>
                        <li>Retain ELD records and supporting documents for <strong>6 months</strong></li>
                    </ul>

                    <div className={styles.articleCta}>
                        <h3>Track HOS Compliance Automatically</h3>
                        <p>DOT Helper monitors your drivers&apos; hours in real-time and alerts you before they approach limits.</p>
                        <Link href="/pricing" className={styles.articleCtaBtn}>Start Your Free Trial <ArrowRight size={16} /></Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
