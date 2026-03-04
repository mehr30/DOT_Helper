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
                    <h1 className={styles.articleTitle}>Driver Qualification Files: What You Need on File for Every Driver</h1>
                    <div className={styles.articleMeta}><span>By DOT Helper Team</span><span>•</span><span>February 12, 2026</span><span>•</span><span>9 min read</span></div>
                </header>
                <div className={styles.articleContent}>
                    <p>
                        Here&apos;s the reality: <strong>driver files are the #1 thing DOT auditors check</strong>, and they&apos;re where most companies get caught. Not because they&apos;re doing anything dangerous — but because they forgot to pull a driving record, or a medical card expired and nobody noticed.
                    </p>
                    <p>
                        The good news? Once you know what goes in the file, it&apos;s mostly a one-time setup with a few annual updates. This guide breaks down every document you need, in plain English.
                    </p>

                    <h2>Who Needs a Driver File?</h2>
                    <p>Anyone who drives one of your commercial vehicles needs a qualification file. That includes:</p>
                    <ul>
                        <li>Full-time company drivers</li>
                        <li>Part-time or occasional drivers</li>
                        <li>Owner-operators leased to your authority</li>
                        <li>Any employee who sometimes drives a commercial vehicle — even if driving isn&apos;t their main job</li>
                    </ul>
                    <p>If they touch the steering wheel of a truck over 10,001 lbs, they need a file.</p>

                    <h2>What Goes in the File</h2>

                    <h3>1. Employment Application</h3>
                    <p>
                        This isn&apos;t your standard job application. The DOT version requires <strong>10 years of employment history</strong> and <strong>3 years of accident history</strong>. The driver also has to list any traffic violations from the past year and sign it. This is the single most commonly deficient document in audits — usually because of gaps in employment history or missing signatures.
                    </p>

                    <h3>2. Driving Record (MVR)</h3>
                    <p>
                        Pull this from the DMV when you hire the driver, then <strong>once every year</strong> after that. If your driver held licenses in multiple states in the past 3 years, you need records from each state. An MVR shows their complete driving history — violations, suspensions, and accidents. This is the #1 most common item auditors find missing.
                    </p>

                    <h3>3. Road Test Certificate</h3>
                    <p>
                        You can either give the driver a road test yourself (which needs to cover backing, turning, driving in traffic, etc.) or — what most carriers do — keep a copy of their valid CDL with the right class and endorsements. The CDL counts as proof they can drive.
                    </p>

                    <h3>4. Medical Card (DOT Physical)</h3>
                    <p>
                        Every driver needs a current medical examiner&apos;s certificate. It&apos;s usually good for <strong>2 years</strong>, but some conditions (like diabetes or high blood pressure) can shorten it to 1 year. The exam must be done by a doctor on the FMCSA&apos;s National Registry. When the card expires, the driver <strong>cannot legally drive</strong> until they get a new one. Set reminders 90 days out.
                    </p>

                    <h3>5. Previous Employer Checks</h3>
                    <p>
                        When you hire a new driver, you have to contact every employer they worked for in the past <strong>3 years</strong> and ask about their safety record and any drug/alcohol violations. You have 30 days from their hire date to send these inquiries. Even if a previous employer doesn&apos;t respond, you need to document that you tried.
                    </p>

                    <h3>6. Annual Violations Certificate</h3>
                    <p>
                        Once a year, every driver signs a form listing all traffic violations they&apos;ve had in the past 12 months — or confirming they had none. It sounds simple, and it is. But if it&apos;s not in the file when the auditor looks, it&apos;s a violation.
                    </p>

                    <h3>7. Drug &amp; Alcohol Database Check</h3>
                    <p>
                        Before hiring, run a <strong>full query</strong> on the driver through the FMCSA&apos;s drug and alcohol database (called the Clearinghouse). This requires the driver&apos;s consent. After that, run an <strong>annual check</strong> for every active driver. If a driver has a violation on record, you need to know about it before putting them behind the wheel.
                    </p>

                    <h3>8. Clearinghouse Consent Form</h3>
                    <p>Written consent from the driver allowing you to run those annual database checks. Keep it in their file.</p>

                    <div className={styles.callout}>
                        <h4>📁 How Long Do You Keep These?</h4>
                        <p>Most documents need to be kept for the entire time the driver works for you, <strong>plus 3 years</strong> after they leave. Driving records (MVRs) are kept for 3 years. Medical cards for 3 years. The safe bet: keep everything for at least 3 years after a driver&apos;s last day.</p>
                    </div>

                    <h2>The Most Common Mistakes</h2>
                    <p>Based on what auditors find most often:</p>
                    <ul>
                        <li><strong>Forgot the annual driving record</strong> — Set a recurring calendar reminder. This is the most common violation.</li>
                        <li><strong>Incomplete application</strong> — Gaps in work history or missing signatures. Review it before filing.</li>
                        <li><strong>Expired medical card</strong> — Driver is still working but their physical lapsed. Track expiration dates.</li>
                        <li><strong>Didn&apos;t contact previous employers</strong> — You have 30 days from hire. Don&apos;t let it slip.</li>
                        <li><strong>No annual database check</strong> — Easy to forget if you don&apos;t have a system tracking it.</li>
                    </ul>

                    <h2>How to Stay On Top of It</h2>
                    <ul>
                        <li>Use a digital system with <strong>automatic expiration alerts</strong> — not a filing cabinet</li>
                        <li>Create a <strong>new-hire checklist</strong> so nothing gets missed during onboarding</li>
                        <li>Do a <strong>quick internal audit</strong> of all files every quarter — catch issues before an auditor does</li>
                        <li>Keep files <strong>organized and accessible</strong> — if an auditor asks for a file, you should be able to pull it in minutes, not hours</li>
                    </ul>

                    <div className={styles.articleCta}>
                        <h3>Never Miss a Driver File Deadline</h3>
                        <p>DOT Helper tracks every document in your driver files and alerts you before anything expires or goes missing.</p>
                        <Link href="/pricing" className={styles.articleCtaBtn}>Start Your Free Trial <ArrowRight size={16} /></Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
