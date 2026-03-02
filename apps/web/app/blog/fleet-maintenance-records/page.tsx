import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Fleet Maintenance Record Keeping: What to Track and How Long to Keep It", description: "Guide to fleet maintenance record keeping requirements under Part 396. What records to keep, retention periods, digital vs paper, and audit preparation.", alternates: { canonical: "/blog/fleet-maintenance-records" } };

export default function Page() {
    return (
        <BlogPostLayout category="Vehicle Compliance" title="Fleet Maintenance Records: What to Keep, How Long, and Why It Matters" date="February 2, 2026" readTime="5 min read" relatedPosts={[{ slug: "vehicle-maintenance-compliance-guide", title: "Vehicle Maintenance Guide" }, { slug: "preventive-maintenance-program-guide", title: "Preventive Maintenance Guide" }]}>
            <p>Maintenance records win audits. Not having them loses audits. It&apos;s really that straightforward. The truck could be in perfect mechanical condition, but without records proving you maintained it, an auditor has no evidence of compliance.</p>

            <h2>What 396.3 Requires</h2>
            <p>For each vehicle, maintain records showing:</p>
            <ul>
                <li><strong>Vehicle identification</strong> — company unit number, make, model, year, VIN, tire size, license plate</li>
                <li><strong>Inspection schedule</strong> — when and what type of inspections are scheduled</li>
                <li><strong>Inspection, repair, and maintenance records</strong> — every service event documented with date, mileage, and what was done</li>
            </ul>

            <h2>Retention Periods</h2>
            <ul>
                <li><strong>Annual inspection report:</strong> 14 months (overlapping with next annual)</li>
                <li><strong>DVIRs:</strong> 3 months</li>
                <li><strong>Maintenance/repair records:</strong> 1 year while vehicle is in service</li>
                <li><strong>After disposal:</strong> Keep records for 6 months after selling or retiring a vehicle</li>
            </ul>

            <h2>Digital vs Paper</h2>
            <p>FMCSA accepts both. But digital wins on every practical measure — searchable, backed up, timestamped, impossible to lose in a filing cabinet. If you&apos;re still using paper, consider switching. Most fleet maintenance software costs $20-$50/month for small fleets.</p>

            <h2>What &quot;Good&quot; Records Look Like</h2>
            <p>Every entry should include: date, mileage/hours, vehicle unit, technician name, work performed (specific — not just &quot;PM service&quot;), parts replaced, and any defects found and corrected.</p>
            <p>&quot;Oil change and PM service&quot; is okay for your invoice. It&apos;s not enough for a DOT record. You need the itemized checklist showing everything that was inspected and the condition of each component.</p>

            <h2>The Outsourced Shop Problem</h2>
            <p>If you use outside shops for maintenance, make sure they give you detailed documentation. Many truck stops and quick-lube places provide bare-minimum invoices. Ask up front for Part 396-compliant documentation. If they can&apos;t provide it, use a different shop.</p>
        </BlogPostLayout>
    );
}
