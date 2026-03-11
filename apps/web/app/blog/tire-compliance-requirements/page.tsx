import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";
import styles from "../blog.module.css";

export const metadata: Metadata = { title: "Tire Compliance: DOT Tread Depth Minimums & Inspection Rules", description: "Guide to DOT tire compliance requirements. Covers minimum tread depths, steer vs drive tire rules, inspection criteria, and OOS conditions.", alternates: { canonical: "/blog/tire-compliance-requirements" }, openGraph: { title: "Tire Compliance: DOT Tread Depth Minimums & Inspection Rules", description: "Guide to DOT tire compliance requirements. Covers minimum tread depths, steer vs drive tire rules, inspection criteria, and OOS conditions.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Vehicle Compliance" title="Tire Compliance: Tread Depths, Conditions, and When You're Out of Service" date="February 10, 2026" readTime="5 min read" relatedPosts={[{ slug: "vehicle-maintenance-compliance-guide", title: "Vehicle Maintenance Compliance Guide" }, { slug: "brake-compliance-guide", title: "Brake Compliance Guide" }]}>
            <div className={styles.calloutAmber}>
                <h4>Who does this apply to?</h4>
                <p>Tire compliance requirements apply to all CMVs (commercial motor vehicles &mdash; any vehicle over 10,001 lbs GVWR). Tires are the third most common out-of-service violation at roadside inspections.</p>
            </div>

            <p>Tires are the third most common OOS (Out of Service &mdash; when an inspector finds a violation severe enough to pull the vehicle off the road) violation. And unlike brakes, tire problems are visible to the naked eye. A driver who does a proper pre-trip should catch every tire issue before it becomes a violation. Should.</p>

            <h2>Minimum Tread Depths</h2>
            <ul>
                <li><strong>Steer tires (front axle tires that control steering):</strong> 4/32&quot; in any major groove</li>
                <li><strong>Drive tires (rear axle tires that power the vehicle) and trailer tires:</strong> 2/32&quot; in any major groove</li>
            </ul>
            <p>Measure with a tread depth gauge — not a penny. Penny tests are fine for your personal car. For commercial vehicles, use the right tool and document it.</p>

            <h2>Immediate OOS Conditions</h2>
            <p>Any of these puts you out of service on the spot:</p>
            <ul>
                <li>Flat tire or audibly leaking tire</li>
                <li>Exposed body cords (visible through the rubber)</li>
                <li>Tire tread separation</li>
                <li>Any fabric or cord showing due to a cut or crack</li>
                <li>A tire mounted on a damaged rim</li>
                <li>Regrooved or recapped steer tires (illegal on steer axle)</li>
            </ul>

            <h2>Recaps and Retreads</h2>
            <p>Retreaded tires are legal on <strong>drive and trailer axles</strong>. They are <em>never</em> legal on the steer axle. We still see carriers running retreads on steers because they didn&apos;t check when they bought used tires. That&apos;s an immediate violation.</p>

            <h2>Inflation and Load Ratings</h2>
            <p>A tire that&apos;s inflated but underinflated for its load is technically in violation. More practically, underinflated tires run hot, wear unevenly, and blow out. Check inflation cold, before driving. Use a calibrated gauge, not a thump test.</p>

            <h2>Simple Prevention</h2>
            <p>Tire violations are the most preventable item on this list. Walk around the truck. Look at every tire. Check the tread with a gauge. Feel for bulges or separations. It takes 3 minutes. Three minutes vs. a $400+ fine and a 4-hour roadside delay. Easy math.</p>
        </BlogPostLayout>
    );
}
