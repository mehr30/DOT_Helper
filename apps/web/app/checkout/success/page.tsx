import Link from "next/link";
import { CheckCircle, ArrowRight, Truck } from "lucide-react";

export const metadata = {
    title: "Welcome to DOT Helper! | Subscription Confirmed",
    description: "Your DOT Helper subscription is active. Start managing your fleet compliance today.",
};

export default function CheckoutSuccessPage() {
    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            background: "var(--bg-secondary)",
        }}>
            <div style={{
                maxWidth: 560,
                width: "100%",
                background: "var(--bg-primary)",
                borderRadius: "var(--radius-2xl)",
                padding: "3rem",
                textAlign: "center",
                boxShadow: "var(--shadow-xl)",
                border: "1px solid var(--border-color)",
            }}>
                <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "var(--color-success-100)",
                    color: "var(--color-success-500)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                }}>
                    <CheckCircle size={40} />
                </div>
                <h1 style={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "0.75rem",
                }}>
                    Welcome to DOT Helper!
                </h1>
                <p style={{
                    fontSize: "1rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    marginBottom: "2rem",
                }}>
                    Your subscription is active and your 14-day free trial has started.
                    Let&apos;s get your fleet set up for full DOT compliance.
                </p>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    textAlign: "left",
                    background: "var(--bg-secondary)",
                    borderRadius: "var(--radius-xl)",
                    padding: "1.5rem",
                    marginBottom: "2rem",
                }}>
                    <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)" }}>
                        Quick Start Checklist:
                    </h3>
                    {[
                        "Add your company USDOT and MC numbers",
                        "Add your drivers and upload their CDLs",
                        "Add your vehicles and inspection dates",
                        "Run your first compliance check",
                    ].map((step, i) => (
                        <div key={i} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            fontSize: "0.875rem",
                            color: "var(--text-secondary)",
                        }}>
                            <span style={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                background: "var(--color-primary-100)",
                                color: "var(--color-primary-600)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                flexShrink: 0,
                            }}>
                                {i + 1}
                            </span>
                            {step}
                        </div>
                    ))}
                </div>

                <Link
                    href="/dashboard"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.875rem 2rem",
                        background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))",
                        color: "white",
                        borderRadius: "var(--radius-xl)",
                        fontWeight: 600,
                        fontSize: "1rem",
                        textDecoration: "none",
                        boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
                        transition: "all 0.15s ease",
                    }}
                >
                    Go to Dashboard
                    <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}
