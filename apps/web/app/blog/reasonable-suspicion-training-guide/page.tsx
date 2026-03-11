import BlogPostLayout from "../BlogPostLayout";
import styles from "../blog.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reasonable Suspicion Training: What Supervisors Must Know", description: "Guide to DOT reasonable suspicion training for supervisors. Training requirements, signs to watch for, documentation procedures, and testing protocols.", alternates: { canonical: "/blog/reasonable-suspicion-training-guide" }, openGraph: { title: "Reasonable Suspicion Training: What Supervisors Must Know", description: "Guide to DOT reasonable suspicion training for supervisors. Training requirements, signs to watch for, documentation procedures, and testing protocols.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Drug & Alcohol Testing" title="Reasonable Suspicion Training: Preparing Your Supervisors for a Tough Situation" date="February 20, 2026" readTime="6 min read" relatedPosts={[{ slug: "drug-alcohol-testing-compliance", title: "Drug & Alcohol Testing Guide" }, { slug: "random-drug-testing-requirements", title: "Random Drug Testing Requirements" }]}>
            <div className={styles.calloutAmber}>
                <h4>Who does this apply to?</h4>
                <p>Reasonable suspicion testing requirements apply to employers of <strong>CDL</strong> (Commercial Driver&apos;s License) holders who operate <strong>CMVs</strong> (commercial motor vehicles — vehicles over 26,001 lbs, buses with 16+ passengers, or hazmat vehicles). If your drivers don&apos;t hold a CDL, federal reasonable suspicion testing rules do not apply — though you may still choose to implement your own company policy.</p>
            </div>

            <p>Reasonable suspicion determinations are one of the hardest calls a supervisor has to make. You&apos;re essentially looking at a driver and deciding, based on observable behavior, that there&apos;s enough evidence to warrant a drug or alcohol test. Get it right and you&apos;ve potentially saved lives. Handle it poorly and you&apos;re exposed to grievances, lawsuits, and your own liability.</p>
            <p>That&apos;s exactly why training isn&apos;t optional — it&apos;s federally mandated for any company with CDL drivers.</p>

            <h2>Training Requirements</h2>
            <p>Every person who may make a reasonable suspicion determination about a CDL driver must complete:</p>
            <ul>
                <li><strong>60 minutes of drug awareness training</strong></li>
                <li><strong>60 minutes of alcohol awareness training</strong></li>
            </ul>
            <p>Training must cover the physical, behavioral, speech, and performance indicators of probable drug use and alcohol misuse. Keep certificates of completion in your files — indefinitely.</p>

            <h2>What to Watch For</h2>
            <p>The observations must be <strong>specific, contemporaneous, and articulable</strong> — meaning you saw it happen, you can describe exactly what you saw, and you documented it right away:</p>
            <ul>
                <li>Slurred speech, unsteady gait, abnormal coordination</li>
                <li>Bloodshot or glassy eyes</li>
                <li>Smell of alcohol on breath</li>
                <li>Unusual behavior — agitation, paranoia, excessive drowsiness</li>
                <li>Sudden decline in job performance or attendance</li>
                <li>Physical evidence — paraphernalia, substances in vehicle</li>
            </ul>
            <p>It&apos;s not about having a bad day. It&apos;s about observable, documented signs that would lead a reasonable person to suspect impairment.</p>

            <h2>The Process</h2>
            <ol>
                <li><strong>Observe and document</strong> — Write down exactly what you see, hear, and smell. Be specific: &quot;driver had glassy eyes and slurred speech at 7:15 AM on March 2&quot; — not &quot;driver seemed off.&quot;</li>
                <li><strong>Consult if possible</strong> — If another trained supervisor is available, get their observation too. Two sets of eyes are better than one for documentation purposes.</li>
                <li><strong>Remove the driver from safety-sensitive duty immediately</strong> — Safety-sensitive functions include driving, loading/unloading, vehicle inspection, and any time spent waiting to drive. Do not let the driver perform any of these.</li>
                <li><strong>Arrange testing</strong> — Alcohol testing should happen within <strong>2 hours</strong> (must happen within 8 hours or document why it didn&apos;t). Drug testing should happen within <strong>32 hours</strong>. These are different windows — don&apos;t mix them up.</li>
                <li><strong>Arrange transportation</strong> — The driver cannot drive themselves to the collection site or home.</li>
            </ol>

            <h2>After the Test</h2>
            <p>If negative: the driver returns to duty. Document everything and retain the file.</p>
            <p>If positive: follow your return-to-duty procedures — <strong>SAP</strong> (Substance Abuse Professional) referral, removal from safety-sensitive functions, reporting to the <strong>Clearinghouse</strong> (the FMCSA&apos;s online database that tracks CDL driver drug and alcohol violations).</p>
            <p>If you didn&apos;t test (because the window expired): document <em>why</em> testing didn&apos;t occur. This documentation is critical if the situation is ever questioned.</p>
        </BlogPostLayout>
    );
}
