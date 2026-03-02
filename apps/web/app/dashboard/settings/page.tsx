"use client";

import { Settings as SettingsIcon, User, Bell, Shield, CreditCard, Building2 } from "lucide-react";

const settingsSections = [
    { name: "Profile", description: "Your name, email, and account details", icon: User },
    { name: "Company", description: "Company name, USDOT number, and address", icon: Building2 },
    { name: "Notifications", description: "Email and SMS alert preferences", icon: Bell },
    { name: "Security", description: "Password, two-factor authentication", icon: Shield },
    { name: "Billing", description: "Subscription plan, payment methods, invoices", icon: CreditCard },
];

export default function SettingsPage() {
    return (
        <div style={{ padding: "2rem", maxWidth: 720 }}>
            <header style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>Settings</h1>
                <p style={{ color: "#64748b", fontSize: "0.95rem" }}>Manage your account and preferences</p>
            </header>

            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
                {settingsSections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <button key={section.name} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            padding: "1.25rem 1.5rem",
                            background: "white",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            cursor: "pointer",
                            textAlign: "left" as const,
                            width: "100%",
                            transition: "border-color 0.15s",
                        }}>
                            <div style={{
                                width: 44, height: 44,
                                borderRadius: "10px",
                                background: "#f1f5f9",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#475569",
                                flexShrink: 0,
                            }}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a" }}>{section.name}</div>
                                <div style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.15rem" }}>{section.description}</div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div style={{
                marginTop: "2rem",
                padding: "1.5rem",
                background: "#fefce8",
                borderRadius: "12px",
                border: "1px solid #fde68a",
                textAlign: "center" as const,
            }}>
                <p style={{ color: "#92400e", fontSize: "0.95rem" }}>
                    ⚙️ Settings management is coming soon. Your preferences will be saved here.
                </p>
            </div>
        </div>
    );
}
