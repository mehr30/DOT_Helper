"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Truck,
    Check,
    ChevronDown,
    ArrowRight,
    Shield,
    Zap,
    Star,
} from "lucide-react";
import { createCheckoutSession } from "../actions/stripe";
import styles from "./page.module.css";

const pricingPlans = [
    {
        key: "starter",
        name: "Starter",
        description: "Perfect for owner-operators and small fleets getting started with DOT compliance",
        monthlyPrice: 49,
        yearlyPrice: 39,
        features: [
            "Up to 5 drivers",
            "Up to 10 vehicles",
            "DVIR digital forms",
            "Document storage (5 GB)",
            "Expiration alerts (email)",
            "Basic compliance checklist",
            "Mobile app access",
            "Email support",
        ],
        cta: "Start Free Trial",
        popular: false,
    },
    {
        key: "professional",
        name: "Professional",
        description: "For growing fleets that need full FMCSA compliance management and automation",
        monthlyPrice: 99,
        yearlyPrice: 79,
        features: [
            "Up to 25 drivers",
            "Up to 50 vehicles",
            "Everything in Starter",
            "HOS log management",
            "Drug & alcohol tracking",
            "Driver qualification files",
            "Compliance scoring & reports",
            "State-specific checklists",
            "SMS & email alerts",
            "Document storage (25 GB)",
            "Priority support",
        ],
        cta: "Start Free Trial",
        popular: true,
    },
    {
        key: "enterprise",
        name: "Enterprise",
        description: "For large fleets needing custom solutions, integrations, and a dedicated account team",
        monthlyPrice: 199,
        yearlyPrice: 159,
        features: [
            "Unlimited drivers",
            "Unlimited vehicles",
            "Everything in Professional",
            "ELD integration",
            "Custom compliance reports",
            "API access",
            "Unlimited document storage",
            "Audit preparation toolkit",
            "Dedicated account manager",
            "Phone + chat support",
            "Custom training & onboarding",
        ],
        cta: "Contact Sales",
        popular: false,
    },
];

const faqs = [
    {
        question: "Is there a free trial?",
        answer: "Yes! All plans include a 14-day free trial with full access to all features. No credit card required to start. You can cancel anytime during the trial and you won't be charged.",
    },
    {
        question: "Can I change plans later?",
        answer: "Absolutely. You can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately, and we'll prorate any billing differences.",
    },
    {
        question: "What happens if I exceed my driver or vehicle limit?",
        answer: "We'll notify you when you're approaching your limit. You can upgrade to a higher plan at any time, or contact us for a custom plan that fits your exact needs.",
    },
    {
        question: "Is my data secure?",
        answer: "Yes. We use bank-level AES-256 encryption for all data at rest and TLS 1.3 for data in transit. Our infrastructure is SOC 2 Type II certified, and we perform daily encrypted backups stored in geographically separate US data centers.",
    },
    {
        question: "Do you integrate with ELDs?",
        answer: "Our Professional plan integrates with most major ELD providers including KeepTruckin, Samsara, and Omnitracs. Enterprise customers can also request custom integrations with any ELD or TMS platform.",
    },
    {
        question: "Will this actually help me pass a DOT audit?",
        answer: "Our platform is designed specifically to keep you audit-ready at all times. We track every FMCSA requirement, alert you before deadlines, and maintain organized digital records that are easily accessible if an auditor requests them. Many customers report passing their audits with zero findings.",
    },
];

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(true);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const handleCheckout = async (planKey: string) => {
        if (planKey === "enterprise") {
            window.location.href = "mailto:sales@dothelper.com?subject=Enterprise Plan Inquiry";
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
                    <div className={styles.logoIcon}>
                        <Truck size={22} />
                    </div>
                    <span className={styles.logoText}>DOT Helper</span>
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
                    Simple, Transparent Pricing for DOT Compliance
                </h1>
                <p className={styles.heroSubtitle}>
                    Choose the plan that fits your fleet. All plans include a free trial so you can experience full compliance management before committing.
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
                    <span className={styles.saveBadge}>Save 20%</span>
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
                <h2 className={styles.ctaTitle}>Ready to Simplify DOT Compliance?</h2>
                <p className={styles.ctaSubtitle}>
                    Join thousands of fleet operators who trust DOT Helper to keep them compliant and audit-ready.
                </p>
                <Link href="/register" className={styles.ctaBtn}>
                    Start Your Free Trial
                    <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}
