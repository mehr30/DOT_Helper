"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Truck, ArrowRight, Eye, EyeOff, Mail, Lock } from "lucide-react";
import styles from "./page.module.css";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const { error: authError } = await signIn.email({
            email,
            password,
        });

        if (authError) {
            setError(authError.message ?? "Invalid email or password. Please try again.");
            setIsLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    const handleSocialLogin = async (provider: "google" | "apple") => {
        await signIn.social({
            provider,
            callbackURL: "/dashboard",
        });
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
                        <h1>Stay DOT Compliant</h1>
                        <p>Access your compliance dashboard and keep your fleet running smoothly.</p>
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

                    {/* OAuth Buttons */}
                    <div className={styles.socialLogin}>
                        <button
                            type="button"
                            className={styles.socialButton}
                            onClick={() => handleSocialLogin("google")}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Google
                        </button>
                        <button
                            type="button"
                            className={styles.socialButton}
                            onClick={() => handleSocialLogin("apple")}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.68 1.83-1.36 3.63-2.53 5.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                            Apple
                        </button>
                    </div>

                    <div className={styles.divider}>
                        <span>or sign in with email</span>
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
