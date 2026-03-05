import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "10 Most Common DOT Violations and How to Avoid Them", description: "The 10 most frequently cited DOT violations during roadside inspections and audits, with practical tips on how to prevent each one.", alternates: { canonical: "/blog/common-dot-violations" }, openGraph: { title: "10 Most Common DOT Violations and How to Avoid Them", description: "The 10 most frequently cited DOT violations during roadside inspections and audits, with practical tips on how to prevent each one.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Compliance" title="10 Most Common DOT Violations (and How to Make Sure You're Not One of Them)" date="February 3, 2026" readTime="9 min read" relatedPosts={[{ slug: "dot-compliance-checklist", title: "The Ultimate DOT Compliance Checklist" }, { slug: "how-to-pass-dot-audit", title: "How to Pass a DOT Audit" }]}>
            <p>FMCSA and state DOT officers conducted over <strong>3.5 million roadside inspections</strong> last year. About 21% resulted in at least one vehicle out-of-service violation. Another 5% resulted in a driver out-of-service violation.</p>
            <p>Want to stay off the wrong side of those statistics? Here are the violations we see most often — and what you can do about each one.</p>

            <h2>1. Brake Adjustment (Out of Adjustment)</h2>
            <p>This is the #1 vehicle OOS violation year after year. Brakes naturally go out of adjustment with use. The fix? Check pushrod stroke at every PM service and train drivers to spot signs of brake issues during pre-trips. A 5-minute check can prevent a 2-day shutdown.</p>

            <h2>2. Inoperable Required Lamps</h2>
            <p>Burned-out headlights, tail lights, or marker lights. It sounds minor, but it&apos;s a violation — and multiple inoperable lamps can trigger an OOS order. Drivers should check all lights during their pre-trip. Every single time.</p>

            <h2>3. Tire Tread Depth/Condition</h2>
            <p>Steer tires need <strong>4/32&quot; minimum</strong> tread. Drive and trailer tires need <strong>2/32&quot;</strong>. Worn tires are an OOS violation. Exposed cords, sidewall damage, or flat tires are immediate OOS. Check tires with a tread depth gauge, not your eyeballs.</p>

            <h2>4. Hours of Service — Log Not Current</h2>
            <p>The driver&apos;s ELD must be current to the last change of duty status. Logs that are hours behind, have unconfirmed edits, or show unidentified driving events get flagged every time. Dispatch should review logs daily — not weekly, not &quot;whenever.&quot;</p>

            <h2>5. No/Expired Medical Certificate</h2>
            <p>Driving with an expired medical card is a driver OOS violation. The driver cannot legally operate the CMV until they have a valid certificate. We&apos;ve lost count of how many drivers we&apos;ve talked to who thought their med card was good for &quot;a few more months&quot; when it had actually expired last quarter.</p>

            <h2>6. False or Missing Driver&apos;s Record of Duty Status</h2>
            <p>Disconnecting from the ELD, driving in &quot;yard move&quot; mode on public roads, or having unexplained gaps between ELD data and vehicle movement — these are red flags that lead to serious violations. Log falsification can result in fines up to $16,864 and driver disqualification.</p>

            <h2>7. No Annual Vehicle Inspection</h2>
            <p>Every CMV needs a current annual inspection report or decal. No report on the vehicle and none at the terminal? That&apos;s a violation. Keep a copy in the truck AND at your office.</p>

            <h2>8. Insufficient Load Securement</h2>
            <p>Cargo that isn&apos;t properly tied down is dangerous and illegal. The rules in Part 393 are specific about the number of tiedowns based on cargo length and weight. Flatbed carriers: this is your #1 exposure area.</p>

            <h2>9. Brake Hose/Tubing Chafed</h2>
            <p>Rubber brake hoses rubbing against frame members wear through over time. Once the inner liner is compromised, you&apos;ve got an air leak and an OOS violation. Visual inspection during pre-trips catches this every time — if the driver actually looks.</p>

            <h2>10. Operating Without USDOT/MC Number Displayed</h2>
            <p>Your USDOT number must be displayed on both sides of every CMV you operate. Letters must be at least 2 inches tall, in a contrasting color, and visible from 50 feet. Magnetic signs count, but make sure they don&apos;t fall off. We&apos;ve heard that story more times than we&apos;d like.</p>

            <h2>The Pattern</h2>
            <p>Notice something? Almost every violation on this list is preventable with a thorough pre-trip inspection and a basic maintenance program. That&apos;s it. No magic required — just discipline.</p>
        </BlogPostLayout>
    );
}
