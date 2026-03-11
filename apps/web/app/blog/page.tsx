import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import type { Metadata } from "next";
import GreenlightLogo from "../components/GreenlightLogo";
import Footer from "../components/Footer";
import styles from "./blog.module.css";

export const metadata: Metadata = {
    title: "USDOT Compliance Guides — Plain English Help for Small Fleets",
    description: "Step-by-step guides to getting and staying DOT compliant. Written in plain English for business owners who are new to USDOT compliance or just want it handled.",
    alternates: { canonical: "/blog" },
};

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    color: "blue" | "green" | "purple" | "orange" | "teal" | "red";
    emoji: string;
    isPillar?: boolean;
}

const pillarPosts: Post[] = [
    {
        slug: "dot-compliance-checklist",
        title: "The Ultimate DOT Compliance Checklist for Small Businesses in 2026",
        excerpt: "A comprehensive, step-by-step checklist covering every federal DOT requirement your small fleet needs to meet — from driver qualification files to vehicle inspections.",
        category: "Compliance",
        date: "Mar 1, 2026",
        readTime: "12 min read",
        color: "blue",
        emoji: "📋",
        isPillar: true,
    },
    {
        slug: "fmcsa-compliance-guide",
        title: "FMCSA Compliance Guide for Small Fleet Owners",
        excerpt: "Everything you need to know about FMCSA regulations — from operating authority and insurance requirements to safety management systems and CSA scores.",
        category: "Regulations",
        date: "Feb 18, 2026",
        readTime: "14 min read",
        color: "purple",
        emoji: "📖",
        isPillar: true,
    },
    {
        slug: "driver-qualification-file-requirements",
        title: "Driver Qualification File (DQF) Requirements: What You Must Have on File",
        excerpt: "A detailed breakdown of every document the FMCSA requires in a driver qualification file, including retention periods, common gaps, and how to stay organized.",
        category: "Driver Management",
        date: "Feb 12, 2026",
        readTime: "9 min read",
        color: "orange",
        emoji: "📂",
        isPillar: true,
    },
    {
        slug: "vehicle-maintenance-compliance-guide",
        title: "DOT Vehicle Maintenance & Inspection Compliance Guide",
        excerpt: "Your complete guide to vehicle maintenance compliance — annual inspections, DVIRs, preventive maintenance programs, records, and roadside inspections.",
        category: "Vehicle Compliance",
        date: "Feb 8, 2026",
        readTime: "13 min read",
        color: "green",
        emoji: "🔧",
        isPillar: true,
    },
    {
        slug: "drug-alcohol-testing-compliance",
        title: "DOT Drug & Alcohol Testing Compliance: The Complete Program Guide",
        excerpt: "Build and manage a fully compliant drug & alcohol testing program — test types, Clearinghouse requirements, random selection, and record retention.",
        category: "Drug & Alcohol Testing",
        date: "Feb 5, 2026",
        readTime: "15 min read",
        color: "teal",
        emoji: "🧪",
        isPillar: true,
    },
];

