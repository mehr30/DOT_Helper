import Link from "next/link";
import GreenlightLogo from "./GreenlightLogo";
import Footer from "./Footer";
import styles from "./StaticPageLayout.module.css";

interface StaticPageLayoutProps {
    title: string;
    subtitle?: string;
    lastUpdated?: string;
    children: React.ReactNode;
}

export default function StaticPageLayout({ title, subtitle, lastUpdated, children }: StaticPageLayoutProps) {
    return (
        <div className={styles.page}>
            <nav className={styles.nav}>
                <Link href="/" className={styles.logoLink}>
                    <GreenlightLogo size={36} />
                    <span className={styles.logoText}>Greenlight USDOT</span>
                </Link>
                <div className={styles.navLinks}>
                    <Link href="/blog" className={styles.navLink}>Guides</Link>
                    <Link href="/pricing" className={styles.navLink}>Pricing</Link>
                    <Link href="/login" className={styles.loginBtn}>Sign In</Link>
                </div>
            </nav>

            <div className={styles.content}>
                <h1 className={styles.pageTitle}>{title}</h1>
                {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
                {lastUpdated && <p className={styles.lastUpdated}>Last updated: {lastUpdated}</p>}
                <div className={styles.body}>
                    {children}
                </div>
            </div>

            <Footer />
        </div>
    );
}
