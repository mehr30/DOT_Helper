"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Truck,
  Shield,
  CheckCircle,
  Clock,
  FileText,
  Users,
  ArrowRight,
  BarChart3,
  Bell,
  Zap,
  Star,
  Menu,
  X,
  Check,
  Quote
} from "lucide-react";
import styles from "./page.module.css";

const features = [
  {
    icon: Users,
    title: "Driver Qualification Files",
    description: "Track CDLs, medical cards, MVRs, and all required driver documentation with automated expiration alerts."
  },
  {
    icon: Clock,
    title: "Hours of Service",
    description: "Monitor HOS compliance in real-time, track driving hours, and prevent violations before they happen."
  },
  {
    icon: Shield,
    title: "Clearinghouse Integration",
    description: "Manage pre-employment and annual queries, track driver consent, and maintain FMCSA compliance."
  },
  {
    icon: Truck,
    title: "Vehicle Inspections",
    description: "Schedule DOT inspections, capture DVIRs digitally, and maintain complete maintenance histories."
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Secure cloud storage for all compliance documents with version control and instant access."
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get notified 90, 60, 30, and 7 days before any document or certification expires."
  }
];

const stats = [
  { value: "$16,864", label: "Max fine per DOT violation" },
  { value: "7", label: "BASIC categories scored" },
  { value: "12+", label: "Documents per driver" },
  { value: "24/7", label: "Compliance monitoring" }
];

