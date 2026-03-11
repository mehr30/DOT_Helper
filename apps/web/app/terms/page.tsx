import type { Metadata } from "next";
import StaticPageLayout from "../components/StaticPageLayout";

export const metadata: Metadata = {
    title: "Terms of Service — Greenlight USDOT",
    description: "Greenlight USDOT terms of service. Terms and conditions for using our DOT compliance management platform.",
    alternates: { canonical: "/terms" },
};

export default function TermsPage() {
    return (
        <StaticPageLayout title="Terms of Service" lastUpdated="March 1, 2026">
            <h2>Agreement to Terms</h2>
            <p>By accessing or using Greenlight USDOT (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>

            <h2>Description of Service</h2>
            <p>Greenlight USDOT is a compliance management platform that helps motor carriers track and manage their DOT/FMCSA compliance requirements. The Service includes driver qualification file tracking, vehicle maintenance scheduling, expiration alerts, and compliance guidance.</p>

            <h2>Important Disclaimer</h2>
            <p><strong>Greenlight USDOT is a compliance tracking and management tool — not a law firm or regulatory consultant.</strong> While we strive to provide accurate and up-to-date compliance information, we do not provide legal advice. Federal and state regulations change frequently. It is your responsibility to verify that your compliance practices meet all applicable laws and regulations. Consult a qualified DOT compliance professional or attorney for specific regulatory questions.</p>

            <h2>Account Responsibilities</h2>
            <ul>
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You are responsible for the accuracy of information you enter into the platform</li>
                <li>You must be at least 18 years old to create an account</li>
                <li>One account per company — do not share login credentials between organizations</li>
            </ul>

            <h2>Subscription and Billing</h2>
            <ul>
                <li>Paid plans are billed monthly or annually, depending on your selection</li>
                <li>Free trials last 14 days and do not require a credit card</li>
                <li>You may cancel your subscription at any time — access continues through the end of the billing period</li>
                <li>Refunds are handled on a case-by-case basis — contact us within 30 days of charge</li>
            </ul>

            <h2>Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
                <li>Use the Service for any unlawful purpose</li>
                <li>Share your account with other businesses or organizations</li>
                <li>Attempt to access other users&apos; data</li>
                <li>Reverse engineer, decompile, or attempt to extract source code from the Service</li>
                <li>Use automated tools to scrape or access the Service</li>
            </ul>

            <h2>Data Ownership</h2>
            <p>You retain ownership of all data you enter into the platform (driver records, vehicle information, company details, etc.). We do not claim ownership of your data. See our Privacy Policy for details on how we handle your information.</p>

            <h2>Service Availability</h2>
            <p>We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. We may perform scheduled maintenance with advance notice. We are not liable for losses resulting from service interruptions.</p>

            <h2>Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Greenlight USDOT shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to fines, penalties, or violations resulting from reliance on the Service. Our total liability shall not exceed the amount you paid for the Service in the 12 months preceding the claim.</p>

            <h2>Termination</h2>
            <p>We may suspend or terminate your account if you violate these terms. You may terminate your account at any time through your dashboard settings or by contacting us.</p>

            <h2>Changes to Terms</h2>
            <p>We may update these terms from time to time. We will notify you of material changes via email or in-app notification. Continued use after changes constitutes acceptance.</p>

            <h2>Contact</h2>
            <p>Questions about these terms? Contact us at <a href="mailto:legal@greenlightusdot.com">legal@greenlightusdot.com</a>.</p>
        </StaticPageLayout>
    );
}
