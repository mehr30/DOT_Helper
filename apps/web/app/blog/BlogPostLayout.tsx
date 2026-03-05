import Link from "next/link";
import { ArrowRight, Calendar, Clock, ChevronLeft } from "lucide-react";
import GreenlightLogo from "../components/GreenlightLogo";
import styles from "./blog.module.css";

interface BlogPostLayoutProps {
    category: string;
    title: string;
    author?: string;
    date: string;
    readTime: string;
    children: React.ReactNode;
    relatedPosts?: { slug: string; title: string }[];
}

export default function BlogPostLayout({
    category,
    title,
    author = "Greenlight DOT Team",
    date,
    readTime,
    children,
    relatedPosts,
}: BlogPostLayoutProps) {
    return (
        <div className={styles.blogLayout}>
            <nav className={styles.nav}>
                <Link href="/" className={styles.logoLink}>
                    <GreenlightLogo size={36} />
                    <span className={styles.logoText}>Greenlight DOT</span>
                </Link>
                <div className={styles.navLinks}>
                    <Link href="/blog" className={styles.navLink}>
                        <ChevronLeft size={14} style={{ display: "inline", verticalAlign: "middle" }} /> Blog
                    </Link>
                    <Link href="/features" className={styles.navLink}>Features</Link>
                    <Link href="/pricing" className={styles.navLink}>Pricing</Link>
                    <Link href="/login" className={styles.loginBtn}>Sign In</Link>
                </div>
            </nav>

            <article className={styles.article}>
                <header className={styles.articleHeader}>
                    <div className={styles.articleCategory}>{category}</div>
                    <h1 className={styles.articleTitle}>{title}</h1>
                    <div className={styles.articleMeta}>
                        <span>{author}</span>
                        <span>•</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <Calendar size={14} /> {date}
                        </span>
                        <span>•</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <Clock size={14} /> {readTime}
                        </span>
                    </div>
                </header>

                <div className={styles.articleContent}>
                    {children}
                </div>

                {relatedPosts && relatedPosts.length > 0 && (
                    <div style={{
                        marginTop: "var(--space-10)",
                        padding: "var(--space-6)",
                        background: "var(--bg-secondary)",
                        borderRadius: "var(--radius-xl)",
                        border: "1px solid var(--border-color)",
                    }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "var(--space-4)" }}>
                            Related Articles
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                            {relatedPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--space-2)",
                                        color: "var(--color-primary-600)",
                                        textDecoration: "none",
                                        fontSize: "0.9375rem",
                                        fontWeight: 500,
                                    }}
                                >
                                    <ArrowRight size={14} />
                                    {post.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.articleCta}>
                    <h3>Stop Risking Fines. Start Managing Compliance.</h3>
                    <p>Greenlight DOT automates compliance tracking so you can focus on running your fleet.</p>
                    <Link href="/pricing" className={styles.articleCtaBtn}>
                        Try Greenlight DOT Free <ArrowRight size={16} />
                    </Link>
                </div>
            </article>
        </div>
    );
}
