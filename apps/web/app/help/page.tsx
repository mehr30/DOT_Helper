import type { Metadata } from "next";
import Link from "next/link";
import StaticPageLayout from "../components/StaticPageLayout";
import styles from "../components/StaticPageLayout.module.css";

export const metadata: Metadata = {
    title: "Help Center — Greenlight USDOT",
    description: "Get help with Greenlight USDOT. Find compliance guides, learn how to use the platform, and get answers to common DOT compliance questions.",
    alternates: { canonical: "/help" },
};

export default function HelpPage() {
    return (
        <StaticPageLayout
            title="Help Center"
            subtitle="Find answers, learn the platform, and get your compliance questions answered."
        >
            <h2>Getting Started</h2>
            <div className={styles.helpGrid}>
                <Link href="/blog/dot-compliance-checklist" className={styles.helpCard}>
                    <div className={styles.helpCardIcon}>📋</div>
                    <div className={styles.helpCardTitle}>DOT Compliance Checklist</div>
                    <div className={styles.helpCardDesc}>Not sure what you need? Start here. A complete list of every federal DOT requirement for small fleets.</div>
                </Link>
                <Link href="/blog/driver-qualification-file-requirements" className={styles.helpCard}>
                    <div className={styles.helpCardIcon}>📂</div>
                    <div className={styles.helpCardTitle}>Driver Qualification Files</div>
                    <div className={styles.helpCardDesc}>What documents you need for every driver, how long to keep them, and the CDL vs non-CDL differences.</div>
                </Link>
                <Link href="/blog/drug-alcohol-testing-compliance" className={styles.helpCard}>
                    <div className={styles.helpCardIcon}>🧪</div>
                    <div className={styles.helpCardTitle}>Drug &amp; Alcohol Testing</div>
                    <div className={styles.helpCardDesc}>Build a compliant testing program. Pre-employment, random, post-accident, and Clearinghouse requirements.</div>
                </Link>
                <Link href="/blog/vehicle-maintenance-compliance-guide" className={styles.helpCard}>
                    <div className={styles.helpCardIcon}>🔧</div>
                    <div className={styles.helpCardTitle}>Vehicle Maintenance</div>
                    <div className={styles.helpCardDesc}>Annual inspections, DVIRs, preventive maintenance programs, and maintenance record requirements.</div>
                </Link>
            </div>

            <h2>Compliance Guides by Topic</h2>
            <div className={styles.helpGrid}>
                <Link href="/blog/fmcsa-clearinghouse-guide" className={styles.helpCard}>
                    <div className={styles.helpCardIcon}>🏦</div>
                    <div className={styles.helpCardTitle}>FMCSA Clearinghouse</div>
                    <div className={styles.helpCardDesc}>Registration, full vs limited queries, reporting, and common mistakes carriers make.</div>
                </Link>
                <Link href="/blog/hos-rules-explained" className={styles.helpCard}>
                    <div className={styles.helpCardIcon}>⏱️</div>
                    <div className={styles.helpCardTitle}>Hours of Service</div>
                    <div className={styles.helpCardDesc}>Driving limits, break rules, the 60/70-hour cycle, and ELD compliance explained.</div>
                </Link>
                <Link href="/blog/how-to-pass-dot-audit" className={styles.helpCard}>
                    <div className={styles.helpCardIcon}>✅</div>
                    <div className={styles.helpCardTitle}>Passing a DOT Audit</div>
                    <div className={styles.helpCardDesc}>What auditors look for, how to organize your records, and the top mistakes that lead to fines.</div>
                </Link>
                <Link href="/blog/common-dot-violations" className={styles.helpCard}>
                    <div className={styles.helpCardIcon}>⚠️</div>
                    <div className={styles.helpCardTitle}>Common DOT Violations</div>
                    <div className={styles.helpCardDesc}>The top violations from roadside inspections and audits, and how to prevent each one.</div>
                </Link>
            </div>

            <h2>All Compliance Guides</h2>
            <p>Browse our full library of <Link href="/blog">compliance guides</Link> covering every area of DOT compliance — written in plain English for business owners.</p>

            <h2>Need More Help?</h2>
            <p>Can&apos;t find what you&apos;re looking for? <Link href="/contact">Contact our team</Link> and we&apos;ll point you in the right direction. We typically respond within 1 business day.</p>
        </StaticPageLayout>
    );
}
