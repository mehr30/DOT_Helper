import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "How to Build a DOT-Compliant Preventive Maintenance Program", description: "Step-by-step guide to building a preventive maintenance program that meets FMCSA Part 396 requirements. Includes PM intervals, checklists, and documentation.", alternates: { canonical: "/blog/preventive-maintenance-program-guide" } };

export default function Page() {
    return (
        <BlogPostLayout category="Vehicle Compliance" title="Building a Preventive Maintenance Program That Actually Works" date="February 16, 2026" readTime="8 min read" relatedPosts={[{ slug: "vehicle-maintenance-compliance-guide", title: "Vehicle Maintenance Compliance Guide" }, { slug: "dvir-best-practices", title: "DVIR Best Practices" }]}>
            <p>FMCSA requires you to have a &quot;systematic inspection, repair, and maintenance program.&quot; Notice they didn&apos;t say &quot;fix stuff when it breaks.&quot; A PM program means scheduled, documented, proactive maintenance. Wing it and you&apos;ll pay for it — in breakdowns, fines, and CSA points.</p>

            <h2>Setting PM Intervals</h2>
            <p>FMCSA doesn&apos;t mandate specific intervals — that&apos;s your call. But here&apos;s what works for most small fleets:</p>
            <ul>
                <li><strong>PM-A (Minor):</strong> Every 15,000-20,000 miles or 90 days. Oil change, filter replacement, fluid checks, belt inspection, basic safety check.</li>
                <li><strong>PM-B (Intermediate):</strong> Every 30,000-40,000 miles or 6 months. Everything in PM-A plus brake inspection/adjustment, electrical system check, steering components, suspension.</li>
                <li><strong>PM-C (Major):</strong> Every 60,000-80,000 miles or annually. Comprehensive inspection aligning with the annual DOT inspection checklist. Includes everything in A and B plus detailed chassis, frame, and exhaust inspection.</li>
            </ul>
            <p>Adjust based on your operating conditions. Trucks running in dusty, off-road, or extreme temperature environments need shorter intervals.</p>

            <h2>What Your Written Program Must Include</h2>
            <ul>
                <li>The specific PM intervals for each vehicle type in your fleet</li>
                <li>A checklist of inspection items for each PM level</li>
                <li>Procedures for reporting and correcting defects (ties into your DVIR process)</li>
                <li>Identification of who performs inspections and their qualifications</li>
                <li>Documentation and record-keeping procedures</li>
            </ul>

            <h2>Documentation That Survives an Audit</h2>
            <p>For every PM service, document:</p>
            <ul>
                <li>Date of service</li>
                <li>Vehicle unit number, VIN, and mileage at service</li>
                <li>All items inspected</li>
                <li>All defects found and repairs performed</li>
                <li>Parts replaced</li>
                <li>Name and signature of the mechanic or shop that performed the work</li>
            </ul>
            <p>Keep these records for <strong>1 year while the vehicle is in service</strong>, plus <strong>6 months after disposal</strong>. Digital records are fine — and usually better, because they&apos;re searchable and don&apos;t get lost.</p>

            <h2>The Brake Check</h2>
            <p>We&apos;re going to keep beating this drum: brakes are the #1 OOS violation. At every PM service — even the minor ones — check brake adjustment. Measure pushrod stroke. Document it. It takes 10 minutes per truck and prevents the single most common violation in the industry.</p>

            <h2>Outsourcing vs In-House</h2>
            <p>Small fleets often outsource PM to a local truck shop. That&apos;s fine, but make sure they provide detailed documentation for every service. A generic invoice saying &quot;PM service performed&quot; won&apos;t survive an audit. You need itemized records that show what was inspected and what was found.</p>
        </BlogPostLayout>
    );
}
