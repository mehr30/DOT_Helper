import type { Metadata } from "next";
import StaticPageLayout from "../components/StaticPageLayout";

export const metadata: Metadata = {
    title: "Privacy Policy — Greenlight USDOT",
    description: "Greenlight USDOT privacy policy. How we collect, use, and protect your information.",
    alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
    return (
        <StaticPageLayout title="Privacy Policy" lastUpdated="March 1, 2026">
            <h2>Overview</h2>
            <p>Greenlight USDOT (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>

            <h2>Information We Collect</h2>
            <h3>Account Information</h3>
            <p>When you create an account, we collect your name, email address, company name, and password. If you subscribe to a paid plan, we collect payment information through our payment processor (Stripe) — we do not store your credit card details directly.</p>

            <h3>Driver and Vehicle Data</h3>
            <p>To provide compliance tracking services, we store information you enter about your drivers (names, CDL numbers, medical card expiration dates, etc.) and vehicles (VINs, inspection dates, maintenance records, etc.). This data is used solely to provide our compliance management services to you.</p>

            <h3>Usage Data</h3>
            <p>We automatically collect information about how you interact with our platform, including pages visited, features used, and time spent. This helps us improve the product.</p>

            <h2>How We Use Your Information</h2>
            <ul>
                <li>Provide and maintain our compliance management services</li>
                <li>Send you compliance alerts, expiration reminders, and account notifications</li>
                <li>Process payments and manage your subscription</li>
                <li>Improve our platform and develop new features</li>
                <li>Respond to your support requests</li>
                <li>Send product updates and announcements (you can opt out)</li>
            </ul>

            <h2>Data Sharing</h2>
            <p>We do not sell your personal information or driver/vehicle data. We share information only with:</p>
            <ul>
                <li><strong>Service providers</strong> who help us operate our platform (hosting, email, payment processing)</li>
                <li><strong>Legal authorities</strong> when required by law or to protect our rights</li>
            </ul>

            <h2>Data Security</h2>
            <p>We use industry-standard security measures to protect your data, including encryption in transit (TLS) and at rest, secure authentication, and access controls. Your driver and vehicle data is stored in encrypted databases with access limited to authorized systems.</p>

            <h2>Data Retention</h2>
            <p>We retain your data for as long as your account is active. If you cancel your account, we retain your data for 90 days in case you reactivate, then permanently delete it. You can request immediate deletion by contacting us.</p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
                <li>Access and download your data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
            </ul>

            <h2>Contact</h2>
            <p>Questions about this policy? Contact us at <a href="mailto:privacy@greenlightusdot.com">privacy@greenlightusdot.com</a>.</p>
        </StaticPageLayout>
    );
}
