import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Hiring CDL Drivers: Compliance Checklist for the Onboarding Process", description: "Step-by-step compliance checklist for hiring CDL drivers. Pre-hire requirements, onboarding paperwork, and the documents you must collect before dispatch.", alternates: { canonical: "/blog/hiring-cdl-drivers-compliance" }, openGraph: { title: "Hiring CDL Drivers: Compliance Checklist for the Onboarding Process", description: "Step-by-step compliance checklist for hiring CDL drivers. Pre-hire requirements, onboarding paperwork, and the documents you must collect before dispatch.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Driver Management" title="Hiring CDL Drivers: The Compliance Steps You Can't Skip" date="January 30, 2026" readTime="7 min read" relatedPosts={[{ slug: "driver-qualification-file-requirements", title: "Driver Qualification File Requirements" }, { slug: "fmcsa-clearinghouse-guide", title: "FMCSA Clearinghouse Guide" }]}>
            <p>Hiring a new driver is exciting — more trucks on the road, more revenue. But between the employment application and the first loaded mile, there&apos;s a stack of compliance steps that must happen in a specific order. Skip one and you&apos;re exposed during your next audit.</p>
            <p>Here&apos;s the order we recommend.</p>

            <h2>Before Making the Offer</h2>
            <ol>
                <li><strong>Collect a completed employment application</strong> — Must include 10-year employment history, 3-year accident history, and all traffic violations in the past 12 months. Gaps must be explained.</li>
                <li><strong>Verify CDL status</strong> — Check with the state DMV that the CDL is valid, the right class, correct endorsements, no disqualifying restrictions.</li>
                <li><strong>Run FMCSA Clearinghouse full query</strong> — Requires the driver&apos;s electronic consent. Wait for the result before proceeding. If there&apos;s a violation on record, <em>stop</em>.</li>
                <li><strong>Pull MVRs</strong> — From every state the driver held a license in the past 3 years.</li>
            </ol>

            <h2>Before First Dispatch</h2>
            <ol>
                <li><strong>Pre-employment drug test</strong> — Must receive a verified negative result from the MRO. No driving until this clears.</li>
                <li><strong>Verify medical examiner&apos;s certificate</strong> — Current, from a National Registry examiner. Keep a copy.</li>
                <li><strong>Road test or CDL verification</strong> — Either administer a road test per §391.31 or verify the CDL meets the equivalent standard for the vehicle type.</li>
                <li><strong>Send previous employer inquiries</strong> — You have 30 days, but start immediately. Send to all employers from the past 3 years requesting safety performance history.</li>
                <li><strong>Get signed acknowledgments</strong> — Drug &amp; alcohol policy, Clearinghouse general consent, company safety policies.</li>
                <li><strong>Issue ELD training</strong> — Don&apos;t just hand them the device. Train and document it.</li>
            </ol>

            <h2>Within 30 Days of Hire</h2>
            <ul>
                <li>Complete all previous employer inquiries (or document all attempts if no response)</li>
                <li>Add driver to your random drug testing pool</li>
                <li>File initial Annual Certificate of Violations</li>
            </ul>

            <h2>The Cost of Cutting Corners</h2>
            <p>We know it&apos;s tempting to skip steps when you need a driver on the road ASAP. But putting a driver behind the wheel without a pre-employment drug test? That&apos;s a violation up to $16,864. Without a Clearinghouse query? Same. Without a valid medical card? Out of service on the first inspection.</p>
            <p>Build a repeatable checklist. Follow it every time. No exceptions. Your future self (and your auditor) will thank you.</p>
        </BlogPostLayout>
    );
}