const clusterPosts: Post[] = [
    // Pillar 1 Clusters: DOT Compliance
    { slug: "how-to-pass-dot-audit", title: "How to Pass a DOT Audit: A Complete Preparation Guide", excerpt: "Learn exactly what DOT auditors look for, how to organize your records, and the top mistakes that lead to fines.", category: "Audit Prep", date: "Feb 25, 2026", readTime: "10 min read", color: "green", emoji: "✅" },
    { slug: "dot-compliance-costs-fines", title: "DOT Compliance Costs & Fines: What Non-Compliance Really Costs", excerpt: "Breaking down the real cost of DOT violations — from per-violation fines to out-of-service orders and lost revenue.", category: "Business", date: "Jan 28, 2026", readTime: "8 min read", color: "red", emoji: "💰" },
    { slug: "new-entrant-safety-audit", title: "New Entrant Safety Audit: What to Expect & How to Prepare", excerpt: "Your first 18 months guide — what FMCSA reviews, how to prepare, and what happens if you fail.", category: "Compliance", date: "Feb 28, 2026", readTime: "8 min read", color: "blue", emoji: "🆕" },
    { slug: "usdot-number-requirements", title: "USDOT Number Requirements: Who Needs One & How to Get It", excerpt: "Everything about USDOT numbers — who needs one, how to apply, keeping it active, and operating without one.", category: "Compliance", date: "Feb 22, 2026", readTime: "7 min read", color: "blue", emoji: "🔢" },
    { slug: "ucr-registration-guide", title: "UCR Registration: Fees, Deadlines & Requirements", excerpt: "Complete guide to Unified Carrier Registration — who must register, fee brackets, deadlines, and penalties.", category: "Compliance", date: "Feb 19, 2026", readTime: "6 min read", color: "blue", emoji: "📝" },
    { slug: "boc-3-filing-guide", title: "BOC-3 Filing: What It Is and Why Your Authority Depends on It", excerpt: "Guide to BOC-3 process agent filing — what it is, how to file, costs, and what happens if it lapses.", category: "Compliance", date: "Feb 16, 2026", readTime: "5 min read", color: "blue", emoji: "📄" },
    { slug: "mcs-150-biennial-update", title: "MCS-150 Biennial Update: Don't Let Your USDOT Number Go Inactive", excerpt: "When it's due, how to file, and what happens if you forget this quick 10-minute form.", category: "Compliance", date: "Feb 14, 2026", readTime: "5 min read", color: "blue", emoji: "🔄" },
    { slug: "ifta-reporting-guide", title: "IFTA Reporting for Small Fleets: A No-Nonsense Guide", excerpt: "Step-by-step quarterly fuel tax filing — what to track, deadlines, and the mistakes that cost you money.", category: "Compliance", date: "Feb 10, 2026", readTime: "7 min read", color: "blue", emoji: "⛽" },
    { slug: "state-dot-compliance-requirements", title: "State DOT Compliance: The Requirements You Might Be Missing", excerpt: "State-specific rules that go beyond federal requirements — intrastate authority, emissions, inspections, and more.", category: "Compliance", date: "Feb 8, 2026", readTime: "7 min read", color: "blue", emoji: "🗺️" },
    { slug: "dot-compliance-owner-operators", title: "DOT Compliance for Owner-Operators: Your Solo Carrier Guide", excerpt: "Running legal as a one-truck fleet — leased vs own authority, the minimum checklist, and the consortium situation.", category: "Compliance", date: "Feb 6, 2026", readTime: "8 min read", color: "blue", emoji: "🚛" },
    { slug: "common-dot-violations", title: "10 Most Common DOT Violations and How to Avoid Them", excerpt: "The top violations from 3.5 million roadside inspections — and the simple prevention steps for each.", category: "Compliance", date: "Feb 3, 2026", readTime: "9 min read", color: "red", emoji: "⚠️" },

    // Pillar 2 Clusters: FMCSA Regulations
    { slug: "csa-scores-explained", title: "CSA Scores Explained: What They Mean for Your Business", excerpt: "How CSA scores work, the 7 BASICs, intervention thresholds, and how to improve your scores.", category: "Regulations", date: "Feb 24, 2026", readTime: "9 min read", color: "purple", emoji: "📊" },
    { slug: "fmcsa-operating-authority-guide", title: "FMCSA Operating Authority: MC Number Guide", excerpt: "Operating authority types, the application process, activation timeline, and maintaining your MC number.", category: "Regulations", date: "Feb 21, 2026", readTime: "8 min read", color: "purple", emoji: "🏛️" },
    { slug: "dot-insurance-requirements", title: "DOT Insurance Requirements: Minimums, Filing & Common Pitfalls", excerpt: "Insurance minimums, BMC-91 filing, what happens when insurance lapses, and reducing premiums.", category: "Regulations", date: "Feb 17, 2026", readTime: "7 min read", color: "purple", emoji: "🛡️" },
    { slug: "fmcsa-safety-ratings", title: "FMCSA Safety Ratings: Satisfactory, Conditional & Unsatisfactory", excerpt: "What safety ratings mean, how they're assigned, getting upgraded, and the business impact.", category: "Regulations", date: "Feb 13, 2026", readTime: "6 min read", color: "purple", emoji: "⭐" },
    { slug: "dot-audit-document-checklist", title: "DOT Audit Document Checklist: Every Record You Need Ready", excerpt: "The complete audit-ready file checklist for company, driver, vehicle, and drug program records.", category: "Audit Prep", date: "Feb 11, 2026", readTime: "7 min read", color: "green", emoji: "📁" },
    { slug: "interstate-vs-intrastate-compliance", title: "Interstate vs Intrastate: Which Rules Apply to You?", excerpt: "Key differences between interstate and intrastate compliance — regulations, exemptions, and the gray area.", category: "Regulations", date: "Feb 9, 2026", readTime: "6 min read", color: "purple", emoji: "🔀" },
    { slug: "accident-register-requirements", title: "The DOT Accident Register: What Most Carriers Get Wrong", excerpt: "What qualifies as a recordable accident, required information, and why you need the register even if it's blank.", category: "Regulations", date: "Feb 7, 2026", readTime: "5 min read", color: "purple", emoji: "🚨" },
    { slug: "fmcsa-compliance-review-process", title: "Inside an FMCSA Compliance Review: What Actually Happens", excerpt: "Day-by-day walkthrough of a compliance review — triggers, document review, closing conference, and after.", category: "Regulations", date: "Feb 4, 2026", readTime: "8 min read", color: "purple", emoji: "🔍" },
    { slug: "dot-compliance-officer-role", title: "DOT Compliance Officer: Do You Actually Need One?", excerpt: "The compliance officer role, costs, alternatives for small fleets, and when you need a dedicated person.", category: "Regulations", date: "Feb 1, 2026", readTime: "6 min read", color: "purple", emoji: "👤" },

    // Pillar 3 Clusters: Driver Compliance
    { slug: "hos-rules-explained", title: "Hours of Service (HOS) Rules Explained: 2026 Complete Guide", excerpt: "A plain-English breakdown of the FMCSA Hours of Service rules — driving limits, break rules, and the cycle explained.", category: "HOS", date: "Feb 5, 2026", readTime: "11 min read", color: "teal", emoji: "⏱️" },
    { slug: "fmcsa-clearinghouse-guide", title: "The FMCSA Clearinghouse: A Practical Guide for Employers", excerpt: "Registration, full and limited queries, reporting requirements, and the common mistakes carriers make.", category: "Driver Management", date: "Feb 23, 2026", readTime: "8 min read", color: "orange", emoji: "🏦" },
    { slug: "cdl-requirements-guide", title: "CDL Requirements: Classes, Endorsements & Restrictions", excerpt: "License classes, key endorsements, common restrictions, and what carriers must verify.", category: "Driver Management", date: "Feb 19, 2026", readTime: "7 min read", color: "orange", emoji: "🪪" },
    { slug: "dot-medical-card-requirements", title: "DOT Medical Cards: Everything a Carrier Needs to Know", excerpt: "National Registry examiners, disqualifying conditions, waiver programs, and keeping medical cards current.", category: "Driver Management", date: "Feb 15, 2026", readTime: "7 min read", color: "orange", emoji: "🏥" },
    { slug: "eld-compliance-guide", title: "ELD Compliance: The Rules, the Exemptions, and the Headaches", excerpt: "The ELD mandate, choosing a device, unidentified driving events, malfunctions, and driver training.", category: "Driver Management", date: "Feb 13, 2026", readTime: "8 min read", color: "orange", emoji: "📱" },
    { slug: "mvr-guide-for-carriers", title: "MVRs: How to Pull Them, Read Them, and Act on Them", excerpt: "When to pull MVRs, what to look for, the annual review process, and handling bad records.", category: "Driver Management", date: "Feb 10, 2026", readTime: "6 min read", color: "orange", emoji: "📋" },
    { slug: "short-haul-exemption-guide", title: "The Short-Haul Exemption: Who Qualifies and What It Means", excerpt: "150 air-mile radius rules, CDL vs non-CDL short-haul, and when you lose the exemption.", category: "Driver Management", date: "Feb 7, 2026", readTime: "6 min read", color: "orange", emoji: "📍" },
    { slug: "entry-level-driver-training", title: "Entry-Level Driver Training (ELDT) Requirements", excerpt: "Who must complete ELDT, what it covers, Training Provider Registry, and carrier responsibilities.", category: "Driver Management", date: "Feb 4, 2026", readTime: "6 min read", color: "orange", emoji: "🎓" },
    { slug: "annual-certificate-of-violations", title: "Annual Certificate of Violations: Quick, Easy, and Almost Always Missing", excerpt: "What it is, when it's due, the form, and why this 3-minute task matters in audits.", category: "Driver Management", date: "Feb 2, 2026", readTime: "4 min read", color: "orange", emoji: "📃" },
    { slug: "hiring-cdl-drivers-compliance", title: "Hiring CDL Drivers: The Compliance Steps You Can't Skip", excerpt: "Pre-hire requirements, onboarding paperwork, and documents you must collect before first dispatch.", category: "Driver Management", date: "Jan 30, 2026", readTime: "7 min read", color: "orange", emoji: "🤝" },

    // Pillar 4 Clusters: Vehicle Maintenance
    { slug: "dvir-best-practices", title: "DVIR Best Practices: Getting Pre- and Post-Trips Right", excerpt: "What the regulation requires, pre-trip vs post-trip, what a good DVIR process looks like, and digital vs paper.", category: "Vehicle Compliance", date: "Feb 18, 2026", readTime: "7 min read", color: "green", emoji: "✍️" },
    { slug: "preventive-maintenance-program-guide", title: "Building a Preventive Maintenance Program That Actually Works", excerpt: "PM intervals, written program requirements, documentation, and the critical brake check.", category: "Vehicle Compliance", date: "Feb 16, 2026", readTime: "8 min read", color: "green", emoji: "🛠️" },
    { slug: "annual-dot-inspection-guide", title: "The Annual DOT Inspection: A Deep Dive", excerpt: "What gets inspected, who can inspect, the report and sticker, and common failure points.", category: "Vehicle Compliance", date: "Feb 14, 2026", readTime: "7 min read", color: "green", emoji: "🔎" },
    { slug: "brake-compliance-guide", title: "Brake Compliance: Why Brakes Are Your Biggest Exposure", excerpt: "Brake adjustment standards, why brakes go out, measurement techniques, and beyond adjustment.", category: "Vehicle Compliance", date: "Feb 12, 2026", readTime: "7 min read", color: "green", emoji: "🛑" },
    { slug: "tire-compliance-requirements", title: "Tire Compliance: Tread Depths, Conditions, and When You're Out of Service", excerpt: "Minimum tread depths, immediate OOS conditions, retreads, inflation, and simple prevention.", category: "Vehicle Compliance", date: "Feb 10, 2026", readTime: "5 min read", color: "green", emoji: "🔘" },
    { slug: "roadside-inspection-guide", title: "Roadside Inspections: What Happens, Rights & How to Prepare", excerpt: "The 6 inspection levels, your rights, how to pass consistently, and the value of clean inspections.", category: "Vehicle Compliance", date: "Feb 8, 2026", readTime: "8 min read", color: "green", emoji: "🚦" },
    { slug: "trailer-maintenance-requirements", title: "Trailer Maintenance: The Compliance Area Everyone Forgets", excerpt: "Key trailer requirements, the lighting problem, and dealing with intermodal and leased trailers.", category: "Vehicle Compliance", date: "Feb 6, 2026", readTime: "5 min read", color: "green", emoji: "🚚" },
    { slug: "vehicle-marking-requirements", title: "Vehicle Marking Requirements: Getting Your USDOT Lettering Right", excerpt: "What must be displayed, size and format rules, magnetic signs, and common mistakes.", category: "Vehicle Compliance", date: "Feb 4, 2026", readTime: "4 min read", color: "green", emoji: "🏷️" },
    { slug: "fleet-maintenance-records", title: "Fleet Maintenance Records: What to Keep, How Long, and Why", excerpt: "Part 396.3 requirements, retention periods, digital vs paper, and the outsourced shop problem.", category: "Vehicle Compliance", date: "Feb 2, 2026", readTime: "5 min read", color: "green", emoji: "📒" },
    { slug: "emergency-equipment-requirements", title: "Emergency Equipment: The Small Items That Cause Big Fines", excerpt: "Fire extinguishers, warning triangles, spare fuses — what every CMV must carry and how to check.", category: "Vehicle Compliance", date: "Jan 31, 2026", readTime: "4 min read", color: "green", emoji: "🧯" },

    // Pillar 5 Clusters: Drug & Alcohol Testing
    { slug: "random-drug-testing-requirements", title: "Random Drug Testing: Rates, Selection & Common Errors", excerpt: "Annual testing rates, the random selection process, owner-operator consortiums, and documentation.", category: "Drug & Alcohol Testing", date: "Feb 22, 2026", readTime: "7 min read", color: "teal", emoji: "🎲" },
    { slug: "reasonable-suspicion-training-guide", title: "Reasonable Suspicion Training: Preparing Your Supervisors", excerpt: "Training requirements, what to watch for, the process, and after-test procedures.", category: "Drug & Alcohol Testing", date: "Feb 20, 2026", readTime: "6 min read", color: "teal", emoji: "👁️" },
    { slug: "post-accident-drug-testing", title: "Post-Accident Testing: When You Must Test and When You Don't", excerpt: "Decision criteria for post-accident testing, testing windows, and best practices.", category: "Drug & Alcohol Testing", date: "Feb 17, 2026", readTime: "7 min read", color: "teal", emoji: "🚑" },
    { slug: "dot-drug-testing-panel", title: "The DOT Drug Testing Panel: What's Actually Being Tested", excerpt: "The 5 drug classes, the collection process, MRO review, and the marijuana federal standard.", category: "Drug & Alcohol Testing", date: "Feb 14, 2026", readTime: "6 min read", color: "teal", emoji: "🔬" },
    { slug: "sap-return-to-duty-process", title: "SAP Return-to-Duty: Steps, Timeline & Costs", excerpt: "The full return-to-duty process after a positive test — SAP evaluation, testing, follow-up, and costs.", category: "Drug & Alcohol Testing", date: "Feb 12, 2026", readTime: "7 min read", color: "teal", emoji: "🔁" },
    { slug: "building-drug-alcohol-policy", title: "Writing Your DOT Drug & Alcohol Policy: What Must Be Included", excerpt: "Required elements, distribution, acknowledgment forms, and going beyond the minimum.", category: "Drug & Alcohol Testing", date: "Feb 9, 2026", readTime: "6 min read", color: "teal", emoji: "📜" },
    { slug: "drug-testing-consortium-guide", title: "Drug Testing Consortiums: A Small Fleet's Best Friend", excerpt: "How consortiums work, what they cost, what to look for, and red flags.", category: "Drug & Alcohol Testing", date: "Feb 7, 2026", readTime: "5 min read", color: "teal", emoji: "🤲" },
    { slug: "drug-testing-record-retention", title: "Drug & Alcohol Record Retention: A Cheat Sheet", excerpt: "Retention periods organized by document type — 5-year, 3-year, 2-year, 1-year, and indefinite.", category: "Drug & Alcohol Testing", date: "Feb 5, 2026", readTime: "4 min read", color: "teal", emoji: "🗄️" },
    { slug: "dot-alcohol-testing-requirements", title: "DOT Alcohol Testing: Thresholds, Methods, and Rules", excerpt: "BAC thresholds, breath testing methods, when testing occurs, and the 4-hour pre-duty rule.", category: "Drug & Alcohol Testing", date: "Feb 3, 2026", readTime: "6 min read", color: "teal", emoji: "🍺" },
];

