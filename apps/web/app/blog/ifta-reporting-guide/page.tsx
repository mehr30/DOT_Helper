import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "IFTA Reporting Guide for Small Fleets: Quarterly Filing Made Simple", description: "Step-by-step guide to IFTA fuel tax reporting for trucking companies. Covers registration, quarterly filing, record keeping, and avoiding common mistakes.", alternates: { canonical: "/blog/ifta-reporting-guide" }, openGraph: { title: "IFTA Reporting Guide: Quarterly Filing Made Simple", description: "Step-by-step guide to IFTA fuel tax reporting for trucking companies. Covers registration, quarterly filing, record keeping, and avoiding common mistakes.", type: "article" } };

export default function Page() {
    return (
        <BlogPostLayout category="Compliance" title="IFTA Reporting for Small Fleets: A No-Nonsense Guide" date="February 10, 2026" readTime="7 min read" relatedPosts={[{ slug: "dot-compliance-checklist", title: "The Ultimate DOT Compliance Checklist" }, { slug: "dot-compliance-costs-fines", title: "DOT Compliance Costs & Fines" }]}>
            <p>IFTA. Four letters that make most owner-operators groan. But the International Fuel Tax Agreement doesn&apos;t have to be a nightmare. Once you understand the basics, quarterly filing takes about an hour. Maybe less.</p>

            <h2>Do You Need an IFTA License?</h2>
            <p>Yes, if you operate a <strong>qualified motor vehicle</strong> (26,001+ lbs GVWR, or 3+ axles regardless of weight, or combination vehicle over 26,000 lbs) in <strong>two or more IFTA jurisdictions</strong>. Basically: if you drive a semi across state lines, you need IFTA.</p>
            <p>Exceptions: government vehicles, recreational vehicles, and vehicles under the weight threshold operating intrastate only.</p>

            <h2>How IFTA Works</h2>
            <p>Here&apos;s the deal. Each state charges a different fuel tax per gallon. IFTA lets you file one quarterly report with your base state, which then redistributes your fuel tax payments to every state you drove through.</p>
            <p>You report total miles driven and total fuel purchased in each state. The system calculates what you owe (or what&apos;s owed back to you) based on where you drove versus where you bought fuel.</p>

            <h2>What You Need to Track</h2>
            <ul>
                <li><strong>Miles driven per state</strong> — Your ELD or GPS should give you this data.</li>
                <li><strong>Fuel purchased per state</strong> — Keep every receipt. IFTA requires state, date, gallons, and fuel type.</li>
                <li><strong>Total fleet miles and total gallons</strong> — These calculate your fleet MPG, which is the basis for tax allocation.</li>
            </ul>
            <p>Records must be kept for <strong>4 years</strong> from the due date of the return. Pro tip: scan your fuel receipts and store them digitally. Paper receipts fade, get lost, and catch fire.</p>

            <h2>Filing Deadlines</h2>
            <ul>
                <li>Q1 (Jan-Mar): Due <strong>April 30</strong></li>
                <li>Q2 (Apr-Jun): Due <strong>July 31</strong></li>
                <li>Q3 (Jul-Sep): Due <strong>October 31</strong></li>
                <li>Q4 (Oct-Dec): Due <strong>January 31</strong></li>
            </ul>
            <p>Late filing incurs a <strong>$50 penalty or 10% of the net tax liability</strong>, whichever is greater, plus interest. Some states pile on their own late fees too.</p>

            <h2>Common IFTA Mistakes</h2>
            <ul>
                <li><strong>Not keeping fuel receipts</strong> — No receipt = no credit for fuel purchased in that state. You end up paying tax twice.</li>
                <li><strong>Using trip miles instead of actual miles</strong> — Use odometer readings or GPS data, not estimated route miles.</li>
                <li><strong>Forgetting unladen miles</strong> — Deadhead miles still count. Report all miles, loaded or not.</li>
                <li><strong>Missing the quarterly deadline</strong> — Set calendar reminders 2 weeks before each deadline.</li>
            </ul>
        </BlogPostLayout>
    );
}
