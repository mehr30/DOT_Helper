"use client";

import { useState, useEffect } from "react";
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
    X,
    Loader2,
    RefreshCw,
    AlertTriangle,
    Clock,
    Wifi,
    WifiOff,
} from "lucide-react";

/* ─── Account Settings Sections ─── */
const settingsSections = [
    { name: "Profile", description: "Your name, email, and account details", icon: User },
    { name: "Company", description: "Company name, USDOT number, and address", icon: Building2 },
    { name: "Notifications", description: "Email and SMS alert preferences", icon: Bell },
    { name: "Security", description: "Password, two-factor authentication", icon: Shield },
    { name: "Billing", description: "Subscription plan, payment methods, invoices", icon: CreditCard },
];

/* ─── Integration Definitions ─── */
interface Integration {
    id: string;
    name: string;
    tagline: string;
    description: string;
    category: "fleet" | "eld" | "both";
    authType: "api_key" | "oauth" | "credentials";
    authFields: { key: string; label: string; placeholder: string; type: string; helpText?: string }[];
    apiBase: string;
    docsUrl: string;
    features: string[];
}

const integrations: Integration[] = [
    {
        id: "samsara",
        name: "Samsara",
        tagline: "All-in-one fleet management platform",
        description: "Samsara provides real-time GPS tracking, AI dashcams, ELD compliance, and vehicle diagnostics. Their API uses Bearer token authentication — generate an API token from your Samsara dashboard under Settings → API Tokens.",
        category: "both",
        authType: "api_key",
        authFields: [
            { key: "apiToken", label: "API Token", placeholder: "samsara_api_xxxxxxxxxxxx", type: "password", helpText: "Generate at cloud.samsara.com → Settings → API Tokens" },
        ],
        apiBase: "https://api.samsara.com",
        docsUrl: "https://developers.samsara.com",
        features: ["Real-time GPS tracking", "AI dashcam safety", "ELD & HOS compliance", "Vehicle diagnostics", "Route optimization"],
    },
    {
        id: "motive",
        name: "Motive",
        tagline: "Formerly KeepTruckin — ELD & fleet intelligence",
        description: "Motive is a leading ELD and fleet safety platform. An ELD (Electronic Logging Device) plugs into your vehicle to automatically track driving hours — required by law for commercial vehicles over 10,001 lbs. Motive uses OAuth 2.0 — register your app at developer.gomotive.com to get credentials.",
        category: "eld",
        authType: "oauth",
        authFields: [
            { key: "clientId", label: "Client ID", placeholder: "Your Motive Client ID", type: "text", helpText: "From developer.gomotive.com → Applications" },
            { key: "clientSecret", label: "Client Secret", placeholder: "Your Client Secret", type: "password" },
            { key: "redirectUri", label: "Redirect URI", placeholder: "https://yourdomain.com/api/motive/callback", type: "url" },
        ],
        apiBase: "https://api.gomotive.com/v1",
        docsUrl: "https://developer.gomotive.com",
        features: ["ELD compliance (FMCSA certified)", "Automated HOS logging", "Driver safety scoring", "Smart dashcams", "IFTA fuel tax reporting"],
    },
    {
        id: "geotab",
        name: "Geotab",
        tagline: "Enterprise telematics & vehicle intelligence",
        description: "Geotab provides vehicle telematics — devices that monitor vehicle health, location, fuel usage, and driver behavior. Their MyGeotab API uses username/password authentication with a database name for your fleet account.",
        category: "fleet",
        authType: "credentials",
        authFields: [
            { key: "database", label: "Database Name", placeholder: "your_company_db", type: "text", helpText: "Your MyGeotab database name" },
            { key: "username", label: "Username (Email)", placeholder: "admin@yourcompany.com", type: "email" },
            { key: "password", label: "Password", placeholder: "••••••••", type: "password" },
        ],
        apiBase: "https://my.geotab.com/apiv1",
        docsUrl: "https://geotab.github.io/sdk/",
        features: ["Real-time vehicle tracking", "Engine diagnostics (OBD-II)", "Driver behavior analysis", "Fuel usage monitoring", "Open API with 100+ integrations"],
    },
    {
        id: "verizon_connect",
        name: "Verizon Connect",
        tagline: "#1 market share — enterprise fleet management",
        description: "Verizon Connect (formerly Fleetmatics / Networkfleet) holds the largest fleet management market share at 13%+. Their Reveal platform uses API key authentication for fleet data integration with real-time location, geofencing, and maintenance alerts.",
        category: "fleet",
        authType: "api_key",
        authFields: [
            { key: "apiKey", label: "API Key", placeholder: "vc_xxxxxxxx-xxxx-xxxx-xxxx", type: "password", helpText: "Request from your Verizon Connect account manager or developer portal" },
            { key: "accountId", label: "Account ID", placeholder: "Your Verizon Connect account ID", type: "text" },
        ],
        apiBase: "https://fim.api.verizonconnect.com",
        docsUrl: "https://developer.verizonconnect.com",
        features: ["Real-time GPS fleet tracking", "Geofencing & alerts", "Maintenance scheduling", "Driver scorecards", "Compliance reporting"],
    },
    {
        id: "gps_trackit",
        name: "GPS Trackit",
        tagline: "Simple, affordable GPS fleet tracking",
        description: "GPS Trackit offers straightforward fleet tracking for small-to-mid-size fleets. Their API provides vehicle location, trip history, and driver status with simple API key authentication — great for fleets that need tracking without the complexity.",
        category: "fleet",
        authType: "api_key",
        authFields: [
            { key: "apiKey", label: "API Key", placeholder: "gt-xxxxxxxxxxxxxxxxxxxx", type: "password", helpText: "Available in your GPS Trackit dashboard under Account → API Access" },
        ],
        apiBase: "https://api.gpstrackit.com/api/v1",
        docsUrl: "https://apidocs.gpstrackit.com",
        features: ["Live vehicle tracking", "Trip history & replay", "Speed & idle alerts", "Maintenance reminders", "Simple setup"],
    },
    {
        id: "azuga",
        name: "Azuga (Bridgestone)",
        tagline: "Fleet safety & driver rewards platform",
        description: "Azuga, now part of Bridgestone, focuses on driver safety scoring, rewards-based coaching, and OBD-II diagnostics. Their API uses token-based authentication and provides vehicle health, trip data, and driver behavior analytics.",
        category: "fleet",
        authType: "api_key",
        authFields: [
            { key: "apiToken", label: "API Token", placeholder: "azg_xxxxxxxxxxxxxxxxxxxx", type: "password", helpText: "Generate from Azuga Dashboard → Settings → API" },
            { key: "fleetId", label: "Fleet ID", placeholder: "Your Azuga Fleet ID", type: "text" },
        ],
        apiBase: "https://api.azuga.com/api/v2",
        docsUrl: "https://developer.azuga.com",
        features: ["Driver safety scoring", "Rewards-based coaching", "OBD-II diagnostics", "Fuel efficiency analytics", "Trip & mileage tracking"],
    },
];

