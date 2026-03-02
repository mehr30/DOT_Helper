import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "USDOT Vehicle Marking Requirements: Size, Color & Placement Rules", description: "Guide to USDOT vehicle marking requirements — display rules for USDOT numbers, company name, and GVW on commercial motor vehicles.", alternates: { canonical: "/blog/vehicle-marking-requirements" } };

export default function Page() {
    return (
        <BlogPostLayout category="Vehicle Compliance" title="Vehicle Marking Requirements: Getting Your USDOT Lettering Right" date="February 4, 2026" readTime="4 min read" relatedPosts={[{ slug: "vehicle-maintenance-compliance-guide", title: "Vehicle Maintenance Guide" }, { slug: "usdot-number-requirements", title: "USDOT Number Requirements" }]}>
            <p>This one&apos;s simple. But we still see violations for it at scale houses, so apparently it&apos;s not simple enough. Under <strong>§390.21</strong>, every CMV must display specific information on both sides of the vehicle.</p>

            <h2>What Must Be Displayed</h2>
            <ul>
                <li>Legal name or single trade name of the carrier</li>
                <li>USDOT number, preceded by &quot;USDOT&quot;</li>
                <li>If you&apos;re operating for hire, your MC number (optional but recommended)</li>
            </ul>

            <h2>Size and Format Rules</h2>
            <ul>
                <li>Letters and numbers must be <strong>at least 2 inches tall</strong></li>
                <li>Must be in a <strong>color that contrasts</strong> with the background (i.e., readable)</li>
                <li>Must be <strong>readable from 50 feet</strong> during daylight</li>
                <li>On <strong>both sides</strong> of the power unit (not trailer — the tractor)</li>
                <li>Can be painted, decaled, or magnetic</li>
            </ul>

            <h2>Magnetic Signs</h2>
            <p>Magnetic signs are legal. They&apos;re popular with owner-operators who lease to different carriers. Just make sure they actually stay on — highway speeds, vibration, and weather can knock them off. Losing your USDOT sign mid-trip means you&apos;re operating without markings until you notice. And if an inspector notices first...</p>

            <h2>Common Mistakes</h2>
            <ul>
                <li>Displaying a trade name that doesn&apos;t match your FMCSA registration</li>
                <li>Faded or peeling decals that are no longer readable</li>
                <li>Displaying an old USDOT number from a previous carrier</li>
                <li>Missing markings on one side of the vehicle</li>
            </ul>
            <p>Get good vinyl decals from a local sign shop. $30-$50 per truck. Lasts years. Way cheaper than the violation.</p>
        </BlogPostLayout>
    );
}
