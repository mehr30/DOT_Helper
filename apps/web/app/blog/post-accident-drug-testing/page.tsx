import BlogPostLayout from "../BlogPostLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Post-Accident Drug & Alcohol Testing: When, How & Documentation", description: "Guide to DOT post-accident drug and alcohol testing. When it's required, testing windows, decision flowchart, and documentation requirements.", alternates: { canonical: "/blog/post-accident-drug-testing" } };

export default function Page() {
    return (
        <BlogPostLayout category="Drug & Alcohol Testing" title="Post-Accident Testing: When You Must Test and When You Don't" date="February 17, 2026" readTime="7 min read" relatedPosts={[{ slug: "drug-alcohol-testing-compliance", title: "Drug & Alcohol Testing Guide" }, { slug: "accident-register-requirements", title: "Accident Register Requirements" }]}>
            <p>Not every accident triggers post-accident testing. But missing one that <em>does</em> require testing? That&apos;s a violation that can follow you for years. The rules are specific — and they trip up carriers who rely on &quot;gut feeling&quot; instead of the actual regulation.</p>

            <h2>When Post-Accident Testing Is Required</h2>
            <p>Under <strong>§382.303</strong>, you must perform post-accident testing on any surviving CMV driver when the accident involves:</p>
            <ul>
                <li><strong>A fatality</strong> — testing required regardless of fault. Period.</li>
                <li><strong>Bodily injury requiring medical treatment away from the scene</strong> AND the driver received a citation — testing required.</li>
                <li><strong>A disabling vehicle damage</strong> (towed from scene) AND the driver received a citation — testing required.</li>
            </ul>
            <p>Key word: <strong>citation</strong>. If there&apos;s a tow but no citation issued to your driver, post-accident testing is not federally required. If someone got hurt and went to the hospital but your driver wasn&apos;t cited, not required.</p>
            <p>Exception: fatality. Fatality = always test. No citation needed.</p>

            <h2>Testing Windows</h2>
            <ul>
                <li><strong>Alcohol test:</strong> Within <strong>2 hours</strong> after the accident. If not tested within 2 hours, document why. If not tested within <strong>8 hours</strong>, stop trying and document why testing wasn&apos;t conducted.</li>
                <li><strong>Drug test:</strong> Within <strong>32 hours</strong> after the accident. If not tested within 32 hours, stop trying and document the reason.</li>
            </ul>
            <p>The 2-hour alcohol window is brutally short, especially in remote areas or when the driver is dealing with police, tow trucks, and medical personnel. That&apos;s why you need a plan in advance — know the nearest collection sites along your routes.</p>

            <h2>Best Practices</h2>
            <ol>
                <li>Instruct drivers to <strong>contact you immediately</strong> after any accident — before talking to anyone else (except police/medical if needed).</li>
                <li>Keep a list of 24-hour collection sites or mobile collectors in your operating area.</li>
                <li>Make the &quot;test or no test&quot; decision quickly — use the flowchart, not your instinct.</li>
                <li>Document everything: time of accident, decision to test, time of collection, results.</li>
                <li>If testing can&apos;t happen within the window, write a detailed memo explaining why.</li>
            </ol>

            <h2>Company Policy vs Federal Requirement</h2>
            <p>Your company policy can be stricter than the federal rule. Many carriers adopt a &quot;test after every accident&quot; policy to avoid the judgment call. It costs more in testing fees but eliminates any ambiguity. Consider whether the simplicity is worth the extra cost.</p>
        </BlogPostLayout>
    );
}
