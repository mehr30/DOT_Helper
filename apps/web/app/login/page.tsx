"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { ArrowRight, Eye, EyeOff, Mail, Lock } from "lucide-react";
import GreenlightLogo from "@/app/components/GreenlightLogo";
import styles from "./page.module.css";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { error: authError } = await signIn.email({
                email,
                password,
            });

            if (authError) {
                setError(authError.message ?? "Invalid email or password. Please try again.");
                setIsLoading(false);
            } else {
                window.location.href = "/dashboard";
            }
        } catch {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                {/* Left Side - Branding */}
                <div className={styles.authBranding}>
                    <Link href="/" className={styles.logo}>
                        <GreenlightLogo size={44} />
                        <span>Greenlight USDOT</span>
                    </Link>
                    <div className={styles.brandingContent}>
                        <h1>Good to Go.</h1>
                        <p>Your compliance dashboard is one click away.</p>
                        <div className={styles.brandingFeatures}>
                            <div className={styles.brandingFeature}>
                                <span className={styles.checkmark}>✓</span>
                                <span>Track driver qualifications</span>
                            </div>
                            <div className={styles.brandingFeature}>
                                <span className={styles.checkmark}>✓</span>
                                <span>Monitor vehicle inspections</span>
                            </div>
                            <div className={styles.brandingFeature}>
                                <span className={styles.checkmark}>✓</span>
                                <span>Never miss a deadline</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className={styles.authForm}>
                    <div className={styles.formHeader}>
                        <h2>Welcome back</h2>
                        <p>Enter your credentials to access your account</p>
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
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <div className={styles.labelRow}>
                                <label htmlFor="password" className={styles.label}>Password</label>
                                <Link href="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
                            </div>
                            <div className={styles.inputWrapper}>
                                <Lock size={18} className={styles.inputIcon} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className={styles.input}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className={styles.submitButton} disabled={isLoading}>
                            {isLoading ? (
                                <span className={styles.spinner} />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className={styles.formFooter}>
                        <p>
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className={styles.authLink}>Start your free trial</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
