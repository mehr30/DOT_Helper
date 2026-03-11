import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";
import styles from "../blog.module.css";

export const metadata: Metadata = { title: "DOT Drug Testing Panel: What's Tested and How It Works", description: "Breakdown of the DOT 5-panel drug test — substances tested, cutoff levels, the testing process, split specimen procedures, and MRO review.", alternates: { canonical: "/blog/dot-drug-testing-panel" }, openGraph: { title: "DOT Drug Testing Panel: What's Tested and How It Works", description: "Breakdown of the DOT 5-panel drug test — substances tested, cutoff levels, the testing process, split specimen procedures, and MRO review.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Drug & Alcohol Testing" title="The DOT Drug Testing Panel: What's Actually Being Tested" date="February 14, 2026" readTime="6 min read" relatedPosts={[{ slug: "drug-alcohol-testing-compliance", title: "Drug & Alcohol Testing Guide" }, { slug: "random-drug-testing-requirements", title: "Random Drug Testing Requirements" }]}>
            <div className={styles.calloutAmber}>
                <h4>Who does this apply to?</h4>
                <p>DOT drug testing applies to <strong>CDL (Commercial Driver&apos;s License) drivers</strong> who operate <strong>CMVs (commercial motor vehicles — vehicles over 26,001 lbs, 16+ passengers, or hazmat)</strong>. Non-CDL drivers of smaller commercial vehicles are not subject to federal DOT drug testing.</p>
            </div>

            <p>DOT drug tests follow a standardized 5-panel urine test. Not a 10-panel. Not a hair test. Not a saliva test. Five specific drug classes, tested via urine, period. The DOT requires exactly these 5 classes — no more, no less. Some employers add a 10-panel test as part of a separate company policy, but the DOT test is always these 5. Understanding what&apos;s being tested — and the process around it — helps you manage your program confidently.</p>

            <h2>The 5 Drug Classes</h2>
            <ol>
                <li><strong>Marijuana (THC)</strong> — Including metabolites. Yes, even in states where recreational use is legal. Federal DOT rules override state laws. A driver with a medical marijuana card still fails a DOT test. Full stop.</li>
                <li><strong>Cocaine</strong> — Including metabolites (benzoylecgonine).</li>
                <li><strong>Opiates</strong> — Codeine, morphine, heroin (6-AM). The expanded panel also includes hydrocodone, hydromorphone, oxycodone, and oxymorphone as of 2010.</li>
                <li><strong>Amphetamines</strong> — Amphetamine, methamphetamine, MDMA, MDA.</li>
                <li><strong>Phencyclidine (PCP)</strong></li>
            </ol>

            <h2>The Collection Process</h2>
            <p>Testing happens at a certified collection site by a trained collector. The process follows strict chain of custody procedures under <strong>49 CFR Part 40 (the federal regulation that governs how DOT drug and alcohol tests are conducted)</strong>:</p>
            <ol>
                <li>Driver presents photo ID</li>
                <li>Collector provides sealed collection cup</li>
                <li>Specimen is collected in a private setting (no direct observation for standard tests)</li>
                <li>Temperature is verified immediately (90-100 degrees F range)</li>
                <li>Specimen is split into two bottles (A and B)</li>
                <li>Both bottles are sealed, labeled, and shipped to a <strong>SAMHSA (Substance Abuse and Mental Health Services Administration — the federal agency that certifies testing labs)</strong>-certified lab</li>
            </ol>

            <h2>The MRO Review</h2>
            <p>Test results don&apos;t go directly to the carrier. They go to a <strong>MRO (Medical Review Officer — a licensed physician who reviews lab results before they&apos;re reported to the employer)</strong>. If a test is positive, the MRO contacts the driver to verify whether there&apos;s a legitimate medical explanation (prescription medications, for example).</p>
            <p>If the driver has a valid prescription for, say, opioids, the MRO may report the test as negative. But there&apos;s a catch — the MRO also evaluates whether the medication allows the driver to safely perform safety-sensitive functions. Having a prescription doesn&apos;t automatically mean you can drive.</p>

            <h2>Split Specimen Testing</h2>
            <p>If a test comes back positive, the driver has <strong>72 hours</strong> to request testing of the B (split) specimen at a different lab. This is the driver&apos;s right — you can&apos;t deny it. If the split specimen comes back negative, the test is canceled.</p>

            <h2>Marijuana and the Federal Standard</h2>
            <p>This bears repeating because it comes up constantly: marijuana is legal in many states. It does not matter. DOT testing follows <em>federal</em> standards. A positive marijuana test is a positive test, regardless of state law. We see carriers in Colorado and California confused by this every year. The rule is clear. No exceptions.</p>
        </BlogPostLayout>
    );
}
