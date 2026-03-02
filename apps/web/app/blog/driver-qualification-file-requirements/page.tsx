import Link from "next/link";
import { Truck, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import styles from "../blog.module.css";

export const metadata: Metadata = {
    title: "Driver Qualification File (DQF) Requirements: Complete Guide (2026)",
    description: "Everything you need to know about FMCSA driver qualification file requirements. Complete list of required documents, retention periods, and common audit findings.",
    alternates: { canonical: "/blog/driver-qualification-file-requirements" },
    openGraph: { title: "Driver Qualification File Requirements — Complete Guide", description: "Complete guide to FMCSA DQF requirements for motor carriers.", type: "article", publishedTime: "2026-02-12T00:00:00Z" },
};

export default function DQFRequirementsPost() {
    return (
        <div className={styles.blogLayout}>
            <nav className={styles.nav}>
                <Link href="/" className={styles.logoLink}><div className={styles.logoIcon}><Truck size={22} /></div><span className={styles.logoText}>DOT Helper</span></Link>
                <div className={styles.navLinks}><Link href="/blog" className={styles.navLink}>← Blog</Link><Link href="/pricing" className={styles.navLink}>Pricing</Link><Link href="/login" className={styles.loginBtn}>Sign In</Link></div>
            </nav>
            <article className={styles.article}>
                <header className={styles.articleHeader}>
                    <div className={styles.articleCategory}>Driver Management</div>
                    <h1 className={styles.articleTitle}>Driver Qualification File (DQF) Requirements: What You Must Have on File</h1>
                    <div className={styles.articleMeta}><span>By DOT Helper Team</span><span>•</span><span>February 12, 2026</span><span>•</span><span>9 min read</span></div>
                </header>
                <div className={styles.articleContent}>
                    <p>The <strong>Driver Qualification File (DQF)</strong> is one of the most scrutinized areas during a DOT audit. Under <strong>FMCSA Part 391</strong>, every motor carrier must maintain a complete qualification file for each driver who operates a commercial motor vehicle (CMV). Missing a single document can result in fines of <strong>$1,270 to $12,695 per violation</strong>.</p>

                    <h2>Who Needs a Driver Qualification File?</h2>
                    <p>A DQF is required for every person who operates a CMV in interstate or intrastate commerce, including:</p>
                    <ul>
                        <li>Full-time company drivers</li>
                        <li>Part-time or casual drivers</li>
                        <li>Owner-operators leased to your authority</li>
                        <li>Any employee who drives a CMV, even occasionally</li>
                    </ul>

                    <h2>Required Documents in Every DQF</h2>

                    <h3>1. Employment Application (§391.21)</h3>
                    <p>Must include: driver&apos;s name, address, date of birth, 10-year employment history, 3-year accident history, list of traffic violations in the past 12 months, and a signed certification. This is the foundation of the DQF and the most commonly deficient document in audits.</p>

                    <h3>2. Motor Vehicle Record (MVR) (§391.23 &amp; §391.25)</h3>
                    <p>You must pull an MVR from every state where the driver held a license in the past 3 years at hire, then <strong>annually</strong> thereafter. An MVR shows the driver&apos;s complete state driving record — violations, suspensions, and accidents.</p>

                    <h3>3. Road Test Certificate (§391.31-391.33)</h3>
                    <p>A road test administered by the carrier, or a copy of the driver&apos;s CDL with proper class and endorsements can serve as a substitute. The test must cover coupling/uncoupling (if applicable), placing the vehicle in operation, and driving in traffic.</p>

                    <h3>4. Medical Examiner&apos;s Certificate (§391.43)</h3>
                    <p>Issued by a medical examiner listed on the FMCSA National Registry. Valid for up to <strong>2 years</strong> (1 year for certain conditions like diabetes or hypertension). Must be current at all times while the driver is operating.</p>

                    <h3>5. Previous Employer Inquiries (§391.23)</h3>
                    <p>You must contact every employer the driver worked for in the previous <strong>3 years</strong> and request safety performance information, including accident history and drug/alcohol violations. You have 30 days from hire to make the inquiries and must document all attempts, even non-responses.</p>

                    <h3>6. Annual Certificate of Violations (§391.27)</h3>
                    <p>Each driver must <strong>annually</strong> provide a list of all traffic violations in the past 12 months, or certify that there were none. Due each year, typically on the driver&apos;s hire anniversary.</p>

                    <h3>7. FMCSA Clearinghouse Query</h3>
                    <p>A <strong>full query</strong> is required for all new hires (requires driver consent). A <strong>limited query</strong> is required annually for all current drivers. You must also report any positive drug/alcohol results.</p>

                    <h3>8. Clearinghouse Consent Form</h3>
                    <p>Written consent from the driver authorizing you to conduct limited queries in the Clearinghouse.</p>

                    <div className={styles.callout}>
                        <h4>📁 Document Retention Periods</h4>
                        <p>Employment application: duration of employment + 3 years. MVRs: 3 years. Medical certificates: 3 years. Previous employer inquiries: duration of employment + 3 years. Road test certificate: duration of employment + 3 years.</p>
                    </div>

                    <h2>Common DQF Audit Findings</h2>
                    <ul>
                        <li><strong>Missing annual MVR</strong> — The #1 most common DQF violation. Set a calendar reminder.</li>
                        <li><strong>Incomplete employment application</strong> — Gaps in employment history or missing signatures.</li>
                        <li><strong>Expired medical certificate</strong> — Driver operating with a lapsed medical card.</li>
                        <li><strong>No previous employer inquiries</strong> — Forgetting to contact previous employers within 30 days.</li>
                        <li><strong>Missing Clearinghouse query</strong> — Not conducting annual limited queries.</li>
                    </ul>

                    <h2>How to Organize Your DQFs</h2>
                    <p>Best practices for DQF organization:</p>
                    <ul>
                        <li>Use a <strong>digital document management system</strong> with automated expiration tracking</li>
                        <li>Create a <strong>standardized checklist</strong> for new hire onboarding</li>
                        <li>Set up <strong>automated alerts</strong> for annual MVRs, medical card renewals, and Clearinghouse queries</li>
                        <li>Conduct <strong>quarterly internal audits</strong> of all DQFs</li>
                        <li>Keep files <strong>accessible but secure</strong> — an auditor can request any file at any time</li>
                    </ul>

                    <div className={styles.articleCta}>
                        <h3>Automate Your DQF Management</h3>
                        <p>DOT Helper tracks every document in your driver qualification files and alerts you before anything expires or goes missing.</p>
                        <Link href="/pricing" className={styles.articleCtaBtn}>Start Your Free Trial <ArrowRight size={16} /></Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