const allPosts = [...pillarPosts, ...clusterPosts];

export default function BlogIndexPage() {
    return (
        <div className={styles.blogLayout}>
            <nav className={styles.nav}>
                <Link href="/" className={styles.logoLink}>
                    <GreenlightLogo size={36} />
                    <span className={styles.logoText}>Greenlight USDOT</span>
                </Link>
                <div className={styles.navLinks}>
                    <Link href="/" className={styles.navLink}>Home</Link>
                    <Link href="/features" className={styles.navLink}>Features</Link>
                    <Link href="/pricing" className={styles.navLink}>Pricing</Link>
                    <Link href="/login" className={styles.loginBtn}>Sign In</Link>
                </div>
            </nav>

            <div className={styles.blogHero}>
                <h1 className={styles.blogTitle}>USDOT Compliance Guides</h1>
                <p className={styles.blogSubtitle}>
                    New to DOT compliance? We&apos;ve got you. Plain English guides that walk you through everything — whether you&apos;re just getting started or want to put compliance on autopilot.
                </p>
            </div>

            {/* Pillar Pages */}
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 var(--space-6)" }}>
                <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "var(--space-4)", color: "var(--text-primary)" }}>
                    📚 Comprehensive Guides
                </h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-6)", fontSize: "0.9375rem" }}>
                    Start here. These guides break down each area of DOT compliance into simple, actionable steps.
                </p>
            </div>
            <div className={styles.postsGrid}>
                {pillarPosts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.postCard}>
                        <div className={`${styles.postImage} ${styles[post.color]}`}>
                            {post.emoji}
                        </div>
                        <div className={styles.postBody}>
                            <div className={styles.postCategory}>{post.category} • Complete Guide</div>
                            <h2 className={styles.postCardTitle}>{post.title}</h2>
                            <p className={styles.postExcerpt}>{post.excerpt}</p>
                            <div className={styles.postMeta}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                    <Calendar size={12} />{post.date}
                                </span>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                    <Clock size={12} />{post.readTime}
                                </span>
                                <span className={styles.readMore}>Read <ArrowRight size={14} /></span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Cluster Posts */}
            <div style={{ maxWidth: 1100, margin: "var(--space-10) auto 0", padding: "0 var(--space-6)" }}>
                <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "var(--space-4)", color: "var(--text-primary)" }}>
                    📝 All Articles
                </h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-6)", fontSize: "0.9375rem" }}>
                    Answers to the specific questions that come up as you get your fleet compliant.
                </p>
            </div>
            <div className={styles.postsGrid}>
                {clusterPosts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.postCard}>
                        <div className={`${styles.postImage} ${styles[post.color]}`}>
                            {post.emoji}
                        </div>
                        <div className={styles.postBody}>
                            <div className={styles.postCategory}>{post.category}</div>
                            <h2 className={styles.postCardTitle}>{post.title}</h2>
                            <p className={styles.postExcerpt}>{post.excerpt}</p>
                            <div className={styles.postMeta}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                    <Calendar size={12} />{post.date}
                                </span>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                    <Clock size={12} />{post.readTime}
                                </span>
                                <span className={styles.readMore}>Read <ArrowRight size={14} /></span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className={styles.footerCta}>
                <h2 className={styles.footerCtaTitle}>Ready to Simplify Your DOT Compliance?</h2>
                <p className={styles.footerCtaText}>
                    Stop worrying about audits and fines. Greenlight USDOT keeps your fleet compliant 24/7.
                </p>
                <Link href="/pricing" className={styles.footerCtaBtn}>
                    Start Free Trial
                    <ArrowRight size={18} />
                </Link>
            </div>

            <Footer />
        </div>
    );
}