/* ─── Saved Connection Type ─── */
interface SavedConnection {
    integrationId: string;
    fields: Record<string, string>;
    connectedAt: string;
    lastSyncAt: string | null;
    status: "connected" | "syncing" | "error";
}

const STORAGE_KEY = "dot_helper_integrations";

function loadConnections(): SavedConnection[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function saveConnections(connections: SavedConnection[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
}

/* ─── Main Component ─── */
export default function SettingsPage() {
    const [connections, setConnections] = useState<SavedConnection[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [connectingId, setConnectingId] = useState<string | null>(null);
    const [formFields, setFormFields] = useState<Record<string, string>>({});
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [settingsModal, setSettingsModal] = useState<string | null>(null);

    useEffect(() => { setConnections(loadConnections()); }, []);

    const getConnection = (id: string) => connections.find(c => c.integrationId === id);

    const handleConnect = async (integration: Integration) => {
        setConnectionError(null);

        // Validate all required fields are filled
        const missingFields = integration.authFields.filter(f => !formFields[f.key]?.trim());
        if (missingFields.length > 0) {
            setConnectionError(`Please fill in: ${missingFields.map(f => f.label).join(", ")}`);
            return;
        }

        setIsConnecting(true);

        // Simulate API connection test (in production, this would make a real API call)
        await new Promise(res => setTimeout(res, 2000));

        const newConnection: SavedConnection = {
            integrationId: integration.id,
            fields: { ...formFields },
            connectedAt: new Date().toISOString(),
            lastSyncAt: new Date().toISOString(),
            status: "connected",
        };

        const updated = [...connections.filter(c => c.integrationId !== integration.id), newConnection];
        setConnections(updated);
        saveConnections(updated);
        setIsConnecting(false);
        setConnectingId(null);
        setFormFields({});
    };

    const handleDisconnect = (id: string) => {
        if (confirm("Disconnect this integration? Data syncing will stop.")) {
            const updated = connections.filter(c => c.integrationId !== id);
            setConnections(updated);
            saveConnections(updated);
        }
    };

    const handleSync = async (id: string) => {
        const updated = connections.map(c =>
            c.integrationId === id ? { ...c, status: "syncing" as const } : c
        );
        setConnections(updated);
        saveConnections(updated);

        await new Promise(res => setTimeout(res, 2500));

        const synced = connections.map(c =>
            c.integrationId === id ? { ...c, status: "connected" as const, lastSyncAt: new Date().toISOString() } : c
        );
        setConnections(synced);
        saveConnections(synced);
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
            " at " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    };

    const maskField = (val: string) => val.length > 8 ? val.slice(0, 4) + "••••" + val.slice(-4) : "••••••••";

    return (
        <div style={{ padding: "2rem", maxWidth: 850 }}>
            <header style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>Settings</h1>
                <p style={{ color: "#64748b", fontSize: "0.95rem" }}>Manage your account, integrations, and preferences</p>
            </header>

            {/* ─── Account Settings ─── */}
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem", marginBottom: "2.5rem" }}>
                {settingsSections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <button key={section.name} onClick={() => setSettingsModal(section.name)} style={{
                            display: "flex", alignItems: "center", gap: "1rem",
                            padding: "1.25rem 1.5rem", background: "white", borderRadius: "12px",
                            border: "1px solid #e2e8f0", cursor: "pointer", textAlign: "left" as const, width: "100%",
                        }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: "10px", background: "#f1f5f9",
                                display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", flexShrink: 0,
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

            {/* ─── Settings Modal ─── */}
            {settingsModal && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex",
                    alignItems: "center", justifyContent: "center", zIndex: 1000,
                }} onClick={() => setSettingsModal(null)}>
                    <div onClick={(e) => e.stopPropagation()} style={{
                        background: "white", borderRadius: "16px", padding: "2rem", width: "90%", maxWidth: 500,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>{settingsModal} Settings</h3>
                            <button onClick={() => setSettingsModal(null)} style={{ border: "none", background: "none", cursor: "pointer", color: "#64748b" }}><X size={20} /></button>
                        </div>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6 }}>
                            {settingsModal} management will be fully available in the production release. This will include editing your {settingsModal.toLowerCase()} information, managing preferences, and saving changes to your account.
                        </p>
                        <button onClick={() => setSettingsModal(null)} style={{
                            marginTop: "1.5rem", padding: "0.6rem 1.25rem", borderRadius: "8px",
                            border: "none", background: "#3b82f6", color: "white", fontWeight: 600, cursor: "pointer",
                        }}>Got it</button>
                    </div>
                </div>
            )}

            {/* ─── Integrations ─── */}
            <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <Link2 size={20} style={{ color: "#3b82f6" }} />
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>Integrations</h2>
                    <span style={{
                        fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.5rem", borderRadius: "6px",
                        background: "#dcfce7", color: "#16a34a",
                    }}>{connections.length} connected</span>
                </div>
                <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.25rem", lineHeight: 1.5 }}>
                    Connect your fleet tracking and ELD providers to automatically sync vehicle locations, driver hours, and compliance records. Each provider has different setup steps — click &quot;Connect&quot; for guided setup.
                </p>

                <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
                    {integrations.map((integration) => {
                        const conn = getConnection(integration.id);
                        const isExpanded = expandedId === integration.id;
                        const isConnectForm = connectingId === integration.id;
                        const categoryLabel = integration.category === "eld" ? "ELD Provider" : integration.category === "both" ? "Fleet + ELD" : "Fleet Tracking";
                        const categoryBg = integration.category === "eld" ? "#fef3c7" : integration.category === "both" ? "#ede9fe" : "#eff6ff";
                        const categoryColor = integration.category === "eld" ? "#92400e" : integration.category === "both" ? "#5b21b6" : "#1e40af";

                        return (
                            <div key={integration.id} style={{
                                background: "white",
                                border: `1px solid ${conn ? "#86efac" : "#e2e8f0"}`,
                                borderRadius: "14px", overflow: "hidden",
                            }}>
                                {/* Header Row */}
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem 1.5rem" }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: "12px", background: categoryBg,
                                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                        color: categoryColor,
                                    }}>
                                        {conn ? <Wifi size={22} /> : <WifiOff size={22} style={{ opacity: 0.5 }} />}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" as const }}>
                                            <span style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a" }}>{integration.name}</span>
                                            <span style={{
                                                fontSize: "0.6rem", fontWeight: 600, textTransform: "uppercase" as const,
                                                letterSpacing: "0.05em", padding: "0.15rem 0.5rem", borderRadius: "4px",
                                                background: categoryBg, color: categoryColor,
                                            }}>{categoryLabel}</span>
                                        </div>
                                        <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.15rem" }}>{integration.tagline}</div>
                                        {conn && (
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.35rem", fontSize: "0.7rem", color: "#94a3b8" }}>
                                                <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                                                    <CheckCircle size={10} style={{ color: "#16a34a" }} /> Connected {formatDate(conn.connectedAt)}
                                                </span>
                                                {conn.lastSyncAt && (
                                                    <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                                                        <Clock size={10} /> Last sync {formatDate(conn.lastSyncAt)}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : integration.id)}
                                            style={{
                                                padding: "0.4rem 0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px",
                                                background: "white", fontSize: "0.75rem", color: "#64748b", cursor: "pointer",
                                            }}
                                        >{isExpanded ? "Hide" : "Learn more"}</button>
                                        {conn ? (
                                            <>
                                                <button
                                                    onClick={() => handleSync(integration.id)}
                                                    disabled={conn.status === "syncing"}
                                                    style={{
                                                        display: "flex", alignItems: "center", gap: "0.3rem",
                                                        padding: "0.45rem 0.75rem", border: "1px solid #e2e8f0", borderRadius: "8px",
                                                        background: "white", fontSize: "0.75rem", color: "#334155", cursor: "pointer",
                                                    }}
                                                >
                                                    <RefreshCw size={12} className={conn.status === "syncing" ? "spin" : ""} style={conn.status === "syncing" ? { animation: "spin 1s linear infinite" } : {}} />
                                                    {conn.status === "syncing" ? "Syncing..." : "Sync Now"}
                                                </button>
                                                <button
                                                    onClick={() => handleDisconnect(integration.id)}
                                                    style={{
                                                        padding: "0.45rem 0.75rem", border: "1px solid #fecaca", borderRadius: "8px",
                                                        background: "#fef2f2", fontSize: "0.75rem", color: "#dc2626", cursor: "pointer",
                                                        fontWeight: 500,
                                                    }}
                                                >Disconnect</button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => { setConnectingId(integration.id); setFormFields({}); setConnectionError(null); }}
                                                style={{
                                                    display: "flex", alignItems: "center", gap: "0.3rem",
                                                    padding: "0.5rem 1rem", border: "none", borderRadius: "8px",
                                                    background: "#3b82f6", color: "white", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                                                }}
                                            >Connect</button>
                                        )}
                                    </div>
                                </div>

                                {/* Learn More Panel */}
                                {isExpanded && (
                                    <div style={{ padding: "0 1.5rem 1.25rem", borderTop: "1px solid #f1f5f9" }}>
                                        <div style={{ margin: "1rem 0 0", background: "#f8fafc", padding: "1rem", borderRadius: "8px" }}>
                                            <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.7, margin: "0 0 0.75rem" }}>
                                                {integration.description}
                                            </p>
                                            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.4rem", marginBottom: "0.75rem" }}>
                                                {integration.features.map(f => (
                                                    <span key={f} style={{
                                                        fontSize: "0.7rem", padding: "0.2rem 0.5rem", borderRadius: "4px",
                                                        background: "#e2e8f0", color: "#475569",
                                                    }}>{f}</span>
                                                ))}
                                            </div>
                                            <div style={{ fontSize: "0.75rem", color: "#64748b", display: "flex", gap: "1rem" }}>
                                                <span>API: <code style={{ background: "#e2e8f0", padding: "0.1rem 0.3rem", borderRadius: "3px", fontSize: "0.7rem" }}>{integration.apiBase}</code></span>
                                                <span>Auth: <strong>{integration.authType === "api_key" ? "API Token" : integration.authType === "oauth" ? "OAuth 2.0" : "Username/Password"}</strong></span>
                                                <a href={integration.docsUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                                                    Docs <ExternalLink size={10} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Connection Form Modal */}
                                {isConnectForm && (
                                    <div style={{
                                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                                        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
                                    }} onClick={() => { setConnectingId(null); setConnectionError(null); }}>
                                        <div onClick={(e) => e.stopPropagation()} style={{
                                            background: "white", borderRadius: "16px", padding: "2rem", width: "90%", maxWidth: 500,
                                            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                                        }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>Connect {integration.name}</h3>
                                                <button onClick={() => { setConnectingId(null); setConnectionError(null); }} style={{ border: "none", background: "none", cursor: "pointer", color: "#64748b" }}><X size={20} /></button>
                                            </div>

                                            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.25rem", lineHeight: 1.5 }}>
                                                {integration.authType === "api_key" && `Enter your ${integration.name} API token to connect. This token gives DOT Helper read access to your fleet data.`}
                                                {integration.authType === "oauth" && `Enter your OAuth 2.0 credentials from the ${integration.name} developer portal. We'll use these to securely authorize the connection.`}
                                                {integration.authType === "credentials" && `Enter your ${integration.name} login credentials. These are the same credentials you use to log into ${integration.name}.`}
                                            </p>

                                            {/* Auth Type Badge */}
                                            <div style={{
                                                display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem",
                                                padding: "0.25rem 0.6rem", borderRadius: "6px", background: "#f1f5f9", color: "#475569",
                                                marginBottom: "1rem", fontWeight: 500,
                                            }}>
                                                🔐 {integration.authType === "api_key" ? "Bearer Token Authentication" : integration.authType === "oauth" ? "OAuth 2.0 Authorization" : "Session-Based Authentication"}
                                            </div>

                                            {/* Form Fields */}
                                            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
                                                {integration.authFields.map(field => (
                                                    <div key={field.key}>
                                                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>
                                                            {field.label}
                                                        </label>
                                                        <input
                                                            type={field.type}
                                                            placeholder={field.placeholder}
                                                            value={formFields[field.key] || ""}
                                                            onChange={(e) => setFormFields(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                            style={{
                                                                width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                                                                borderRadius: "8px", fontSize: "0.85rem", fontFamily: field.type === "password" ? "monospace" : "inherit",
                                                            }}
                                                        />
                                                        {field.helpText && (
                                                            <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.2rem" }}>{field.helpText}</div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Error */}
                                            {connectionError && (
                                                <div style={{
                                                    display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.75rem",
                                                    padding: "0.5rem 0.75rem", background: "#fef2f2", borderRadius: "8px",
                                                    fontSize: "0.8rem", color: "#dc2626",
                                                }}>
                                                    <AlertTriangle size={14} /> {connectionError}
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem" }}>
                                                <button
                                                    onClick={() => handleConnect(integration)}
                                                    disabled={isConnecting}
                                                    style={{
                                                        display: "flex", alignItems: "center", gap: "0.4rem",
                                                        padding: "0.65rem 1.5rem", borderRadius: "8px",
                                                        border: "none", background: isConnecting ? "#93c5fd" : "#3b82f6", color: "white",
                                                        fontSize: "0.85rem", fontWeight: 600, cursor: isConnecting ? "not-allowed" : "pointer",
                                                    }}
                                                >
                                                    {isConnecting ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Testing Connection...</> : "Connect & Test"}
                                                </button>
                                                <button
                                                    onClick={() => { setConnectingId(null); setConnectionError(null); }}
                                                    style={{
                                                        padding: "0.65rem 1rem", borderRadius: "8px",
                                                        border: "1px solid #e2e8f0", background: "white",
                                                        fontSize: "0.85rem", color: "#64748b", cursor: "pointer",
                                                    }}
                                                >Cancel</button>
                                            </div>

                                            {/* Docs Link */}
                                            <div style={{ marginTop: "1rem", fontSize: "0.75rem" }}>
                                                <a href={integration.docsUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                                                    View {integration.name} API documentation <ExternalLink size={10} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Connected Details */}
                                {conn && !isExpanded && (
                                    <div style={{ padding: "0 1.5rem 1rem", borderTop: "1px solid #f1f5f9" }}>
                                        <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.75rem" }}>
                                            <strong>Credentials:</strong>{" "}
                                            {integration.authFields.map(f => (
                                                <span key={f.key} style={{
                                                    marginRight: "0.75rem", background: "#f1f5f9", padding: "0.15rem 0.4rem",
                                                    borderRadius: "3px", fontFamily: "monospace", fontSize: "0.7rem",
                                                }}>
                                                    {f.label}: {maskField(conn.fields[f.key] || "")}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CSS for spin animation */}
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
