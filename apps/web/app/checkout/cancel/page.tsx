import Link from "next/link";
import { XCircle, ArrowRight, ArrowLeft } from "lucide-react";

export const metadata = {
    title: "Checkout Cancelled | Greenlight USDOT",
    description: "Your checkout was cancelled. You can try again anytime.",
};

export default function CheckoutCancelPage() {
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
                maxWidth: 480,
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
                    background: "var(--color-gray-100)",
                    color: "var(--color-gray-400)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                }}>
                    <XCircle size={40} />
                </div>
                <h1 style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "0.75rem",
                }}>
                    Checkout Cancelled
                </h1>
                <p style={{
                    fontSize: "0.9375rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    marginBottom: "2rem",
                }}>
                    No worries — your checkout was cancelled and you were not charged.
                    You can return to pricing and try again whenever you&apos;re ready.
                </p>

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link
                        href="/pricing"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.75rem 1.5rem",
                            background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))",
                            color: "white",
                            borderRadius: "var(--radius-lg)",
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            textDecoration: "none",
                        }}
                    >
                        <ArrowLeft size={16} />
                        Back to Pricing
                    </Link>
                    <Link
                        href="/"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.75rem 1.5rem",
                            background: "var(--bg-tertiary)",
                            color: "var(--text-primary)",
                            borderRadius: "var(--radius-lg)",
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            textDecoration: "none",
                            border: "1px solid var(--border-color)",
                        }}
                    >
                        Go Home
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
