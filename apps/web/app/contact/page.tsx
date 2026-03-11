import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, Clock } from "lucide-react";
import StaticPageLayout from "../components/StaticPageLayout";
import styles from "../components/StaticPageLayout.module.css";

export const metadata: Metadata = {
    title: "Contact Greenlight USDOT — Get in Touch",
    description: "Have questions about DOT compliance or Greenlight USDOT? Contact our team for help with your fleet compliance needs.",
    alternates: { canonical: "/contact" },
};

export default function ContactPage() {
    return (
        <StaticPageLayout
            title="Contact Us"
            subtitle="Have a question about DOT compliance or about Greenlight? We're here to help."
        >
            <div className={styles.contactGrid}>
                <div className={styles.contactInfo}>
                    <div className={styles.contactItem}>
                        <Mail size={20} className={styles.contactItemIcon} />
                        <div>
                            <div className={styles.contactItemTitle}>Email</div>
                            <div className={styles.contactItemText}>
                                <a href="mailto:support@greenlightusdot.com">support@greenlightusdot.com</a>
                            </div>
                        </div>
                    </div>
                    <div className={styles.contactItem}>
                        <MessageSquare size={20} className={styles.contactItemIcon} />
                        <div>
                            <div className={styles.contactItemTitle}>In-App Chat</div>
                            <div className={styles.contactItemText}>
                                Log in to your dashboard and use the chat widget for the fastest response.
                            </div>
                        </div>
                    </div>
                    <div className={styles.contactItem}>
                        <Clock size={20} className={styles.contactItemIcon} />
                        <div>
                            <div className={styles.contactItemTitle}>Response Time</div>
                            <div className={styles.contactItemText}>
                                We typically respond within 1 business day. For urgent compliance questions, mention &quot;urgent&quot; in your subject line.
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 style={{ marginTop: 0 }}>Common Questions</h3>
                    <p><strong>Not sure if you need DOT compliance?</strong><br />If you operate vehicles over 10,001 lbs GVWR, you likely do. Check our <Link href="/blog/dot-compliance-checklist">compliance checklist</Link> to see what applies to you.</p>
                    <p><strong>Want to see a demo?</strong><br />Try our platform free for 14 days — no credit card required. <Link href="/register">Start your free trial</Link>.</p>
                    <p><strong>Need help with a specific compliance question?</strong><br />Browse our <Link href="/blog">compliance guides</Link> for step-by-step answers on everything from driver files to drug testing.</p>
                </div>
            </div>
        </StaticPageLayout>
    );
}
