import Link from "next/link";
import { Truck, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import styles from "../blog.module.css";

export const metadata: Metadata = {
    title: "The Ultimate DOT Compliance Checklist for Small Businesses (2026)",
    description: "Complete DOT compliance checklist for small fleet owners. Cover every FMCSA requirement from driver qualification files to vehicle inspections and stay audit-ready.",
    alternates: { canonical: "/blog/dot-compliance-checklist" },
    openGraph: {
        title: "The Ultimate DOT Compliance Checklist for Small Businesses (2026)",
        description: "Complete DOT compliance checklist for small fleet owners covering every FMCSA requirement.",
        type: "article",
        publishedTime: "2026-03-01T00:00:00Z",
    },
};

export default function DotComplianceChecklistPost() {
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
                    <div className={styles.articleCategory}>Compliance</div>
                    <h1 className={styles.articleTitle}>
                        The Ultimate DOT Compliance Checklist for Small Businesses in 2026
                    </h1>
                    <div className={styles.articleMeta}>
                        <span>By DOT Helper Team</span>
                        <span>•</span>
                        <span>March 1, 2026</span>
                        <span>•</span>
                        <span>12 min read</span>
                    </div>
                </header>

                <div className={styles.articleContent}>
                    <p>
                        Running a small trucking operation means wearing many hats — and staying compliant with the <strong>Department of Transportation (DOT)</strong> and <strong>Federal Motor Carrier Safety Administration (FMCSA)</strong> is one of the most critical. A single missed requirement can result in fines up to <strong>$16,864 per violation</strong>, out-of-service orders, or even loss of your operating authority.
                    </p>
                    <p>
                        This comprehensive <strong>DOT compliance checklist</strong> covers every requirement your small fleet needs to meet in 2026. Use it as your roadmap to staying audit-ready year-round.
                    </p>

                    <h2>1. Operating Authority &amp; Company Filings</h2>
                    <p>Before you put a single truck on the road, your company needs the right federal and state registrations in place:</p>
                    <ul>
                        <li><strong>USDOT Number</strong> — Required for all commercial motor vehicle operations. Verify it&apos;s active at <em>safer.fmcsa.dot.gov</em>.</li>
                        <li><strong>MC Number (Operating Authority)</strong> — Required if you haul freight for hire across state lines.</li>
                        <li><strong>BOC-3 Filing</strong> — Designates process agents in each state you operate. Must be current at all times.</li>
                        <li><strong>Unified Carrier Registration (UCR)</strong> — Annual registration based on fleet size. Due by December 31 each year.</li>
                        <li><strong>MCS-150 Biennial Update</strong> — Update your company information with FMCSA every two years, in your assigned month.</li>
                        <li><strong>Insurance Filing (BMC-91 or BMC-34)</strong> — Minimum $750,000 liability for general freight; $1M or $5M for hazmat.</li>
                        <li><strong>IFTA License</strong> — Required if you operate in more than one jurisdiction. Quarterly fuel tax returns required.</li>
                    </ul>

                    <h2>2. Driver Qualification Files (DQF) — Part 391</h2>
                    <p>Every driver operating a commercial motor vehicle must have a qualification file with all required documents. Missing even one can trigger a violation during an audit.</p>
                    <ul>
                        <li><strong>Employment Application (391.21)</strong> — Must include 10-year employment history and 3-year accident history.</li>
                        <li><strong>Motor Vehicle Record (MVR)</strong> — Pull annually from each state the driver has held a license in the past 3 years.</li>
                        <li><strong>Road Test Certificate (391.31)</strong> — Or equivalent: a valid CDL with proper class and endorsements.</li>
                        <li><strong>Medical Examiner&apos;s Certificate</strong> — Valid for up to 2 years. Must be from a National Registry-listed examiner.</li>
                        <li><strong>Previous Employer Inquiries (391.23)</strong> — Required for 3 years of employment history. Must include drug/alcohol results from FMCSA Clearinghouse.</li>
                        <li><strong>Annual Certificate of Violations (391.27)</strong> — Each driver must certify all traffic violations in the past 12 months, annually.</li>
                        <li><strong>FMCSA Clearinghouse Query</strong> — Full query required at pre-employment; limited query annually for each driver.</li>
                    </ul>

                    <div className={styles.callout}>
                        <h4>💡 Pro Tip</h4>
                        <p>Set up automated 90-day, 60-day, and 30-day alerts for CDL and medical card expirations. DOT Helper does this automatically for every driver in your fleet.</p>
                    </div>

                    <h2>3. Hours of Service (HOS) — Part 395</h2>
                    <p>HOS violations are one of the most common findings in DOT audits. Make sure your operation covers:</p>
                    <ul>
                        <li><strong>ELD compliance</strong> — All CMVs must be equipped with a registered Electronic Logging Device.</li>
                        <li><strong>Daily log review</strong> — Review ELD data within 24 hours. Look for unidentified driving, form & manner errors.</li>
                        <li><strong>Supporting documents</strong> — Toll receipts, fuel receipts, and delivery receipts must be retained for 6 months.</li>
                        <li><strong>11-hour driving limit</strong> — Monitor that no driver exceeds 11 hours of driving after 10 consecutive hours off duty.</li>
                        <li><strong>14-hour duty window</strong> — Drivers cannot drive after the 14th consecutive hour on duty.</li>
                        <li><strong>30-minute break</strong> — Required after 8 cumulative hours of driving.</li>
                        <li><strong>60/70-hour limit</strong> — Track 7-day and 8-day cumulative hours. 34-hour restart rules apply.</li>
                    </ul>

                    <h2>4. Vehicle Maintenance &amp; Inspections — Part 396</h2>
                    <ul>
                        <li><strong>Annual DOT Inspection</strong> — Every CMV and trailer must pass an annual inspection by a qualified inspector. Keep the report for 14 months.</li>
                        <li><strong>DVIRs (Pre/Post Trip)</strong> — Drivers must complete a written DVIR before and after each trip. Defects must be documented and repaired before dispatch.</li>
                        <li><strong>Systematic Maintenance Plan</strong> — You must have a written preventive maintenance program for every vehicle.</li>
                        <li><strong>Maintenance Records</strong> — Keep records for each vehicle showing all inspections, repairs, and maintenance for 1 year + 6 months after disposal.</li>
                        <li><strong>Brake Adjustments</strong> — Check brake adjustment at each PM service. Brakes are the #1 out-of-service violation.</li>
                    </ul>

                    <h2>5. Drug &amp; Alcohol Testing — Part 382</h2>
                    <ul>
                        <li><strong>Pre-employment drug testing</strong> — Required before any driver operates a CMV. No exceptions.</li>
                        <li><strong>Random testing pool</strong> — Must test 50% of drivers for drugs and 10% for alcohol annually.</li>
                        <li><strong>Reasonable suspicion training</strong> — At least 2 hours for all supervisors who may determine reasonable suspicion.</li>
                        <li><strong>Post-accident testing</strong> — Required when a driver is involved in a qualifying accident (fatality, citation + injury, citation + tow).</li>
                        <li><strong>FMCSA Clearinghouse</strong> — Register as an employer, conduct queries, and report violations.</li>
                        <li><strong>Written policy</strong> — Distribute your company&apos;s drug and alcohol policy to every driver. Get signed acknowledgment.</li>
                    </ul>

                    <h2>6. State-Specific Requirements</h2>
                    <p>Don&apos;t forget that individual states may have additional requirements beyond federal DOT regulations:</p>
                    <ul>
                        <li>State DOT registration or intrastate authority</li>
                        <li>State-specific HOS exemptions (some states have agricultural or short-haul exemptions)</li>
                        <li>Vehicle emissions and safety inspection requirements</li>
                        <li>Oversize/overweight permit requirements</li>
                        <li>State fuel tax reporting (IFTA + state-specific taxes)</li>
                    </ul>

                    <h2>Stay Audit-Ready with DOT Helper</h2>
                    <p>
                        Keeping track of all these requirements manually is overwhelming — especially when you&apos;re also managing drivers, loads, and day-to-day operations. That&apos;s exactly why we built <strong>DOT Helper</strong>: to automate compliance tracking, send timely alerts, and keep all your documents organized in one place.
                    </p>

                    <div className={styles.articleCta}>
                        <h3>Never Miss a Compliance Deadline Again</h3>
                        <p>DOT Helper tracks every requirement on this checklist automatically and alerts you before anything expires.</p>
                        <Link href="/pricing" className={styles.articleCtaBtn}>
                            Start Your Free Trial <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
