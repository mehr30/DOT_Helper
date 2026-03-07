"use client";

import Link from "next/link";
import { useState } from "react";
import {
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
  Quote,
  Truck,
} from "lucide-react";
import Image from "next/image";
import GreenlightLogo from "./components/GreenlightLogo";
import styles from "./page.module.css";

const showcaseTabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    title: "Your Compliance at a Glance",
    description: "See your overall compliance score, track drivers and vehicles, and catch upcoming deadlines — all from one dashboard.",
    image: "/screenshots/dashboard.png",
  },
  {
    id: "drivers",
    label: "Driver Management",
    title: "Track Every Driver's Status",
    description: "CDL expirations, medical cards, missing documents — everything you need to keep your drivers road-ready.",
    image: "/screenshots/drivers.png",
  },
  {
    id: "compliance",
    label: "Compliance Checklist",
    title: "Know Exactly What's Needed",
    description: "Federal and state requirements broken down into actionable items with due dates and status tracking.",
    image: "/screenshots/compliance.png",
  },
];

function ProductShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const tab = showcaseTabs[activeTab]!;

  return (
    <section className={styles.showcase}>
      <div className={styles.showcaseContainer}>
        <div className={styles.showcaseHeader}>
          <span className={styles.showcaseLabel}>See It In Action</span>
          <h2 className={styles.showcaseTitle}>
            Everything you need to stay compliant
          </h2>
          <p className={styles.showcaseSubtitle}>
            Real screenshots from Greenlight DOT — no mockups, no filler.
          </p>
        </div>

        <div className={styles.showcaseTabs}>
          {showcaseTabs.map((tab, i) => (
            <button
              key={tab.id}
              className={`${styles.showcaseTab} ${i === activeTab ? styles.showcaseTabActive : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.showcaseContent}>
          <div className={styles.showcaseInfo}>
            <h3 className={styles.showcaseInfoTitle}>{tab.title}</h3>
            <p className={styles.showcaseInfoDesc}>{tab.description}</p>
            <Link href="/register" className={styles.showcaseCta}>
              Try It Free <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.showcaseImageWrapper}>
            <div className={styles.showcaseBrowserBar}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            <Image
              src={tab.image}
              alt={tab.title}
              width={1440}
              height={900}
              className={styles.showcaseImage}
              priority={activeTab === 0}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

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
  { value: "$16,864", label: "Max fine per violation" },
  { value: "900+", label: "Pages of federal rules" },
  { value: "12+", label: "Documents per driver" },
  { value: "5 min", label: "Setup time" }
];

const testimonials = [
  {
    quote: "Greenlight DOT saved us from a $12,000 fine by alerting us to an expiring medical card. This software pays for itself.",
    author: "Mike Rodriguez",
    role: "Owner, Rodriguez Trucking LLC",
    company: "8 Trucks • Texas",
    rating: 5
  },
  {
    quote: "We had no idea our HVAC vans needed DOT compliance until we got a violation. Greenlight DOT made it easy to get everything organized.",
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
    description: "For owner-operators and small fleets (1–3 vehicles)",
    price: "49",
    period: "month",
    features: [
      "1 to 3 vehicles / drivers",
      "Core DQ file management",
      "Compliance calendar",
      "Automated deadline alerts",
      "Document storage",
      "Plain-language requirement explanations",
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Growth",
    description: "For growing fleets that need more power (4–15 vehicles)",
    price: "99",
    period: "month",
    features: [
      "4 to 15 vehicles / drivers",
      "Everything in Starter",
      "Audit readiness scoring",
      "Violation history tracking",
      "Employee document e-signing",
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Fleet",
    description: "For established fleets with advanced needs (16+ vehicles)",
    price: "199",
    period: "month",
    features: [
      "16+ vehicles / drivers",
      "Everything in Growth",
      "Priority compliance support",
      "Multi-location management",
      "Custom onboarding",
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
            <GreenlightLogo size={36} />
            <span>Greenlight DOT</span>
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
            <span>For any business with commercial vehicles</span>
          </div>
          <h1 className={styles.heroTitle}>
            {"You started your business to do the work."}<br />
            <span className={styles.heroGradient}>Not to drown in DOT paperwork.</span>
          </h1>
          <p className={styles.heroDescription}>
            Trucking, HVAC, plumbing, landscaping — if you have commercial vehicles,
            the DOT has rules for you. Miss one deadline and it&apos;s a $16,000 fine.
            Greenlight DOT tracks every expiration, every document, every requirement.
            We tell you exactly what needs attention. Plain English. Zero guesswork.
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
          <span className={styles.socialProofLabel}>Trusted by small businesses across America</span>
          <div className={styles.socialProofLogos}>
            <span>🚛 Trucking & Freight</span>
            <span>🔧 HVAC & Plumbing</span>
            <span>🌿 Landscaping & Construction</span>
            <span>⚡ Electrical & Home Services</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.featuresContainer}>
          <div className={styles.featuresHeader}>
            <span className={styles.featuresLabel}>Features</span>
            <h2 className={styles.featuresTitle}>
              We watch the details so you don&apos;t have to
            </h2>
            <p className={styles.featuresDescription}>
              Driver files, vehicle inspections, deadlines, drug tests — it&apos;s a lot to keep straight.
              We keep it straight for you.
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

      {/* Product Showcase */}
      <ProductShowcase />

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
            <span className={styles.benefitsLabel}>Why Greenlight DOT?</span>
            <h2 className={styles.benefitsTitle}>
              You&apos;ve got enough to worry about
            </h2>
            <ul className={styles.benefitsList}>
              <li className={styles.benefitItem}>
                <CheckCircle size={20} className={styles.benefitIcon} />
                <span>Audit comes? Pull up every record in seconds — organized and ready</span>
              </li>
              <li className={styles.benefitItem}>
                <CheckCircle size={20} className={styles.benefitIcon} />
                <span>We alert you 90, 60, 30, and 7 days before anything expires</span>
              </li>
              <li className={styles.benefitItem}>
                <CheckCircle size={20} className={styles.benefitIcon} />
                <span>No more filing cabinets — every document stored, searchable, shareable</span>
              </li>
              <li className={styles.benefitItem}>
                <CheckCircle size={20} className={styles.benefitIcon} />
                <span>See your compliance score at a glance — green means go</span>
              </li>
              <li className={styles.benefitItem}>
                <CheckCircle size={20} className={styles.benefitIcon} />
                <span>Drivers can sign forms and upload docs right from their phone</span>
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
            Stop chasing paperwork. Start running your fleet.
          </h2>
          <p className={styles.ctaDescription}>
            14 days free. No credit card. Set up in 5 minutes. See why hundreds of fleet owners sleep better at night.
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
              <GreenlightLogo size={32} />
              <span>Greenlight DOT</span>
            </Link>
            <p className={styles.footerTagline}>
              DOT compliance, plain and simple. For trucking, home services, and any business with commercial vehicles.
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
          <p>&copy; {new Date().getFullYear()} Greenlight DOT. All rights reserved.</p>
          <div className={styles.footerSocial}>
            <span>DOT compliance, plain and simple.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
