import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Trailer Maintenance Requirements: DOT Compliance for Trailers", description: "DOT maintenance requirements specific to trailers — annual inspections, lighting, brakes, tires, fifth wheel, and record keeping for trailer fleets.", alternates: { canonical: "/blog/trailer-maintenance-requirements" } };

export default function Page() {
    return (
        <BlogPostLayout category="Vehicle Compliance" title="Trailer Maintenance: The Compliance Area Everyone Forgets" date="February 6, 2026" readTime="5 min read" relatedPosts={[{ slug: "vehicle-maintenance-compliance-guide", title: "Vehicle Maintenance Guide" }, { slug: "annual-dot-inspection-guide", title: "Annual DOT Inspection Guide" }]}>
            <p>Trailers get neglected. They sit in yards between loads, don&apos;t get the same attention as the tractors, and somehow end up being the unit that causes the OOS violation. Sound familiar? Every fleet we talk to has at least one forgotten trailer out back with expired inspection and bald tires.</p>

            <h2>Key Requirements</h2>
            <ul>
                <li><strong>Annual DOT inspection</strong> — same requirement as tractors. Every trailer needs one.</li>
                <li><strong>DVIRs</strong> — drivers must include the trailer in their post-trip report when pulling one.</li>
                <li><strong>PM schedule</strong> — trailers need their own maintenance schedule, separate from tractors.</li>
                <li><strong>Lighting</strong> — all required lights must be operational: markers, tail lights, turn signals, clearance lights, reflectors.</li>
                <li><strong>Brakes</strong> — trailer brakes go out of adjustment faster than tractor brakes because they&apos;re not used as aggressively (they&apos;re on the rear of load distribution).</li>
            </ul>

            <h2>The Lighting Problem</h2>
            <p>Trailer lights take a beating. They get banged up at loading docks, corroded by road salt, and unplugged when trailers sit disconnected. Every time a trailer gets connected, the driver should check all lights. Every. Single. Time.</p>

            <h2>Intermodal and Leased Trailers</h2>
            <p>If you&apos;re pulling trailers you don&apos;t own — intermodal containers, leased trailers, customer drops — you&apos;re still responsible for the DVIR and roadworthiness while it&apos;s attached to your tractor. The trailer owner is responsible for the annual inspection, but you&apos;re responsible for not pulling an unsafe trailer.</p>
            <p>Check the inspection decal before hooking up. Check the lights and tires before leaving the yard. If something&apos;s wrong, refuse it. The violation goes on <em>your</em> CSA, not the trailer owner&apos;s.</p>
        </BlogPostLayout>
    );
}
