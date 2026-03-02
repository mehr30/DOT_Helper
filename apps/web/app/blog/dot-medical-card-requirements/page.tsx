import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "DOT Medical Card Requirements: Examiners, Conditions & Renewals", description: "Guide to DOT medical examiner certificates. National Registry examiners, disqualifying conditions, waiver programs, and keeping medical cards current.", alternates: { canonical: "/blog/dot-medical-card-requirements" } };

export default function Page() {
    return (
        <BlogPostLayout category="Driver Management" title="DOT Medical Cards: Everything a Carrier Needs to Know" date="February 15, 2026" readTime="7 min read" relatedPosts={[{ slug: "driver-qualification-file-requirements", title: "Driver Qualification File Requirements" }, { slug: "cdl-requirements-guide", title: "CDL Requirements Guide" }]}>
            <p>An expired medical card is one of the top driver out-of-service violations. And it&apos;s 100% preventable. Yet we see it happen constantly — a driver&apos;s card expires, nobody catches it, and they get shut down at a scale house 300 miles from home.</p>

            <h2>The Basics</h2>
            <p>Every CDL driver must carry a valid <strong>Medical Examiner&apos;s Certificate</strong> (also called a &quot;med card&quot; or &quot;DOT physical card&quot;). The exam must be performed by a provider listed on the <strong>FMCSA National Registry of Certified Medical Examiners</strong>.</p>
            <p>Not just any doctor — a <em>National Registry</em> doctor. That distinction matters. Exams from non-registered providers are not valid for interstate commerce.</p>

            <h2>How Long Is It Valid?</h2>
            <p>A standard DOT physical is valid for <strong>up to 2 years</strong>. But the examiner can issue shorter certificates based on medical conditions:</p>
            <ul>
                <li><strong>1-year certificate:</strong> Common for drivers with controlled diabetes, high blood pressure requiring medication, or sleep apnea on CPAP</li>
                <li><strong>3-month to 6-month certificate:</strong> Issued when a condition needs closer monitoring</li>
            </ul>

            <h2>Disqualifying Conditions</h2>
            <p>Some conditions automatically disqualify a driver:</p>
            <ul>
                <li>Epilepsy or seizures (unless seizure-free for 10+ years off medication, with exemption)</li>
                <li>Insulin-dependent diabetes (requires an FMCSA exemption — which takes 3-6 months to obtain)</li>
                <li>Certain cardiovascular conditions</li>
                <li>Loss of a limb (requires a Skill Performance Evaluation)</li>
                <li>Vision standards: 20/40 in each eye (with correction allowed), 70-degree field of vision in each eye</li>
                <li>Hearing: perceive a forced whisper from 5 feet</li>
            </ul>

            <h2>The FMCSA Vision and Diabetes Exemption Programs</h2>
            <p>If a driver doesn&apos;t meet vision or diabetes standards, FMCSA offers exemption programs. But they&apos;re not quick:</p>
            <ul>
                <li><strong>Diabetes exemption:</strong> Requires application, endocrinologist evaluation, 3+ years of insulin use history, no severe hypoglycemic episodes</li>
                <li><strong>Vision exemption:</strong> Requires 3 years of CMV experience, ophthalmologist evaluation, no involvement in preventable crashes related to vision</li>
            </ul>
            <p>Both exemptions must be renewed every 2 years. Start the process early — 6 months before the driver needs to be behind the wheel.</p>

            <h2>Carrier Responsibilities</h2>
            <p>As the carrier, you must:</p>
            <ul>
                <li>Verify the examiner is on the National Registry (check FMCSA&apos;s site)</li>
                <li>Keep a copy of the medical certificate in the DQF</li>
                <li>Track expiration dates and alert drivers at least 60 days before expiration</li>
                <li>Never dispatch a driver with an expired medical card — this is on you, not just the driver</li>
            </ul>
        </BlogPostLayout>
    );
}
