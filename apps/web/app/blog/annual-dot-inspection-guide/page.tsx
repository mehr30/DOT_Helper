import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Annual DOT Inspection: What's Covered, Who Can Inspect & How to Prepare", description: "Complete guide to annual DOT vehicle inspections. Inspection checklist, qualified inspector requirements, report retention, and common failure points.", alternates: { canonical: "/blog/annual-dot-inspection-guide" } };

export default function Page() {
    return (
        <BlogPostLayout category="Vehicle Compliance" title="The Annual DOT Inspection: A Deep Dive" date="February 14, 2026" readTime="7 min read" relatedPosts={[{ slug: "vehicle-maintenance-compliance-guide", title: "Vehicle Maintenance Compliance Guide" }, { slug: "preventive-maintenance-program-guide", title: "Preventive Maintenance Program Guide" }]}>
            <p>Every CMV and every trailer in your fleet must pass an annual inspection. No exceptions. It&apos;s one of the most fundamental requirements in Part 396 — and one of the easiest to forget about when you&apos;re busy running loads. Then suddenly it&apos;s expired, you&apos;re at a scale, and things go sideways fast.</p>

            <h2>What Gets Inspected</h2>
            <p>The annual inspection follows <strong>Appendix G of Part 396</strong> and covers everything a roadside Level I inspection would check:</p>
            <ul>
                <li>Brake system — adjustment, components, air pressure, warning devices</li>
                <li>Coupling devices — fifth wheel, king pin, pintle hook, safety chains</li>
                <li>Exhaust system — leaks, missing components, mounting</li>
                <li>Fuel system — tanks, caps, lines, mounting</li>
                <li>Lighting — all required lamps, reflectors, turn signals</li>
                <li>Steering — wheel play, linkage, power steering</li>
                <li>Suspension — springs, U-bolts, air bags, shock absorbers</li>
                <li>Frame — cracks, loose bolts, damage</li>
                <li>Tires — tread depth, condition, inflation</li>
                <li>Wheels — cracks, missing lugs, oily seals</li>
                <li>Windshield — wipers, glazing, cracks</li>
            </ul>

            <h2>Who Can Perform It?</h2>
            <p>The inspector must be a <strong>qualified inspector</strong> — someone who has demonstrated competency in all inspection areas, either through training or experience. Many states have their own certification programs. Dealerships, truck repair shops, and independent inspectors can all perform the annual inspection, provided they meet the qualification standard.</p>
            <p>You can also have an in-house mechanic perform inspections if they meet the qualification requirements and you can document their qualifications.</p>

            <h2>The Report and the Sticker</h2>
            <p>After a passing inspection, the inspector provides a written report and typically affixes an inspection decal (sticker) to the vehicle. The report must be kept for <strong>14 months</strong> — either on the vehicle or at the carrier&apos;s principal place of business.</p>
            <p>Keep a copy in both places. The driver should have one in the cab for roadside inspections, and you should have one in your files for audits.</p>

            <h2>Common Failure Points</h2>
            <ul>
                <li><strong>Brake adjustment</strong> — the most common annual inspection failure</li>
                <li><strong>Lighting</strong> — burned-out bulbs and broken lenses add up</li>
                <li><strong>Air leaks</strong> — brake chamber diaphragms and glad hand seals</li>
                <li><strong>Tire condition</strong> — steer tires below 4/32&quot; fail immediately</li>
                <li><strong>Fifth wheel</strong> — excessive wear, cracked mounting, improper adjustment</li>
            </ul>

            <h2>Timing It Right</h2>
            <p>Schedule annual inspections to coincide with your PM-C (major PM) service. You&apos;re already doing a thorough inspection — might as well make it the annual. It saves a separate shop visit and ensures fresh records if an auditor asks.</p>
        </BlogPostLayout>
    );
}
