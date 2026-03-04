"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import { Truck, ArrowRight, Eye, EyeOff, Lock } from "lucide-react";
import styles from "../login/page.module.css";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setIsLoading(true);

        const { error: authError } = await authClient.resetPassword({
            newPassword: password,
            token,
        });

        if (authError) {
            setError(authError.message ?? "Failed to reset password. The link may have expired.");
            setIsLoading(false);
        } else {
            setSuccess(true);
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className={styles.authForm}>
                <div className={styles.formHeader}>
                    <h2>Invalid Reset Link</h2>
                    <p>This password reset link is invalid or has expired.</p>
                </div>
                <div className={styles.formFooter}>
                    <p>
                        <Link href="/forgot-password" className={styles.authLink}>Request a new reset link</Link>
                    </p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className={styles.authForm}>
                <div className={styles.formHeader}>
                    <h2>Password Reset!</h2>
                    <p>Your password has been successfully updated. You can now sign in with your new password.</p>
                </div>
                <Link href="/login" className={styles.submitButton} style={{ textAlign: "center", textDecoration: "none" }}>
                    Sign In <ArrowRight size={18} />
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.authForm}>
            <div className={styles.formHeader}>
                <h2>Set New Password</h2>
                <p>Choose a strong password for your account.</p>
            </div>

            {error && (
                <div style={{ padding: "var(--space-3) var(--space-4)", background: "var(--color-danger-50, #fef2f2)", border: "1px solid var(--color-danger-200, #fecaca)", borderRadius: "var(--radius-lg)", color: "var(--color-danger-700, #b91c1c)", fontSize: "0.875rem" }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>New Password</label>
                    <div className={styles.inputWrapper}>
                        <Lock size={18} className={styles.inputIcon} />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            className={styles.input}
                            required
                            minLength={8}
                            autoFocus
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

                <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                    <div className={styles.inputWrapper}>
                        <Lock size={18} className={styles.inputIcon} />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            className={styles.input}
                            required
                            minLength={8}
                        />
                    </div>
                </div>

                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                    {isLoading ? (
                        <span className={styles.spinner} />
                    ) : (
                        <>
                            Reset Password
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className={styles.formFooter}>
                <p>
                    <Link href="/login" className={styles.authLink}>Back to login</Link>
                </p>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                <div className={styles.authBranding}>
                    <Link href="/" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <Truck size={28} />
                        </div>
                        <span>DOT Helper</span>
                    </Link>
                    <div className={styles.brandingContent}>
                        <h1>Almost There</h1>
                        <p>Set a new password and get back to managing your fleet compliance.</p>
                    </div>
                </div>
                <Suspense fallback={<div className={styles.authForm}><p>Loading...</p></div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
