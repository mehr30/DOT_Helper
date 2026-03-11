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
                    <div className={styles.calloutAmber}>
                        <h4>Who does this apply to?</h4>
                        <p>This checklist is for any business that operates vehicles with a <strong>GVWR</strong> (Gross Vehicle Weight Rating — the max weight your vehicle is designed to carry; check the sticker inside the driver&apos;s door) <strong>over 10,001 lbs</strong>. That includes trucks, vans, trailers, and vehicle-plus-trailer combos. If you operate across state lines, you&apos;re subject to <strong>FMCSA</strong> (Federal Motor Carrier Safety Administration) rules.</p>
                    </div>

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
                        <li><strong>Operating Authority</strong> — If you&apos;re hauling other people&apos;s freight across state lines, you need operating authority on top of your USDOT number. It costs $300 and takes about a month to process. (Note: FMCSA is phasing out separate MC numbers — your USDOT number is becoming the single identifier for both safety and authority.)</li>
                        <li><strong>BOC-3 Filing</strong> — This is just paperwork that says you have a legal representative (called a process agent) in each state. A BOC-3 service handles it for you — usually around $30-50.</li>
                        <li><strong>UCR (Unified Carrier Registration)</strong> — An annual registration fee based on your fleet size. Starts around $176 for small fleets. Due by December 31 each year.</li>
                        <li><strong>MCS-150 Update</strong> — Every two years, you update your company info with the feds. They assign you a month based on your USDOT number. Miss it, and your authority can go inactive.</li>
                        <li><strong>Insurance</strong> — You need at least $750,000 in liability coverage for general freight. Your insurance company files the proof (called a BMC-91) directly with the government.</li>
                        <li><strong>IFTA License</strong> — <strong>IFTA</strong> (International Fuel Tax Agreement) applies if your trucks cross state lines and weigh over 26,001 lbs or have 3+ axles. File quarterly returns for fuel tax.</li>
                    </ul>

                    <h2>2. Driver Files — The Stuff That Catches People Off Guard</h2>
                    <p>Every driver who operates one of your <strong>CMVs</strong> (commercial motor vehicles — any vehicle over 10,001 lbs GVWR used for business) needs a <strong>DQF</strong> (Driver Qualification File). This is the #1 thing auditors check, and it&apos;s where most companies fall short. For each driver, you need:</p>
                    <ul>
                        <li><strong>Employment application</strong> — Not a one-page form. The DOT version requires 10 years of employment history and 3 years of accident history. Every gap must be accounted for.</li>
                        <li><strong>Driving record (MVR)</strong> — An <strong>MVR</strong> (Motor Vehicle Record — your driver&apos;s official driving history from the state DMV). Pull this every year. If your driver has held licenses in multiple states in the past 3 years, you need MVRs from <em>each</em> state.</li>
                        <li><strong>Road test certificate</strong> — For <strong>CDL</strong> (Commercial Driver&apos;s License) holders, a copy of their valid CDL with the right class and endorsements satisfies this. For non-CDL CMV drivers (10,001–26,000 lbs), you must conduct and document an actual road test.</li>
                        <li><strong>Medical card</strong> — The DOT physical. Required for all drivers operating vehicles over 10,001 lbs GVWR. Good for up to 2 years. When it expires, the driver can&apos;t legally drive your truck until they get a new one. Set a reminder 90 days out.</li>
                        <li><strong>Previous employer checks</strong> — You have to contact their last 3 years of employers and ask about safety history. You have 30 days from hire date to send inquiries.</li>
                        <li><strong>Annual violations certificate</strong> — Once a year, every driver signs a form listing any traffic violations they&apos;ve had in the past 12 months. Even if the list is &quot;none.&quot;</li>
                    </ul>

                    <div className={styles.calloutAmber}>
                        <h4>CDL drivers: additional file requirements</h4>
                        <p>If your drivers hold a CDL (required for vehicles over 26,001 lbs, 16+ passengers, or hazmat), you also need:</p>
                        <ul>
                            <li><strong>Drug &amp; alcohol database check</strong> — Full query through the FMCSA <strong>Clearinghouse</strong> (the federal database that tracks CDL driver drug and alcohol violations) before hiring; annual limited query for every active CDL driver.</li>
                            <li><strong>Clearinghouse consent form</strong> — Written consent from the driver allowing you to run those queries.</li>
                            <li><strong>Previous employer drug &amp; alcohol inquiry</strong> — Separate from the general safety inquiry, this asks past DOT-regulated employers about any drug or alcohol test violations.</li>
                        </ul>
                        <p>These items do <strong>NOT</strong> apply to non-CDL drivers operating vehicles in the 10,001–26,000 lb range.</p>
                    </div>

                    <div className={styles.callout}>
                        <h4>The most common audit finding</h4>
                        <p>Missing or expired items in driver files. Set up automated reminders for CDL expirations, medical card renewals, and annual MVR pulls. Most carriers who fail audits aren&apos;t doing anything wrong — they just forgot to renew something.</p>
                    </div>

                    <h2>3. Hours of Service — How Long Your Drivers Can Drive</h2>
                    <p>If your vehicles need <strong>ELDs</strong> (Electronic Logging Devices — digital systems that track driving time), here&apos;s what you&apos;re responsible for as the company:</p>
                    <ul>
                        <li><strong>ELD in every qualifying truck</strong> — It must be a registered, approved device. Not a phone app (unless it&apos;s a certified one).</li>
                        <li><strong>Review logs daily</strong> — Yes, daily. Look for unidentified driving, missing entries, and anything that doesn&apos;t match up. Don&apos;t wait until the end of the week.</li>
                        <li><strong>Keep supporting documents</strong> — Toll receipts, fuel receipts, delivery receipts. Hold onto them for 6 months.</li>
                        <li><strong>Know the limits</strong> — 11 hours of driving max after 10 hours off. Can&apos;t drive past the 14th hour after coming on duty. 30-minute break required after 8 hours of driving. 60 or 70 total hours in a week depending on your schedule.</li>
                    </ul>
                    <p><strong>HOS</strong> (Hours of Service) violations are one of the top audit findings. The fix is simple: actually look at the logs every day. Most violations happen because nobody was checking.</p>

                    <h2>4. Vehicle Maintenance — The Paperwork Behind the Wrench</h2>
                    <ul>
                        <li><strong>Annual DOT inspection</strong> — Every truck and trailer must pass a thorough inspection once a year by a qualified inspector. Keep the report for 14 months and put the inspection decal on the vehicle.</li>
                        <li><strong>Pre-trip and post-trip inspections (DVIRs)</strong> — <strong>DVIR</strong> stands for Driver Vehicle Inspection Report. Drivers must do a walkaround before and after each trip, checking tires, brakes, lights, mirrors, etc. If they find something wrong, it has to be documented and fixed before the truck goes out again.</li>
                        <li><strong>Written maintenance plan</strong> — You need a schedule for oil changes, brake checks, tire rotations, etc. &quot;We fix stuff when it breaks&quot; doesn&apos;t count.</li>
                        <li><strong>Maintenance records</strong> — Keep records for every vehicle showing what was inspected, what was fixed, and when. Hold onto them for at least 1 year after the vehicle leaves your fleet.</li>
                        <li><strong>Brakes</strong> — Check brake adjustment at every service. Brakes out of adjustment is the single most common vehicle violation at roadside inspections. If there&apos;s one thing to get right, it&apos;s brakes.</li>
                    </ul>

                    <h2>5. Drug &amp; Alcohol Testing — CDL Drivers Only</h2>
                    <div className={styles.calloutAmber}>
                        <h4>CDL drivers only</h4>
                        <p>Federal drug &amp; alcohol testing requirements apply <strong>only</strong> to drivers who hold a CDL and operate CMVs (vehicles over 26,001 lbs, 16+ passengers, or hazmat). If all your drivers operate vehicles under 26,001 lbs without a CDL, you are <strong>not</strong> required to have a federal drug &amp; alcohol testing program — though you may choose to implement a company-wide policy.</p>
                    </div>
                    <p>If you have CDL drivers, here&apos;s what your testing program must include:</p>
                    <ul>
                        <li><strong>Pre-employment drug test</strong> — Every CDL driver must pass a drug test before they start. No exceptions, no &quot;we&apos;ll get to it next week.&quot;</li>
                        <li><strong>Random testing pool</strong> — You need to randomly test 50% of your CDL drivers for drugs and 10% for alcohol each year. Most small fleets join a consortium (a third-party service that pools drivers from multiple companies) to handle this.</li>
                        <li><strong>Supervisor training</strong> — At least one person at your company needs 2 hours of training on recognizing signs of drug/alcohol use (reasonable suspicion training).</li>
                        <li><strong>Post-accident testing</strong> — If there&apos;s a qualifying crash (fatality, injury with a citation, or a towed vehicle with a citation), the CDL driver must be tested.</li>
                        <li><strong>Register with the Clearinghouse</strong> — Sign up at the FMCSA Clearinghouse website. Run queries on CDL drivers, report any violations.</li>
                        <li><strong>Written policy</strong> — Create a drug &amp; alcohol policy, give it to every CDL driver, and get their signature saying they received it.</li>
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
                    <p>That&apos;s exactly what Greenlight USDOT does. We track every item on this checklist, send you reminders before things expire, and keep everything in one place so you&apos;re always ready if an auditor comes knocking.</p>
        </BlogPostLayout>
    );
}
