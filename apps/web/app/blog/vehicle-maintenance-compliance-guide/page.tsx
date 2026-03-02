import Link from "next/link";
import { Truck, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import styles from "../blog.module.css";

export const metadata: Metadata = {
    title: "Complete Guide to DOT Vehicle Maintenance & Inspection Compliance (2026)",
    description: "Everything fleet owners need to know about DOT vehicle maintenance requirements. Covers annual inspections, DVIRs, preventive maintenance programs, and Part 396 compliance.",
    alternates: { canonical: "/blog/vehicle-maintenance-compliance-guide" },
    openGraph: { title: "DOT Vehicle Maintenance & Inspection Compliance Guide", description: "Complete guide to Part 396 vehicle maintenance requirements for motor carriers.", type: "article", publishedTime: "2026-02-20T00:00:00Z" },
};

export default function VehicleMaintenanceGuidePost() {
    return (
        <div className={styles.blogLayout}>
            <nav className={styles.nav}>
                <Link href="/" className={styles.logoLink}><div className={styles.logoIcon}><Truck size={22} /></div><span className={styles.logoText}>DOT Helper</span></Link>
                <div className={styles.navLinks}><Link href="/blog" className={styles.navLink}>← Blog</Link><Link href="/pricing" className={styles.navLink}>Pricing</Link><Link href="/login" className={styles.loginBtn}>Sign In</Link></div>
            </nav>
            <article className={styles.article}>
                <header className={styles.articleHeader}>
                    <div className={styles.articleCategory}>Vehicle Compliance • Pillar Guide</div>
                    <h1 className={styles.articleTitle}>Complete Guide to DOT Vehicle Maintenance &amp; Inspection Compliance</h1>
                    <div className={styles.articleMeta}><span>By DOT Helper Team</span><span>•</span><span>February 20, 2026</span><span>•</span><span>15 min read</span></div>
                </header>
                <div className={styles.articleContent}>
                    <p>Vehicle maintenance isn&apos;t just about keeping your trucks running — it&apos;s a <strong>federal requirement</strong>. Under <strong>FMCSA Part 396</strong>, every motor carrier must systematically inspect, repair, and maintain all commercial motor vehicles under its control. Brake violations alone account for <strong>over 30% of all roadside out-of-service orders</strong>, making vehicle maintenance the single most impactful compliance area for your fleet.</p>
                    <p>This pillar guide covers every aspect of DOT vehicle maintenance compliance and links to deeper guides on specific topics.</p>

                    <h2>Annual DOT Inspections (§396.17)</h2>
                    <p>Every CMV — including tractors, straight trucks, and trailers — must pass an <strong>annual inspection</strong> performed by a qualified inspector. The inspection must cover all items listed in <strong>Appendix G of Part 396</strong>, including:</p>
                    <ul>
                        <li>Brake system (service brakes, parking brake, brake drums/rotors, hoses, tubing)</li>
                        <li>Coupling devices (fifth wheel, pintle hook, drawbar)</li>
                        <li>Exhaust system</li>
                        <li>Fuel system</li>
                        <li>Lighting devices (headlights, tail lights, turn signals, reflectors)</li>
                        <li>Steering mechanism</li>
                        <li>Suspension (springs, U-bolts, air bags)</li>
                        <li>Frame and frame assemblies</li>
                        <li>Tires (wear, inflation, condition)</li>
                        <li>Wheels, rims, and lugs</li>
                        <li>Windshield wipers and glazing</li>
                    </ul>
                    <p>The inspection report must be kept on the vehicle or at the carrier&apos;s principal place of business for <strong>14 months</strong>. A copy of the report or the inspection decal must be displayed on the vehicle.</p>

                    <h2>Driver Vehicle Inspection Reports — DVIRs (§396.11-396.13)</h2>
                    <p>Drivers must complete a written <strong>Driver Vehicle Inspection Report (DVIR)</strong> at the end of each day&apos;s work on every vehicle operated. The DVIR must cover:</p>
                    <ul>
                        <li>Service brakes and parking brake</li>
                        <li>Steering mechanism</li>
                        <li>Lighting devices and reflectors</li>
                        <li>Tires, horn, windshield wipers</li>
                        <li>Rear vision mirrors</li>
                        <li>Coupling devices (for combination vehicles)</li>
                        <li>Wheels and rims</li>
                        <li>Emergency equipment (fire extinguisher, triangles)</li>
                    </ul>
                    <p>If a defect is reported, the carrier must repair it before dispatching the vehicle, and a signed certification of repair must be on the DVIR. Carriers must retain DVIRs for <strong>3 months</strong>.</p>
                    <p><em>Related: <Link href="/blog/dvir-best-practices">DVIR Best Practices: How to Never Fail a Roadside Inspection</Link></em></p>

                    <h2>Preventive Maintenance Programs (§396.3)</h2>
                    <p>Every motor carrier must have a <strong>systematic inspection, repair, and maintenance program</strong> for each vehicle under its control. The program must include:</p>
                    <ul>
                        <li>Regular inspection intervals based on mileage or time</li>
                        <li>A written maintenance schedule for each vehicle</li>
                        <li>Documentation of all inspections and repairs performed</li>
                        <li>Procedures for reporting and correcting defects</li>
                    </ul>
                    <p>There&apos;s no FMCSA-mandated PM interval — carriers set their own based on vehicle type, age, and operating conditions. Common intervals are every <strong>15,000-25,000 miles</strong> or <strong>every 90 days</strong>.</p>
                    <p><em>Related: <Link href="/blog/preventive-maintenance-program-guide">How to Build a DOT-Compliant Preventive Maintenance Program</Link></em></p>

                    <h2>Maintenance Records (§396.3)</h2>
                    <p>For every vehicle, you must maintain records showing:</p>
                    <ul>
                        <li>Identifying information (make, model, year, VIN, license plate)</li>
                        <li>A schedule of inspections to be performed</li>
                        <li>A record of all inspections, repairs, and maintenance performed</li>
                        <li>Date, mileage, and nature of each repair</li>
                    </ul>
                    <p>Records must be retained for <strong>1 year</strong> while the vehicle is active, plus <strong>6 months</strong> after the vehicle is disposed of.</p>

                    <h2>Roadside Inspections</h2>
                    <p>FMCSA and state DOT officers conduct roadside inspections at weigh stations and checkpoints. There are <strong>six levels</strong>:</p>
                    <ul>
                        <li><strong>Level I</strong> — Full inspection (driver + vehicle)</li>
                        <li><strong>Level II</strong> — Walk-around driver/vehicle inspection</li>
                        <li><strong>Level III</strong> — Driver-only inspection (credentials, logs)</li>
                        <li><strong>Level IV</strong> — Special inspections (one-time examination)</li>
                        <li><strong>Level V</strong> — Vehicle-only inspection (without driver present)</li>
                        <li><strong>Level VI</strong> — Enhanced inspection for radioactive shipments</li>
                    </ul>

                    <h2>Top Vehicle Out-of-Service Violations</h2>
                    <ul>
                        <li><strong>Brake adjustment</strong> — Brakes out of adjustment beyond allowed limits</li>
                        <li><strong>Brake hoses/tubing</strong> — Chafed, crimped, or leaking brake lines</li>
                        <li><strong>Tire condition</strong> — Flat, audibly leaking, or below minimum tread depth</li>
                        <li><strong>Lighting</strong> — Inoperable required lamps or missing reflectors</li>
                        <li><strong>Cargo securement</strong> — Improperly secured loads</li>
                    </ul>

                    <div className={styles.callout}>
                        <h4>🔧 Pro Tip: Brake Checks Save You Money</h4>
                        <p>Brake violations are the #1 reason vehicles are put out of service. A 5-minute brake stroke measurement at every PM service can prevent thousands in fines and lost revenue.</p>
                    </div>

                    <div className={styles.articleCta}>
                        <h3>Automate Your Fleet Maintenance Compliance</h3>
                        <p>DOT Helper tracks PM schedules, inspection dates, and DVIR completion for every vehicle in your fleet.</p>
                        <Link href="/pricing" className={styles.articleCtaBtn}>Start Your Free Trial <ArrowRight size={16} /></Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
