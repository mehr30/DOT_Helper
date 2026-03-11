import Link from "next/link";
import GreenlightLogo from "./GreenlightLogo";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerBrand}>
                    <Link href="/" className={styles.footerLogo}>
                        <GreenlightLogo size={32} />
                        <span>Greenlight USDOT</span>
                    </Link>
                    <p className={styles.footerTagline}>
                        DOT compliance, plain and simple. For trucking, home services, and any business with commercial vehicles.
                    </p>
                </div>
                <div className={styles.footerLinks}>
                    <div className={styles.footerColumn}>
                        <h4>Product</h4>
                        <Link href="/#features">Features</Link>
                        <Link href="/pricing">Pricing</Link>
                    </div>
                    <div className={styles.footerColumn}>
                        <h4>Resources</h4>
                        <Link href="/blog">Compliance Guides</Link>
                        <Link href="/help">Help Center</Link>
                    </div>
                    <div className={styles.footerColumn}>
                        <h4>Company</h4>
                        <Link href="/about">About</Link>
                        <Link href="/contact">Contact</Link>
                    </div>
                    <div className={styles.footerColumn}>
                        <h4>Legal</h4>
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
            <div className={styles.footerBottom}>
                <p>&copy; {new Date().getFullYear()} Greenlight USDOT. All rights reserved.</p>
                <div className={styles.footerSocial}>
                    <span>DOT compliance, plain and simple.</span>
                </div>
            </div>
        </footer>
    );
}
