import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";
import styles from "../blog.module.css";

export const metadata: Metadata = { title: "Building a DOT Drug & Alcohol Policy: Requirements & Template Guide", description: "How to create a compliant DOT drug and alcohol written policy. Required elements, distribution requirements, acknowledgment forms, and policy review.", alternates: { canonical: "/blog/building-drug-alcohol-policy" }, openGraph: { title: "Building a DOT Drug & Alcohol Policy: Requirements & Template Guide", description: "How to create a compliant DOT drug and alcohol written policy. Required elements, distribution requirements, acknowledgment forms, and policy review.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Drug & Alcohol Testing" title="Writing Your DOT Drug & Alcohol Policy: What Must Be Included" date="February 9, 2026" readTime="6 min read" relatedPosts={[{ slug: "drug-alcohol-testing-compliance", title: "Drug & Alcohol Testing Guide" }, { slug: "reasonable-suspicion-training-guide", title: "Reasonable Suspicion Training" }]}>
            <div className={styles.calloutAmber}>
                <h4>Who does this apply to?</h4>
                <p>A written drug &amp; alcohol policy is required for any motor carrier that employs <strong>CDL (Commercial Driver&apos;s License) drivers</strong> operating <strong>CMVs (commercial motor vehicles over 26,001 lbs, 16+ passengers, or hazmat)</strong>. If you only have non-CDL drivers, you&apos;re not federally required to have this policy — though you may choose to create one.</p>
            </div>

            <p>A written drug and alcohol policy isn&apos;t a nice-to-have. It&apos;s required under <strong>section 382.601</strong>. Every CDL driver must receive a copy and sign an acknowledgment. Every one. No exceptions. And the policy has to cover specific topics — you can&apos;t just write &quot;don&apos;t do drugs&quot; on a napkin and call it compliant.</p>

            <h2>Required Elements</h2>
            <p>Your policy must include:</p>
            <ul>
                <li>The identity of the <strong>DER (Designated Employer Representative — the person at your company who receives test results, answers driver questions, and manages the testing program)</strong> — the person drivers contact about drug/alcohol testing questions</li>
                <li>A description of <strong>safety-sensitive functions (driving, loading/unloading, vehicle inspection, or any time spent waiting to perform these duties)</strong> and when testing applies</li>
                <li>Specific information on prohibited conduct: use, possession, refusal to test</li>
                <li>Details on each test type: <strong>pre-employment, post-accident, random, reasonable suspicion, return-to-duty, follow-up</strong></li>
                <li>Consequences of violating the policy (removal from safety-sensitive duties, referral to a <strong>SAP (Substance Abuse Professional — a qualified counselor who evaluates CDL drivers after a drug or alcohol violation and recommends treatment)</strong>)</li>
                <li>Information about the <strong>effects of controlled substances and alcohol</strong> on health and safety</li>
                <li>A list of <strong>resources for help</strong> — <strong>EAP (Employee Assistance Program — a confidential service offering counseling and support for employees dealing with substance abuse or personal issues)</strong>, community resources, hotlines</li>
            </ul>

            <h2>Distribution</h2>
            <p>Every CDL driver must receive the policy <strong>before performing safety-sensitive functions</strong>. That means during onboarding, not three weeks after they start driving. Get a signed acknowledgment — name, date, signature — and file it.</p>
            <p>Update the policy when regulations change, when you switch testing providers, or when your DER changes. Redistribute and get new acknowledgments each time.</p>

            <h2>Beyond the Minimum</h2>
            <p>Many carriers add provisions that go beyond the federal minimum:</p>
            <ul>
                <li><strong>Policy on prescription medication</strong> — requiring CDL drivers to report prescriptions that may affect their ability to drive safely</li>
                <li><strong>Zero-tolerance policy</strong> — any detectable alcohol level = violation (the federal standard is 0.04 <strong>BAC (Blood Alcohol Concentration — the percentage of alcohol in your bloodstream)</strong> for a violation, 0.02 BAC for removal for 24 hours)</li>
                <li><strong>Employee assistance programs (EAP)</strong> — encouraging voluntary self-referral before a testing violation occurs</li>
            </ul>
            <p>Stricter policies are allowed. Just make sure your CDL drivers know what standard they&apos;re being held to.</p>
        </BlogPostLayout>
    );
}
