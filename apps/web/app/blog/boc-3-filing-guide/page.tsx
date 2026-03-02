import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "BOC-3 Filing: What It Is and Why You Can't Operate Without It", description: "Guide to BOC-3 process agent filing requirements for motor carriers. What it is, how to file, costs, and what happens if your BOC-3 lapses.", alternates: { canonical: "/blog/boc-3-filing-guide" } };

export default function Page() {
    return (
        <BlogPostLayout category="Compliance" title="BOC-3 Filing: What It Is and Why Your Authority Depends on It" date="February 16, 2026" readTime="5 min read" relatedPosts={[{ slug: "dot-compliance-checklist", title: "The Ultimate DOT Compliance Checklist" }, { slug: "fmcsa-operating-authority-guide", title: "FMCSA Operating Authority Guide" }]}>
            <p>Most carriers know they need a USDOT number and an MC number. But ask them about their BOC-3? Blank stares. Until their authority gets held up because the filing lapsed.</p>

            <h2>What&apos;s a BOC-3?</h2>
            <p>A BOC-3 is a legal filing that designates <strong>process agents</strong> in every state where you operate (or, more practically, in all US states plus DC). A process agent is someone authorized to accept legal documents on your behalf — think lawsuits, government notices, that kind of thing.</p>
            <p>It&apos;s required under <strong>49 CFR Part 366</strong> before FMCSA will grant you operating authority.</p>

            <h2>How to File</h2>
            <p>You can&apos;t file a BOC-3 yourself. You need a blanket service provider — a company that has agents in every state. Typical cost: <strong>$30-$75 one-time</strong> through a filing service. Some charge annual renewals of $15-30.</p>
            <p>The filing company submits the form electronically to FMCSA. It shows up in your SAFER record within a few days.</p>

            <h2>What Happens If It Lapses?</h2>
            <p>If your BOC-3 becomes inactive — say your filing service goes out of business or you forget to renew — FMCSA can revoke your operating authority. We&apos;ve seen carriers lose their MC number over a $30 filing they forgot about. Don&apos;t let that be you.</p>
            <p>Check your BOC-3 status annually at <em>safer.fmcsa.dot.gov</em>. Takes 30 seconds.</p>
        </BlogPostLayout>
    );
}
