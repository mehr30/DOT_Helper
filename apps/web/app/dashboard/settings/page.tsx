"use client";

import { useState } from "react";
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Shield,
    CreditCard,
    Building2,
    Link2,
    CheckCircle,
    ExternalLink,
    Truck,
    Clock,
    Radio,
} from "lucide-react";

const settingsSections = [
    { name: "Profile", description: "Your name, email, and account details", icon: User },
    { name: "Company", description: "Company name, USDOT number, and address", icon: Building2 },
    { name: "Notifications", description: "Email and SMS alert preferences", icon: Bell },
    { name: "Security", description: "Password, two-factor authentication", icon: Shield },
    { name: "Billing", description: "Subscription plan, payment methods, invoices", icon: CreditCard },
];

interface Integration {
    id: string;
    name: string;
    description: string;
    what: string;
    icon: string;
    category: "fleet" | "eld";
    connected: boolean;
}

const integrations: Integration[] = [
    {
        id: "samsara",
        name: "Samsara",
        description: "Fleet tracking, GPS, dashcams, and ELD compliance",
        what: "Samsara is an all-in-one fleet management platform. It tracks vehicle locations in real-time, records driving hours (Hours of Service), monitors driver safety with dashcams, and helps manage maintenance schedules.",
        icon: "🛰️",
        category: "fleet",
        connected: false,
    },
    {
        id: "motive",
        name: "Motive (formerly KeepTruckin)",
        description: "ELD, fleet tracking, safety, and compliance automation",
        what: "Motive is a leading ELD (Electronic Logging Device) and fleet tracking provider. An ELD is a device that plugs into your vehicle's engine to automatically track how long drivers are on the road — this is required by federal law for most commercial vehicles over 10,001 lbs.",
        icon: "📡",
        category: "eld",
        connected: false,
    },
    {
        id: "geotab",
        name: "Geotab",
        description: "Telematics, vehicle diagnostics, and fleet intelligence",
        what: "Geotab provides vehicle telematics — devices that monitor your vehicle's health, location, fuel usage, and driver behavior. It also offers ELD compliance and integrates with many third-party apps.",
        icon: "📊",
        category: "fleet",
        connected: false,
    },
];

export default function SettingsPage() {
    const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set());
    const [expandedIntegration, setExpandedIntegration] = useState<string | null>(null);

    const toggleConnect = (id: string) => {
        setConnectedIntegrations(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div style={{ padding: "2rem", maxWidth: 800 }}>
            <header style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>Settings</h1>
                <p style={{ color: "#64748b", fontSize: "0.95rem" }}>Manage your account, integrations, and preferences</p>
            </header>

            {/* Account Settings */}
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem", marginBottom: "2.5rem" }}>
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

            {/* Integrations */}
            <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <Link2 size={20} style={{ color: "#3b82f6" }} />
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>Integrations</h2>
                </div>
                <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.25rem", lineHeight: 1.5 }}>
                    Connect your fleet tracking and ELD providers to automatically sync vehicle data,
                    driver hours, and compliance records. Don&apos;t know what these are? Click &quot;Learn more&quot; on any integration below.
                </p>

                <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
                    {integrations.map((integration) => {
                        const isConnected = connectedIntegrations.has(integration.id);
                        const isExpanded = expandedIntegration === integration.id;

                        return (
                            <div key={integration.id} style={{
                                background: "white",
                                border: `1px solid ${isConnected ? "#86efac" : "#e2e8f0"}`,
                                borderRadius: "14px",
                                overflow: "hidden",
                                transition: "border-color 0.2s",
                            }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    padding: "1.25rem 1.5rem",
                                }}>
                                    <div style={{
                                        width: 48, height: 48,
                                        borderRadius: "12px",
                                        background: integration.category === "eld" ? "#fef3c7" : "#eff6ff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.5rem",
                                        flexShrink: 0,
                                    }}>
                                        {integration.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <span style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a" }}>
                                                {integration.name}
                                            </span>
                                            <span style={{
                                                fontSize: "0.65rem",
                                                fontWeight: 600,
                                                textTransform: "uppercase" as const,
                                                letterSpacing: "0.05em",
                                                padding: "0.15rem 0.5rem",
                                                borderRadius: "4px",
                                                background: integration.category === "eld" ? "#fef3c7" : "#eff6ff",
                                                color: integration.category === "eld" ? "#92400e" : "#1e40af",
                                            }}>
                                                {integration.category === "eld" ? "ELD Provider" : "Fleet Tracking"}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.2rem" }}>
                                            {integration.description}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                                        <button
                                            onClick={() => setExpandedIntegration(isExpanded ? null : integration.id)}
                                            style={{
                                                padding: "0.4rem 0.75rem",
                                                border: "1px solid #e2e8f0",
                                                borderRadius: "8px",
                                                background: "white",
                                                fontSize: "0.75rem",
                                                color: "#64748b",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {isExpanded ? "Hide" : "Learn more"}
                                        </button>
                                        <button
                                            onClick={() => toggleConnect(integration.id)}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.3rem",
                                                padding: "0.5rem 1rem",
                                                border: "none",
                                                borderRadius: "8px",
                                                background: isConnected ? "#dcfce7" : "#3b82f6",
                                                color: isConnected ? "#16a34a" : "white",
                                                fontSize: "0.8rem",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                            }}
                                        >
                                            {isConnected ? (
                                                <><CheckCircle size={14} /> Connected</>
                                            ) : (
                                                <>Connect</>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div style={{
                                        padding: "0 1.5rem 1.25rem",
                                        borderTop: "1px solid #f1f5f9",
                                        marginTop: "-0.25rem",
                                    }}>
                                        <p style={{
                                            fontSize: "0.875rem",
                                            color: "#475569",
                                            lineHeight: 1.7,
                                            margin: "1rem 0 0",
                                            background: "#f8fafc",
                                            padding: "1rem",
                                            borderRadius: "8px",
                                        }}>
                                            {integration.what}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{
                padding: "1.5rem",
                background: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                textAlign: "center" as const,
            }}>
                <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
                    🔧 Full settings management is coming soon. Integration connections will sync data automatically once configured.
                </p>
            </div>
        </div>
    );
}
