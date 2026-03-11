"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Check,
    ChevronDown,
    ArrowRight,
    Shield,
    Zap,
    Star,
} from "lucide-react";
import GreenlightLogo from "../components/GreenlightLogo";
import Footer from "../components/Footer";
import { createCheckoutSession } from "../actions/stripe";
import styles from "./page.module.css";

const pricingPlans = [
    {
        key: "starter",
        name: "Starter",
        description: "For owner-operators and small fleets getting started with DOT compliance",
        monthlyPrice: 49,
        yearlyPrice: 41, // 2 months free → $490/yr ÷ 12 ≈ $41/mo
        features: [
            "1 to 3 vehicles / drivers",
            "Driver file tracking",
            "Compliance calendar",
            "Automated deadline alerts",
            "Document storage",
            "Plain-language requirement explanations",
        ],
        cta: "Start Free Trial",
        popular: false,
    },
    {
        key: "growth",
        name: "Growth",
        description: "For growing fleets that need audit readiness and automation",
        monthlyPrice: 99,
        yearlyPrice: 83, // 2 months free → $990/yr ÷ 12 ≈ $83/mo
        features: [
            "4 to 15 vehicles / drivers",
            "Everything in Starter",
            "Audit readiness score",
            "Violation history tracking",
            "Employee document e-signing",
        ],
        cta: "Start Free Trial",
        popular: true,
    },
    {
        key: "fleet",
        name: "Fleet",
        description: "For established fleets with multi-location needs and priority support",
        monthlyPrice: 199,
        yearlyPrice: 166, // 2 months free → $1990/yr ÷ 12 ≈ $166/mo
        features: [
            "16+ vehicles / drivers",
            "Everything in Growth",
            "Priority compliance support",
            "Multi-location management",
            "Custom onboarding",
        ],
        cta: "Contact Sales",
        popular: false,
    },
];

const faqs = [
    {
        question: "Is there a free trial?",
        answer: "Yes! All plans include a 14-day free trial with full access to every feature. No credit card required. You can cancel anytime during the trial and you won't be charged.",
    },
    {
        question: "How does annual billing work?",
        answer: "Annual billing gives you 2 months free — that's a ~17% discount. You pay upfront for 10 months instead of 12, and your plan auto-renews annually. You can switch back to monthly at any time.",
    },
    {
        question: "Can I change plans later?",
        answer: "Absolutely. Upgrade or downgrade anytime from your account settings. Changes take effect immediately and we prorate billing differences.",
    },
    {
        question: "Is this really worth $49/month?",
        answer: "One DOT violation can cost $11,000 or more. Our Starter plan costs $588/year. Most customers tell us it pays for itself in the first month just from avoiding a single missed deadline.",
    },
    {
        question: "Is my data secure?",
        answer: "Yes. We use AES-256 encryption for all data at rest and TLS 1.3 in transit. Our infrastructure runs on secure US data centers with daily encrypted backups.",
    },
    {
        question: "Will this actually help me pass a DOT audit?",
        answer: "That's exactly what we built it for. We track every DOT requirement, alert you before deadlines, and keep organized digital records ready for auditors. Many customers report passing audits with zero findings.",
    },
];

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(true);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const handleCheckout = async (planKey: string) => {
        if (planKey === "fleet") {
            window.location.href = "mailto:sales@greenlightusdot.com?subject=Fleet Plan Inquiry";
            return;
        }

        setLoadingPlan(planKey);
        try {
            const result = await createCheckoutSession(planKey, isYearly);
            if (result.url) {
                window.location.href = result.url;
            } else if (result.error) {
                alert(result.error);
            }
        } catch {
            alert("Something went wrong. Please try again.");
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className={styles.pricing}>
            {/* Navigation */}
            <nav className={styles.nav}>
                <Link href="/" className={styles.logoLink}>
                    <GreenlightLogo size={40} />
                    <span className={styles.logoText}>Greenlight USDOT</span>
                </Link>
                <div className={styles.navLinks}>
                    <Link href="/" className={styles.navLink}>Home</Link>
                    <Link href="/features" className={styles.navLink}>Features</Link>
                    <Link href="/blog" className={styles.navLink}>Blog</Link>
                    <Link href="/login" className={styles.loginBtn}>Sign In</Link>
                </div>
            </nav>

            {/* Hero */}
            <div className={styles.hero}>
                <div className={styles.badge}>
                    <Star size={14} />
                    14-Day Free Trial — No Credit Card Required
                </div>
                <h1 className={styles.heroTitle}>
                    One fine from the DOT costs $11,000. Greenlight USDOT costs $49 a month.
                </h1>
                <p className={styles.heroSubtitle}>
                    Choose the plan that fits your fleet. All plans include a 14-day free trial. No credit card required.
                </p>
            </div>

            {/* Toggle */}
            <div className={styles.toggleContainer}>
                <div className={styles.toggle}>
                    <button
                        className={`${styles.toggleOption} ${!isYearly ? styles.active : ""}`}
                        onClick={() => setIsYearly(false)}
                    >
                        Monthly
                    </button>
                    <button
                        className={`${styles.toggleOption} ${isYearly ? styles.active : ""}`}
                        onClick={() => setIsYearly(true)}
                    >
                        Yearly
                    </button>
                    <span className={styles.saveBadge}>2 Months Free</span>
                </div>
            </div>

            {/* Plans Grid */}
            <div className={styles.plansGrid}>
                {pricingPlans.map((plan) => (
                    <div
                        key={plan.key}
                        className={`${styles.planCard} ${plan.popular ? styles.popular : ""}`}
                    >
                        {plan.popular && (
                            <div className={styles.popularBadge}>Most Popular</div>
                        )}
                        <h3 className={styles.planName}>{plan.name}</h3>
                        <p className={styles.planDesc}>{plan.description}</p>
                        <div className={styles.priceRow}>
                            <span className={styles.priceAmount}>
                                ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                            </span>
                            <span className={styles.pricePeriod}>/month</span>
                        </div>
                        <button
                            className={`${styles.planCta} ${plan.popular ? styles.primary : styles.secondary}`}
                            onClick={() => handleCheckout(plan.key)}
                            disabled={loadingPlan === plan.key}
                        >
                            {loadingPlan === plan.key ? "Loading..." : plan.cta}
                            <ArrowRight size={18} />
                        </button>
                        <div className={styles.featureList}>
                            {plan.features.map((feature, idx) => (
                                <div key={idx} className={styles.featureItem}>
                                    <div className={styles.featureIcon}>
                                        <Check size={12} />
                                    </div>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* FAQ */}
            <div className={styles.faqSection}>
                <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
                <div className={styles.faqList}>
                    {faqs.map((faq, idx) => (
                        <div key={idx} className={styles.faqItem}>
                            <button
                                className={styles.faqQuestion}
                                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                            >
                                {faq.question}
                                <ChevronDown
                                    size={18}
                                    className={`${styles.faqChevron} ${expandedFaq === idx ? styles.open : ""}`}
                                />
                            </button>
                            {expandedFaq === idx && (
                                <div className={styles.faqAnswer}>{faq.answer}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className={styles.ctaSection}>
                <h2 className={styles.ctaTitle}>One DOT Violation = $11,000+ in Fines</h2>
                <p className={styles.ctaSubtitle}>
                    Our Starter plan costs $588/year. One violation costs $11,000+. The math is simple. Start your free trial and protect your business today.
                </p>
                <Link href="/register" className={styles.ctaBtn}>
                    Start Your Free Trial
                    <ArrowRight size={18} />
                </Link>
            </div>

            <Footer />
        </div>
    );
}
