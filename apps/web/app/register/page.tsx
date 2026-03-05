"use client";

import Link from "next/link";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { ArrowRight, Eye, EyeOff, Mail, Lock, User, Building } from "lucide-react";
import GreenlightLogo from "@/app/components/GreenlightLogo";
import styles from "../login/page.module.css";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        password: "",
        agreeTerms: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { error: authError } = await signUp.email({
                email: formData.email,
                password: formData.password,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
            });

            if (authError) {
                setError(authError.message ?? "Registration failed. Please try again.");
                setIsLoading(false);
            } else {
                window.location.href = "/dashboard";
            }
        } catch {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    const updateField = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                {/* Left Side - Branding */}
                <div className={styles.authBranding}>
                    <Link href="/" className={styles.logo}>
                        <GreenlightLogo size={44} />
                        <span>Greenlight DOT</span>
                    </Link>
                    <div className={styles.brandingContent}>
                        <h1>See What You're Missing.</h1>
                        <p>See exactly what you're missing. Fix it before the DOT shows up.</p>
                        <div className={styles.brandingFeatures}>
                            <div className={styles.brandingFeature}>
                                <span className={styles.checkmark}>✓</span>
                                <span>14-day free trial</span>
                            </div>
                            <div className={styles.brandingFeature}>
                                <span className={styles.checkmark}>✓</span>
                                <span>No credit card required</span>
                            </div>
                            <div className={styles.brandingFeature}>
                                <span className={styles.checkmark}>✓</span>
                                <span>Cancel anytime</span>
                            </div>
                            <div className={styles.brandingFeature}>
                                <span className={styles.checkmark}>✓</span>
                                <span>Full feature access</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className={styles.authForm}>
                    <div className={styles.formHeader}>
                        <h2>Create your account</h2>
                        <p>Get started with Greenlight DOT in minutes</p>
                    </div>

                    {error && (
                        <div style={{ padding: "var(--space-3) var(--space-4)", background: "var(--color-danger-50, #fef2f2)", border: "1px solid var(--color-danger-200, #fecaca)", borderRadius: "var(--radius-lg)", color: "var(--color-danger-700, #b91c1c)", fontSize: "0.875rem" }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.nameRow}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="firstName" className={styles.label}>First Name</label>
                                <div className={styles.inputWrapper}>
                                    <User size={18} className={styles.inputIcon} />
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => updateField("firstName", e.target.value)}
                                        placeholder="John"
                                        className={styles.input}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="lastName" className={styles.label}>Last Name</label>
                                <div className={styles.inputWrapper}>
                                    <User size={18} className={styles.inputIcon} />
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => updateField("lastName", e.target.value)}
                                        placeholder="Smith"
                                        className={styles.input}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="email" className={styles.label}>Work Email</label>
                            <div className={styles.inputWrapper}>
                                <Mail size={18} className={styles.inputIcon} />
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    placeholder="you@company.com"
                                    className={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="company" className={styles.label}>Company Name</label>
                            <div className={styles.inputWrapper}>
                                <Building size={18} className={styles.inputIcon} />
                                <input
                                    type="text"
                                    id="company"
                                    value={formData.company}
                                    onChange={(e) => updateField("company", e.target.value)}
                                    placeholder="Your Trucking Co."
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <div className={styles.inputWrapper}>
                                <Lock size={18} className={styles.inputIcon} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => updateField("password", e.target.value)}
                                    placeholder="Min. 8 characters"
                                    className={styles.input}
                                    required
                                    minLength={8}
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

                        <label className={styles.termsLabel}>
                            <input
                                type="checkbox"
                                checked={formData.agreeTerms}
                                onChange={(e) => updateField("agreeTerms", e.target.checked)}
                                required
                            />
                            <span>I agree to the <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link></span>
                        </label>

                        <button type="submit" className={styles.submitButton} disabled={isLoading}>
                            {isLoading ? (
                                <span className={styles.spinner} />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className={styles.formFooter}>
                        <p>
                            Already have an account?{" "}
                            <Link href="/login" className={styles.authLink}>Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
