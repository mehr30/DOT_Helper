import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "CDL Requirements for Commercial Drivers: Classes, Endorsements & Restrictions", description: "Guide to CDL requirements — license classes, endorsements, restrictions, testing requirements, and what carriers need to verify.", alternates: { canonical: "/blog/cdl-requirements-guide" } };

export default function Page() {
    return (
        <BlogPostLayout category="Driver Management" title="CDL Requirements: Classes, Endorsements, and What You Need to Verify" date="February 19, 2026" readTime="7 min read" relatedPosts={[{ slug: "driver-qualification-file-requirements", title: "Driver Qualification File Requirements" }, { slug: "fmcsa-clearinghouse-guide", title: "FMCSA Clearinghouse Guide" }]}>
            <p>A CDL seems straightforward — until you realize there are three classes, a half-dozen endorsements, and a bunch of restrictions that can catch drivers (and carriers) off guard. As an employer, you need to verify more than just &quot;does this person have a CDL.&quot;</p>

            <h2>CDL Classes</h2>
            <p><strong>Class A</strong> — Combination vehicles with a GCWR of 26,001+ lbs, where the towed vehicle exceeds 10,000 lbs. This covers tractor-trailers, truck and trailer combinations, and most flatbed setups.</p>
            <p><strong>Class B</strong> — Single vehicles with a GVWR of 26,001+ lbs, or such a vehicle towing a trailer under 10,000 lbs. Think straight trucks, buses, dump trucks.</p>
            <p><strong>Class C</strong> — Vehicles that don&apos;t meet Class A or B criteria but are designed for 16+ passengers or carry placarded hazmat. Less common in freight, more common in passenger operations.</p>

            <h2>Key Endorsements</h2>
            <ul>
                <li><strong>H — Hazmat:</strong> Required for hauling placarded hazardous materials. Requires a TSA background check that takes 60-90 days to process. Plan ahead.</li>
                <li><strong>N — Tank Vehicle:</strong> For liquid or gas cargo in tanks of 119+ gallons. Combined with H, you get an &quot;X&quot; endorsement.</li>
                <li><strong>P — Passenger:</strong> For vehicles designed to carry 16+ passengers.</li>
                <li><strong>T — Doubles/Triples:</strong> Required to pull double or triple trailers.</li>
                <li><strong>S — School Bus:</strong> Self-explanatory.</li>
            </ul>

            <h2>Common Restrictions</h2>
            <ul>
                <li><strong>L — Air Brake Restriction:</strong> Driver tested in a vehicle without air brakes. Can&apos;t operate vehicles with full air brakes. This one gets missed — make sure your drivers don&apos;t have the L restriction if your trucks have air brakes.</li>
                <li><strong>E — Automatic Transmission Only:</strong> Driver tested in an automatic. Can&apos;t drive a manual.</li>
                <li><strong>O — No Tractor-Trailer:</strong> Class A obtained without testing in a tractor-trailer combination.</li>
                <li><strong>Z — No Full Air Brake Equipped CMV:</strong> Can operate air-over-hydraulic but not full air.</li>
            </ul>

            <h2>What Carriers Must Verify</h2>
            <p>Every time you hire a driver, check:</p>
            <ol>
                <li>CDL class matches the vehicle they&apos;ll operate</li>
                <li>All required endorsements are present (especially H/N for tank or hazmat)</li>
                <li>No restrictions that conflict with the assignment (L restriction + air brake trucks = problem)</li>
                <li>CDL is not expired, suspended, or revoked</li>
                <li>The CDL state matches their state of domicile</li>
            </ol>
            <p>Keep a copy of both sides of the CDL in the DQF. Check it against the MVR annually. Drivers sometimes get restrictions added or endorsements removed — and they don&apos;t always tell you.</p>
        </BlogPostLayout>
    );
}
