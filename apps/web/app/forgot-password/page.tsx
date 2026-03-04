"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Truck, ArrowLeft, Mail } from "lucide-react";
import styles from "../login/page.module.css";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const { error: authError } = await authClient.requestPasswordReset({
            email,
            redirectTo: "/reset-password",
        });

        if (authError) {
            setError(authError.message ?? "Something went wrong. Please try again.");
            setIsLoading(false);
        } else {
            setSent(true);
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                {/* Left Side - Branding */}
                <div className={styles.authBranding}>
                    <Link href="/" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <Truck size={28} />
                        </div>
                        <span>DOT Helper</span>
                    </Link>
                    <div className={styles.brandingContent}>
                        <h1>Reset Your Password</h1>
                        <p>We&apos;ll send you a link to reset your password and get back to managing your fleet.</p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className={styles.authForm}>
                    {sent ? (
                        <>
                            <div className={styles.formHeader}>
                                <h2>Check your email</h2>
                                <p>We sent a password reset link to <strong>{email}</strong>. Click the link in the email to reset your password.</p>
                            </div>
                            <div style={{ padding: "var(--space-4)", background: "var(--color-success-50, #f0fdf4)", border: "1px solid var(--color-success-200, #bbf7d0)", borderRadius: "var(--radius-lg)", color: "var(--color-success-700, #15803d)", fontSize: "0.875rem", textAlign: "center" }}>
                                📧 Check your inbox (and spam folder)
                            </div>
                            <div className={styles.formFooter} style={{ marginTop: "var(--space-6)" }}>
                                <p>
                                    <Link href="/login" className={styles.authLink}>
                                        <ArrowLeft size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                                        Back to login
                                    </Link>
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.formHeader}>
                                <h2>Forgot your password?</h2>
                                <p>Enter the email address you used to register and we&apos;ll send you a reset link.</p>
                            </div>

                            {error && (
                                <div style={{ padding: "var(--space-3) var(--space-4)", background: "var(--color-danger-50, #fef2f2)", border: "1px solid var(--color-danger-200, #fecaca)", borderRadius: "var(--radius-lg)", color: "var(--color-danger-700, #b91c1c)", fontSize: "0.875rem" }}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="email" className={styles.label}>Email Address</label>
                                    <div className={styles.inputWrapper}>
                                        <Mail size={18} className={styles.inputIcon} />
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@company.com"
                                            className={styles.input}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                                    {isLoading ? (
                                        <span className={styles.spinner} />
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </button>
                            </form>

                            <div className={styles.formFooter}>
                                <p>
                                    Remember your password?{" "}
                                    <Link href="/login" className={styles.authLink}>Sign in</Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
