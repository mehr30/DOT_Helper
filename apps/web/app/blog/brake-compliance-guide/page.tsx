import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Brake Compliance: The #1 Out-of-Service Violation and How to Fix It", description: "Deep dive into brake compliance for CMVs. Brake adjustment standards, common violations, measurement techniques, and maintaining compliant brakes.", alternates: { canonical: "/blog/brake-compliance-guide" }, openGraph: { title: "Brake Compliance: The #1 Out-of-Service Violation and How to Fix It", description: "Deep dive into brake compliance for CMVs. Brake adjustment standards, common violations, measurement techniques, and maintaining compliant brakes.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Vehicle Compliance" title="Brake Compliance: Why Brakes Are Your Biggest Exposure" date="February 12, 2026" readTime="7 min read" relatedPosts={[{ slug: "vehicle-maintenance-compliance-guide", title: "Vehicle Maintenance Compliance Guide" }, { slug: "common-dot-violations", title: "Common DOT Violations" }]}>
            <p>Brakes account for more out-of-service violations than any other vehicle component. By a lot. Over <strong>35% of all vehicle OOS orders</strong> are brake-related. If you do one thing to reduce your CSA vehicle maintenance score, focus on brakes.</p>

            <h2>The Adjustment Standard</h2>
            <p>For S-cam brakes (the most common type on trucks), the maximum allowable pushrod stroke depends on the brake chamber type and size. Inspectors measure this with the brakes applied.</p>
            <ul>
                <li><strong>Type 30 chamber (long stroke):</strong> Max 2.0&quot; stroke</li>
                <li><strong>Type 30 chamber (standard):</strong> Max 2.0&quot; stroke</li>
                <li><strong>Type 24 chamber (long stroke):</strong> Max 2.0&quot; stroke</li>
                <li><strong>Type 20 chamber:</strong> Max 1.75&quot; stroke</li>
            </ul>
            <p>When more than 20% of the brakes on a vehicle or combination are out of adjustment, it&apos;s an OOS violation. On a typical 5-axle combination with 10 brakes, that means just <strong>3 brakes</strong> out of adjustment = out of service.</p>

            <h2>Why Brakes Go Out of Adjustment</h2>
            <p>Normal drum wear. Every time the brakes are applied, the drum wears slightly, increasing the gap between shoe and drum. Automatic slack adjusters are supposed to compensate, but they don&apos;t always work perfectly — especially in cold weather or when contaminated with road debris.</p>
            <p>The result: brakes that were in spec last month may be out of spec now. That&apos;s why checking at every PM — and ideally at every pre-trip — matters.</p>

            <h2>What Drivers Should Check</h2>
            <p>During pre-trip, drivers should:</p>
            <ol>
                <li>Look at each brake chamber for any obvious issues (cracked, leaking, broken pushrod)</li>
                <li>Listen for air leaks around brake chambers and glad hands</li>
                <li>Check whether the parking brake holds the truck on a grade</li>
                <li>If trained, perform a quick pushrod stroke check (apply brakes, measure travel)</li>
            </ol>

            <h2>Beyond Adjustment</h2>
            <p>Other brake violations that cause OOS orders:</p>
            <ul>
                <li><strong>Brake hose chafing</strong> — rubber lines rubbing on frame, wearing through</li>
                <li><strong>Air leaks</strong> — damaged diaphragms, loose fittings</li>
                <li><strong>Contaminated linings</strong> — oil or grease on brake shoes</li>
                <li><strong>Missing or loose components</strong> — missing cotter pins, cracked chambers</li>
                <li><strong>Low air warning</strong> — buzzer or light not working below 60 PSI</li>
            </ul>
            <p>A 10-minute brake check at every PM service. That&apos;s the investment. The return is avoiding the most common violation in the industry.</p>
        </BlogPostLayout>
    );
}
