import Link from "next/link";
import type { Metadata } from "next";
import BlogPostLayout from "../BlogPostLayout";
import styles from "../blog.module.css";

export const metadata: Metadata = {
    title: "The Ultimate DOT Compliance Checklist for Small Businesses (2026)",
    description: "Complete DOT compliance checklist for small fleet owners. Cover every FMCSA requirement from driver qualification files to vehicle inspections and stay audit-ready.",
    alternates: { canonical: "/blog/dot-compliance-checklist" },
    openGraph: {
        title: "The Ultimate DOT Compliance Checklist for Small Businesses (2026)",
        description: "Complete DOT compliance checklist for small fleet owners covering every FMCSA requirement.",
        type: "article",
        publishedTime: "2026-03-01T00:00:00Z",
    },
};

export default function DotComplianceChecklistPost() {
    return (
        <BlogPostLayout
            category="Compliance"
            title="The Ultimate DOT Compliance Checklist for Small Businesses in 2026"
            date="March 1, 2026"
            readTime="12 min read"
            relatedPosts={[
                { slug: "fmcsa-compliance-guide", title: "FMCSA Compliance Guide" },
                { slug: "how-to-pass-dot-audit", title: "How to Pass a DOT Audit" },
            ]}
        >
                    <p>
                        If you run trucks commercially — whether that&apos;s hauling freight, towing equipment to job sites, or sending service vehicles out — there&apos;s a list of federal requirements you need to meet. Miss one, and you could be looking at fines up to <strong>$16,864 per violation</strong>, vehicles pulled off the road, or worse.
                    </p>
                    <p>
                        This checklist breaks it all down into plain English. Think of it as your &quot;did I forget anything?&quot; reference.
                    </p>

                    <h2>1. Get Your Company Registered</h2>
                    <p>Before a single truck hits the road, you need the right registrations. Here&apos;s the short list:</p>
                    <ul>
                        <li><strong>USDOT Number</strong> — This is basically your company&apos;s ID number for trucking. It&apos;s free to get at <em>fmcsa.dot.gov</em>. Every commercial carrier needs one.</li>
                        <li><strong>MC Number (Operating Authority)</strong> — If you&apos;re hauling other people&apos;s freight across state lines, you need this on top of your USDOT. It costs $300 and takes about a month to process.</li>
                        <li><strong>BOC-3 Filing</strong> — This is just paperwork that says you have a legal representative in each state. A BOC-3 service handles it for you — usually around $30-50.</li>
                        <li><strong>UCR (Unified Carrier Registration)</strong> — An annual registration fee based on your fleet size. Starts around $176 for small fleets. Due by December 31 each year.</li>
                        <li><strong>MCS-150 Update</strong> — Every two years, you update your company info with the feds. They assign you a month based on your USDOT number. Miss it, and your authority can go inactive.</li>
                        <li><strong>Insurance</strong> — You need at least $750,000 in liability coverage for general freight. Your insurance company files the proof (called a BMC-91) directly with the government.</li>
                        <li><strong>IFTA License</strong> — If your trucks cross state lines, you need this for fuel tax reporting. File quarterly returns.</li>
                    </ul>

                    <h2>2. Driver Files — The Stuff That Catches People Off Guard</h2>
                    <p>Every driver who operates one of your commercial vehicles needs a qualification file. This is the #1 thing auditors check, and it&apos;s where most companies fall short. For each driver, you need:</p>
                    <ul>
                        <li><strong>Employment application</strong> — Not a one-page form. The DOT version requires 10 years of employment history and 3 years of accident history. Yes, really.</li>
                        <li><strong>Driving record (MVR)</strong> — Pull this from the DMV every year. If your driver has held licenses in multiple states in the past 3 years, you need MVRs from <em>each</em> state.</li>
                        <li><strong>Road test certificate</strong> — Or a copy of their valid CDL with the right class and endorsements, which most people use instead.</li>
                        <li><strong>Medical card</strong> — The DOT physical. Good for up to 2 years. When it expires, the driver can&apos;t legally drive your truck until they get a new one. Set a reminder 90 days out.</li>
                        <li><strong>Previous employer checks</strong> — You have to contact their last 3 years of employers and ask about safety history and drug/alcohol testing. This includes checking the FMCSA&apos;s drug and alcohol database.</li>
                        <li><strong>Annual violations certificate</strong> — Once a year, every driver signs a form listing any traffic violations they&apos;ve had in the past 12 months. Even if the list is &quot;none.&quot;</li>
                        <li><strong>Drug &amp; alcohol database check</strong> — Full query before hiring; annual check for every active driver. This is done through the FMCSA Clearinghouse website.</li>
                    </ul>

                    <div className={styles.callout}>
                        <h4>💡 The Most Common Audit Finding</h4>
                        <p>Missing or expired items in driver files. Set up automated reminders for CDL expirations, medical card renewals, and annual MVR pulls. Most carriers who fail audits aren&apos;t doing anything wrong — they just forgot to renew something.</p>
                    </div>

                    <h2>3. Hours of Service — How Long Your Drivers Can Drive</h2>
                    <p>If your vehicles need electronic logging devices (ELDs), here&apos;s what you&apos;re responsible for as the company:</p>
                    <ul>
                        <li><strong>ELD in every qualifying truck</strong> — It must be a registered, approved device. Not a phone app (unless it&apos;s a certified one).</li>
                        <li><strong>Review logs daily</strong> — Yes, daily. Look for unidentified driving, missing entries, and anything that doesn&apos;t match up. Don&apos;t wait until the end of the week.</li>
                        <li><strong>Keep supporting documents</strong> — Toll receipts, fuel receipts, delivery receipts. Hold onto them for 6 months.</li>
                        <li><strong>Know the limits</strong> — 11 hours of driving max after 10 hours off. Can&apos;t drive past the 14th hour after coming on duty. 30-minute break required after 8 hours of driving. 60 or 70 total hours in a week depending on your schedule.</li>
                    </ul>
                    <p>HOS violations are one of the top audit findings. The fix is simple: actually look at the logs every day. Most violations happen because nobody was checking.</p>

                    <h2>4. Vehicle Maintenance — The Paperwork Behind the Wrench</h2>
                    <ul>
                        <li><strong>Annual DOT inspection</strong> — Every truck and trailer must pass a thorough inspection once a year by a qualified inspector. Keep the report for 14 months and put the inspection decal on the vehicle.</li>
                        <li><strong>Pre-trip and post-trip inspections (DVIRs)</strong> — Drivers must do a walkaround before and after each trip, checking tires, brakes, lights, mirrors, etc. If they find something wrong, it has to be documented and fixed before the truck goes out again.</li>
                        <li><strong>Written maintenance plan</strong> — You need a schedule for oil changes, brake checks, tire rotations, etc. &quot;We fix stuff when it breaks&quot; doesn&apos;t count.</li>
                        <li><strong>Maintenance records</strong> — Keep records for every vehicle showing what was inspected, what was fixed, and when. Hold onto them for at least 1 year after the vehicle leaves your fleet.</li>
                        <li><strong>Brakes</strong> — Check brake adjustment at every service. Brakes out of adjustment is the single most common vehicle violation at roadside inspections. If there&apos;s one thing to get right, it&apos;s brakes.</li>
                    </ul>

                    <h2>5. Drug &amp; Alcohol Testing — Yes, This Applies to You</h2>
                    <p>If your drivers need a CDL, or if your vehicles are over 26,001 lbs, you need a drug and alcohol testing program. Here&apos;s what that means:</p>
                    <ul>
                        <li><strong>Test before hiring</strong> — Every driver must pass a drug test before they start. No exceptions, no &quot;we&apos;ll get to it next week.&quot;</li>
                        <li><strong>Random testing pool</strong> — You need to randomly test 50% of your drivers for drugs and 10% for alcohol each year. Most small fleets join a consortium (a third-party service) to handle this.</li>
                        <li><strong>Supervisor training</strong> — At least one person at your company needs 2 hours of training on recognizing signs of drug/alcohol use.</li>
                        <li><strong>Post-accident testing</strong> — If there&apos;s a serious crash (fatality, injury with a citation, or a towed vehicle with a citation), the driver must be tested.</li>
                        <li><strong>Register with the FMCSA database</strong> — Sign up at the FMCSA Clearinghouse website. Run queries on drivers, report any violations.</li>
                        <li><strong>Written policy</strong> — Create a drug &amp; alcohol policy, give it to every driver, and get their signature saying they received it.</li>
                    </ul>

                    <h2>6. Don&apos;t Forget Your State</h2>
                    <p>Federal rules are the floor, not the ceiling. Your state might add requirements on top:</p>
                    <ul>
                        <li>Some states require a separate state DOT registration</li>
                        <li>State-specific vehicle inspection programs</li>
                        <li>Emissions requirements (California, we&apos;re looking at you)</li>
                        <li>Oversize/overweight permits</li>
                        <li>State fuel taxes beyond IFTA</li>
                    </ul>
                    <p>Our <Link href="/dashboard/documents/wizard">Compliance Setup wizard</Link> asks where you operate and flags state-specific requirements automatically.</p>

                    <h2>Feeling Overwhelmed? That&apos;s Normal.</h2>
                    <p>
                        The first time you see this list, it feels like a lot. That&apos;s because it <em>is</em> a lot. But most of it is just staying organized — knowing what&apos;s due, when it&apos;s due, and where to find the paperwork when someone asks for it.
                    </p>
                    <p>That&apos;s exactly what Greenlight DOT does. We track every item on this checklist, send you reminders before things expire, and keep everything in one place so you&apos;re always ready if an auditor comes knocking.</p>
        </BlogPostLayout>
    );
}
