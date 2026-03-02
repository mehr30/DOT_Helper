import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Entry-Level Driver Training (ELDT) Requirements for Motor Carriers", description: "Guide to FMCSA entry-level driver training requirements. Who must complete ELDT, what it covers, Training Provider Registry, and carrier responsibilities.", alternates: { canonical: "/blog/entry-level-driver-training" } };

export default function Page() {
    return (
        <BlogPostLayout category="Driver Management" title="Entry-Level Driver Training: What Changed and What It Means for You" date="February 4, 2026" readTime="6 min read" relatedPosts={[{ slug: "driver-qualification-file-requirements", title: "Driver Qualification File Requirements" }, { slug: "cdl-requirements-guide", title: "CDL Requirements Guide" }]}>
            <p>Since February 2022, anyone applying for a CDL or upgrading their license class or adding certain endorsements must complete <strong>Entry-Level Driver Training (ELDT)</strong> from an FMCSA-registered provider. This wasn&apos;t a huge change for established drivers, but it impacts how you recruit and onboard new talent.</p>

            <h2>Who Must Complete ELDT?</h2>
            <ul>
                <li>First-time CDL applicants (Class A or B)</li>
                <li>Drivers upgrading from Class B to Class A</li>
                <li>Drivers adding the H (hazmat), P (passenger), or S (school bus) endorsement</li>
            </ul>
            <p>Drivers who already held their CDL or endorsement before February 7, 2022 are <strong>grandfathered in</strong>.</p>

            <h2>What ELDT Covers</h2>
            <p>The training has two parts:</p>
            <p><strong>Theory instruction:</strong> Classroom or online. Topics include basic operation, safe operating procedures, vehicle systems, pre-trip inspection, and non-driving activities.</p>
            <p><strong>Behind-the-wheel training:</strong> Actual driving with an instructor. Must include range exercises and on-road driving with a qualified instructor in the cab.</p>
            <p>The provider must be listed on FMCSA&apos;s <strong>Training Provider Registry (TPR)</strong>. After completion, the provider reports to TPR, and the state DMV can see the training was completed before issuing or upgrading the CDL.</p>

            <h2>What This Means for Carriers</h2>
            <p>If you&apos;re hiring entry-level drivers who need CDL training:</p>
            <ul>
                <li>Verify their training provider is on the TPR — uncertified programs don&apos;t count</li>
                <li>Budget for training costs if you&apos;re sponsoring new drivers ($3,000-$10,000 depending on program)</li>
                <li>Some carriers run their own FMCSA-registered training programs — doable but requires significant curriculum and instructor requirements</li>
                <li>Training completion shows in the state&apos;s CDL system, so you can verify through the skills test pass date</li>
            </ul>

            <h2>The Bigger Picture</h2>
            <p>ELDT raised the bar for new CDL holders. That&apos;s a good thing for safety. But it also means CDL training takes longer and costs more than it used to. Factor that into your driver pipeline planning. The carriers who build training partnerships or sponsor programs tend to have better luck with recruiting.</p>
        </BlogPostLayout>
    );
}