const testimonials = [
  {
    quote: "DOT Helper saved us from a $12,000 fine by alerting us to an expiring medical card. This software pays for itself.",
    author: "Mike Rodriguez",
    role: "Owner, Rodriguez Trucking LLC",
    company: "8 Trucks • Texas",
    rating: 5
  },
  {
    quote: "We had no idea our HVAC vans needed DOT compliance until we got a violation. DOT Helper made it easy to get everything organized.",
    author: "Sarah Chen",
    role: "Operations Manager, Chen Heating & Air",
    company: "12 Service Vans • California",
    rating: 5
  },
  {
    quote: "As a plumbing company with 20+ vehicles, DOT compliance was a nightmare. Now we handle everything in one place.",
    author: "James Thompson",
    role: "Fleet Manager, Thompson Plumbing",
    company: "22 Vehicles • Georgia",
    rating: 5
  }
];

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for owner-operators and small fleets",
    price: "49",
    period: "month",
    features: [
      "Up to 5 drivers",
      "Up to 10 vehicles",
      "Driver qualification file tracking",
      "Document storage (5GB)",
      "Expiration alerts",
      "Email support"
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Professional",
    description: "For growing fleets that need more power",
    price: "99",
    period: "month",
    features: [
      "Up to 25 drivers",
      "Up to 50 vehicles",
      "Everything in Starter",
      "Mobile DVIR app access",
      "Clearinghouse integration",
      "HOS monitoring",
      "Document storage (25GB)",
      "Priority support"
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    description: "For larger fleets with advanced needs",
    price: "199",
    period: "month",
    features: [
      "Unlimited drivers",
      "Unlimited vehicles",
      "Everything in Professional",
      "ELD integration",
      "Custom reports",
      "API access",
      "Unlimited storage",
      "Dedicated account manager",
      "Phone support"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

const faqs = [
  {
    question: "Is there a free trial?",
    answer: "Yes! All plans include a 14-day free trial with full access to all features. No credit card required to start."
  },
  {
    question: "Can I change plans later?",
    answer: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle."
  },
  {
    question: "How does the mobile app work?",
    answer: "Our mobile app allows drivers to complete DVIRs, view their documents, and receive alerts on the go. It works offline and syncs when connected."
  },
  {
    question: "Is my data secure?",
    answer: "We use bank-level encryption (AES-256) and are SOC 2 compliant. Your data is backed up daily and stored in secure US data centers."
  }
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={styles.landing}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Truck size={24} />
            </div>
            <span>DOT Helper</span>
          </Link>

          {/* Desktop Nav */}
          <div className={styles.navLinks}>
            <Link href="#features" className={styles.navLink}>Features</Link>
            <Link href="#pricing" className={styles.navLink}>Pricing</Link>
            <Link href="/blog" className={styles.navLink}>Resources</Link>
            <Link href="#testimonials" className={styles.navLink}>Testimonials</Link>
            <Link href="/login" className={styles.navLink}>Login</Link>
            <Link href="/register" className={styles.navLinkPrimary}>
              Get Started <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <Link href="#features" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="#pricing" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link href="/blog" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Resources</Link>
            <Link href="#testimonials" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Testimonials</Link>
            <Link href="/login" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Login</Link>
            <Link href="/register" className={styles.mobileNavPrimary} onClick={() => setMobileMenuOpen(false)}>
              Start Free Trial
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGlow} />
          <div className={styles.heroGlow2} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Zap size={14} />
            <span>Trusted by 500+ trucking companies</span>
          </div>
          <h1 className={styles.heroTitle}>
            Stay DOT Compliant,<br />
            <span className={styles.heroGradient}>Without the Headache</span>
          </h1>
          <p className={styles.heroDescription}>
            The all-in-one compliance management platform for any business with commercial vehicles.
            From trucking fleets to HVAC, plumbing, electrical, and landscaping companies —
            track driver qualifications, HOS, vehicle inspections, and never miss a deadline.
          </p>
          <div className={styles.heroCta}>
            <Link href="/register" className={styles.ctaPrimary}>
              Start Free Trial
              <ArrowRight size={18} />
            </Link>
            <Link href="#features" className={styles.ctaSecondary}>
              See Features
            </Link>
          </div>
          <div className={styles.heroStats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.heroStat}>
                <span className={styles.heroStatValue}>{stat.value}</span>
                <span className={styles.heroStatLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className={styles.socialProof}>
        <div className={styles.socialProofContent}>
          <span className={styles.socialProofLabel}>Helping businesses across America stay DOT compliant</span>
          <div className={styles.socialProofLogos}>
            <span>🚛 500+ Businesses</span>
            <span>🛡️ 10,000+ Drivers</span>
            <span>🔧 HVAC • Plumbing • Electrical</span>
            <span>⭐ 4.9/5 Rating</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.featuresContainer}>
          <div className={styles.featuresHeader}>
            <span className={styles.featuresLabel}>Features</span>
            <h2 className={styles.featuresTitle}>
              Everything you need for DOT compliance
            </h2>
            <p className={styles.featuresDescription}>
              From driver files to vehicle inspections, we cover every aspect of
              FMCSA compliance so you can focus on running your business.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <Icon size={24} />
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={styles.testimonials}>
        <div className={styles.testimonialsContainer}>
          <div className={styles.testimonialsHeader}>
            <span className={styles.testimonialsLabel}>Testimonials</span>
            <h2 className={styles.testimonialsTitle}>
              Loved by fleet owners everywhere
            </h2>
          </div>

          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className={styles.testimonialCard}>
                <div className={styles.testimonialRating}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <Quote size={24} className={styles.quoteIcon} />
                <p className={styles.testimonialQuote}>{testimonial.quote}</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>
                    {testimonial.author.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>{testimonial.author}</span>
                    <span className={styles.authorRole}>{testimonial.role}</span>
                    <span className={styles.authorCompany}>{testimonial.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.pricingContainer}>
          <div className={styles.pricingHeader}>
            <span className={styles.pricingLabel}>Pricing</span>
            <h2 className={styles.pricingTitle}>
              Simple, transparent pricing
            </h2>
            <p className={styles.pricingDescription}>
              Start your 14-day free trial today. No credit card required.
            </p>
          </div>

          <div className={styles.pricingGrid}>
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`${styles.pricingCard} ${plan.popular ? styles.pricingPopular : ""}`}
              >
                {plan.popular && <span className={styles.popularBadge}>Most Popular</span>}
                <h3 className={styles.planName}>{plan.name}</h3>
                <p className={styles.planDescription}>{plan.description}</p>
                <div className={styles.planPrice}>
                  <span className={styles.priceCurrency}>$</span>
                  <span className={styles.priceAmount}>{plan.price}</span>
                  <span className={styles.pricePeriod}>/{plan.period}</span>
                </div>
                <ul className={styles.planFeatures}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={styles.planFeature}>
                      <Check size={16} className={styles.checkIcon} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === "Enterprise" ? "/contact" : "/register"}
                  className={`${styles.planCta} ${plan.popular ? styles.planCtaPopular : ""}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.faqContainer}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            {faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{faq.question}</h3>
                <p className={styles.faqAnswer}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <div className={styles.benefitsContainer}>
          <div className={styles.benefitsContent}>
            <span className={styles.benefitsLabel}>Why DOT Helper?</span>
            <h2 className={styles.benefitsTitle}>
              Compliance made simple for small fleets
            </h2>
            <ul className={styles.benefitsList}>
              <li className={styles.benefitItem}>
                <CheckCircle size={20} className={styles.benefitIcon} />
                <span>Reduce audit stress with organized, accessible records</span>
              </li>
              <li className={styles.benefitItem}>
                <CheckCircle size={20} className={styles.benefitIcon} />
                <span>Prevent costly violations with automated expiration alerts</span>
              </li>
              <li className={styles.benefitItem}>
                <CheckCircle size={20} className={styles.benefitIcon} />
                <span>Save hours of paperwork with digital document management</span>
              </li>
              <li className={styles.benefitItem}>
                <CheckCircle size={20} className={styles.benefitIcon} />
                <span>Track your compliance score and know where you stand</span>
              </li>
              <li className={styles.benefitItem}>
                <CheckCircle size={20} className={styles.benefitIcon} />
                <span>Mobile app for drivers to submit DVIRs on the go</span>
              </li>
            </ul>
            <Link href="/register" className={styles.benefitsCta}>
              Get Started Today <ArrowRight size={18} />
            </Link>
          </div>
          <div className={styles.benefitsVisual}>
            <div className={styles.dashboardPreview}>
              <div className={styles.previewHeader}>
                <div className={styles.previewDots}>
                  <span /><span /><span />
                </div>
              </div>
              <div className={styles.previewContent}>
                <div className={styles.previewScore}>
                  <BarChart3 size={32} />
                  <span>87% Compliant</span>
                </div>
                <div className={styles.previewCards}>
                  <div className={styles.previewCard}>
                    <Users size={16} />
                    <span>12 Drivers</span>
                  </div>
                  <div className={styles.previewCard}>
                    <Truck size={16} />
                    <span>8 Vehicles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>
            Ready to simplify your DOT compliance?
          </h2>
          <p className={styles.ctaDescription}>
            Join hundreds of businesses who trust DOT Helper for their fleet compliance. Start your free trial today.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/register" className={styles.ctaPrimaryLarge}>
              Start Your Free Trial
              <ArrowRight size={20} />
            </Link>
            <Link href="/contact" className={styles.ctaSecondaryLarge}>
              Contact Sales
            </Link>
          </div>
          <p className={styles.ctaNote}>No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerBrand}>
            <Link href="/" className={styles.footerLogo}>
              <div className={styles.logoIcon}>
                <Truck size={20} />
              </div>
              <span>DOT Helper</span>
            </Link>
            <p className={styles.footerTagline}>
              Simplifying DOT compliance for any business with commercial vehicles — trucking, home services, and beyond.
            </p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4>Product</h4>
              <Link href="#features">Features</Link>
              <Link href="#pricing">Pricing</Link>
              <Link href="/blog">Compliance Guides</Link>
              <Link href="/mobile">Mobile App</Link>
            </div>
            <div className={styles.footerColumn}>
              <h4>Company</h4>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/careers">Careers</Link>
            </div>
            <div className={styles.footerColumn}>
              <h4>Resources</h4>
              <Link href="/help">Help Center</Link>
              <Link href="/guides">Compliance Guides</Link>
              <Link href="/webinars">Webinars</Link>
            </div>
            <div className={styles.footerColumn}>
              <h4>Legal</h4>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/security">Security</Link>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} DOT Helper. All rights reserved.</p>
          <div className={styles.footerSocial}>
            <span>Made with ❤️ for trucking companies</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
