import Link from "next/link";
import type { Metadata } from "next";
import BlogPostLayout from "../BlogPostLayout";
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
        <BlogPostLayout
            category="Compliance"
            title="FMCSA Compliance Guide for Small Fleet Owners"
            date="February 18, 2026"
            readTime="14 min read"
            relatedPosts={[
                { slug: "dot-compliance-checklist", title: "The Ultimate DOT Compliance Checklist" },
                { slug: "csa-scores-explained", title: "CSA Scores Explained" },
            ]}
        >
                    <p>
                        If you operate commercial trucks, vans, or equipment vehicles, there&apos;s a federal agency keeping an eye on you: the <strong>FMCSA</strong> (Federal Motor Carrier Safety Administration). They&apos;re the ones who set the rules for who can drive commercially, how long they can drive, how vehicles must be maintained, and a lot more.
                    </p>
                    <p>
                        Understanding FMCSA compliance isn&apos;t just about avoiding fines (though those can be brutal — up to <strong>$16,864 per violation</strong>). It&apos;s about protecting your drivers, your business, and keeping your authority to operate.
                    </p>
                    <p>
                        This guide breaks down what you actually need to know as a small fleet owner in 2026.
                    </p>

                    <h2>Do FMCSA Rules Apply to Me?</h2>
                    <p>You fall under FMCSA rules if you do any of the following:</p>
                    <ul>
                        <li>Operate vehicles with a gross vehicle weight rating (GVWR) over <strong>10,001 lbs</strong> — that&apos;s the total weight the vehicle is rated for, not what it currently weighs. Check the sticker on the driver&apos;s side door.</li>
                        <li>Transport <strong>9 or more passengers</strong> for compensation (like a shuttle service)</li>
                        <li>Transport <strong>hazardous materials</strong> in quantities that require placards</li>
                    </ul>
                    <p>
                        If any of those apply, you need a USDOT number and must comply with FMCSA safety regulations. Period.
                    </p>

                    <h2>Getting Set Up: The Basics</h2>
                    <p>Before you can legally operate, you need a few things in place:</p>
                    <ul>
                        <li><strong>USDOT Number</strong> — Your company&apos;s unique identifier. Apply free at fmcsa.dot.gov. This is step one — nothing else happens without it.</li>
                        <li><strong>Operating Authority (MC Number)</strong> — If you haul freight for other companies across state lines, you need this. Costs $300 and takes 20-25 business days. If you only haul your own stuff, you may not need it.</li>
                        <li><strong>Insurance</strong> — Minimum $750,000 liability for general freight. Your insurance company files the proof directly with FMCSA. Without this, your authority won&apos;t activate.</li>
                        <li><strong>BOC-3</strong> — A legal requirement to have a designated agent in every state. A BOC-3 service handles it for you for a small fee.</li>
                        <li><strong>UCR Registration</strong> — Annual registration fee based on fleet size. Starts around $176 for small fleets (0-2 trucks).</li>
                    </ul>

                    <h2>CSA Scores: Your Safety Report Card</h2>
                    <p>
                        Think of your <strong>CSA score</strong> as your trucking company&apos;s credit score — except instead of banks, it&apos;s shippers, brokers, and insurance companies checking it. CSA stands for Compliance, Safety, Accountability. FMCSA tracks your performance across seven categories:
                    </p>
                    <ul>
                        <li><strong>Unsafe Driving</strong> — Speeding, reckless driving, lane violations</li>
                        <li><strong>Crash Indicator</strong> — Your crash history</li>
                        <li><strong>Hours of Service</strong> — Are your drivers driving too long?</li>
                        <li><strong>Vehicle Maintenance</strong> — Brake, tire, and light problems found during inspections</li>
                        <li><strong>Drug &amp; Alcohol</strong> — Positive tests or refusals</li>
                        <li><strong>Hazardous Materials</strong> — Hazmat handling violations (if applicable)</li>
                        <li><strong>Driver Fitness</strong> — CDL, medical card, and qualification issues</li>
                    </ul>

                    <div className={styles.callout}>
                        <h4>📊 Why This Matters to Your Bottom Line</h4>
                        <p>Bad CSA scores don&apos;t just trigger government attention — many shippers and brokers check your scores before giving you loads. Poor scores can directly cost you revenue. Insurance companies also use them to set your rates. Better scores = lower premiums.</p>
                    </div>

                    <h2>The Big Five: What You&apos;re Responsible For</h2>

                    <h3>1. Driver Files</h3>
                    <p>
                        For every driver, you need a complete qualification file: application with full work history, CDL copy, medical card, annual driving record, road test, background checks from previous employers, and drug/alcohol database queries. It sounds like a lot, but it&apos;s mostly a one-time setup with annual updates. The <Link href="/blog/driver-qualification-file-requirements">full breakdown is here</Link>.
                    </p>

                    <h3>2. Hours of Service</h3>
                    <p>
                        Your drivers can only drive so many hours before they have to rest. Federal rules cap driving at 11 hours and the total work day at 14 hours. As the carrier, you&apos;re responsible for making sure your drivers follow these rules and that their electronic logs (ELDs) are accurate. <strong>Review logs daily</strong> — not weekly, not &quot;when you get around to it.&quot;
                    </p>

                    <h3>3. Vehicle Maintenance</h3>
                    <p>
                        You need a written maintenance plan, annual DOT inspections for every truck and trailer, and daily pre-trip/post-trip inspections by drivers. When something breaks, it has to be documented and fixed before the vehicle goes back out. Keep records for at least a year after a vehicle leaves your fleet.
                    </p>

                    <h3>4. Drug &amp; Alcohol Testing</h3>
                    <p>
                        If your drivers need a CDL, you need a drug and alcohol testing program. That means testing before you hire someone, random testing throughout the year, testing after serious accidents, and checking the FMCSA&apos;s drug/alcohol database. Most small fleets partner with a testing consortium to handle the logistics.
                    </p>

                    <h3>5. Insurance</h3>
                    <p>
                        Minimum liability coverage of $750,000 for general freight. Higher if you haul oil ($1M) or other hazardous materials ($5M). Your insurance must be filed with FMCSA and stay active at all times. If your insurance lapses — even for a day — your operating authority may be revoked.
                    </p>

                    <h2>What Happens If You Don&apos;t Comply?</h2>
                    <p>The fines are real, and they add up fast:</p>
                    <ul>
                        <li><strong>Operating without authority</strong> — Up to $16,864 per violation</li>
                        <li><strong>Falsifying driver logs</strong> — Up to $16,864 per offense</li>
                        <li><strong>Using a driver who isn&apos;t qualified</strong> — Up to $16,864</li>
                        <li><strong>No drug &amp; alcohol testing program</strong> — Up to $16,864</li>
                        <li><strong>No annual vehicle inspection</strong> — $1,270 to $12,695 per vehicle</li>
                        <li><strong>Missing paperwork/records</strong> — $1,270 to $12,695 per violation</li>
                    </ul>
                    <p>And beyond fines: multiple violations can trigger a full compliance review, a poor safety rating, or even an order to shut down your operation.</p>

                    <h2>It&apos;s a Lot. We Know.</h2>
                    <p>
                        Managing all of this across multiple drivers and vehicles while also running your actual business is overwhelming. That&apos;s why we built <strong>Greenlight USDOT</strong> — specifically for small fleet owners who need to stay compliant without hiring a full-time compliance person. We track every requirement, send reminders, and keep your documentation organized so you&apos;re always ready.
                    </p>
        </BlogPostLayout>
    );
}
