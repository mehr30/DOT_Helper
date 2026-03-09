"use client";

import { useState, useEffect } from "react";
import {
    Users,
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
    Save,
    MapPin,
} from "lucide-react";
import Link from "next/link";
import { updateCompany } from "../../actions/company";
import { formatPhone } from "../../../lib/formatPhone";
import { useCompanyProfile } from "../../components/CompanyProfileContext";

/* ─── Company Data Type ─── */
interface CompanyData {
    id: string;
    name: string;
    usdotNumber: string | null;
    mcNumber: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    phone: string | null;
    email: string | null;
    fleetSizeRange: string | null;
    operationType: string | null;
    operationScope: string | null;
}

/* ─── Account Settings Sections ─── */
const settingsSections = [
    { name: "Company", description: "Company name, USDOT number, and address", icon: Building2 },
    { name: "Team", description: "Manage team members and invitations", icon: Users, href: "/dashboard/settings/team" },
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
    {
        id: "onestep_gps",
        name: "OneStep GPS",
        tagline: "Affordable real-time GPS fleet tracking",
        description: "OneStep GPS provides budget-friendly GPS tracking with no contracts. Their platform offers real-time location, geofencing, speed alerts, and trip history. Uses API key authentication — generate your key from the OneStep GPS dashboard.",
        category: "fleet",
        authType: "api_key",
        authFields: [
            { key: "apiKey", label: "API Key", placeholder: "osg_xxxxxxxxxxxxxxxxxxxx", type: "password", helpText: "Generate from your OneStep GPS dashboard under Account → API" },
        ],
        apiBase: "https://track.onestepgps.com/v3/api",
        docsUrl: "https://track.onestepgps.com/v3/api",
        features: ["Real-time GPS tracking", "Geofencing & alerts", "Speed monitoring", "Trip history & replay", "No long-term contracts"],
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

const US_STATES = [
    { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
    { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
    { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
    { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
    { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
    { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
    { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
    { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
    { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
    { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
    { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
    { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
    { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
    { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
    { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
    { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
    { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" },
];

/* ─── Main Component ─── */
export default function SettingsContent({ company }: { company: CompanyData | null }) {
    const { updateProfile } = useCompanyProfile();
    const [connections, setConnections] = useState<SavedConnection[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [connectingId, setConnectingId] = useState<string | null>(null);
    const [formFields, setFormFields] = useState<Record<string, string>>({});
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [settingsModal, setSettingsModal] = useState<string | null>(null);

    // Company form state
    const [companyForm, setCompanyForm] = useState({
        name: company?.name ?? "",
        usdotNumber: company?.usdotNumber ?? "",
        mcNumber: company?.mcNumber ?? "",
        address: company?.address ?? "",
        city: company?.city ?? "",
        state: company?.state ?? "",
        zip: company?.zip ?? "",
        phone: company?.phone ?? "",
        email: company?.email ?? "",
        operationType: company?.operationType ?? "",
        operationScope: company?.operationScope ?? "",
    });
    const [companySaving, setCompanySaving] = useState(false);
    const [companyMessage, setCompanyMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => { setConnections(loadConnections()); }, []);

    const getConnection = (id: string) => connections.find(c => c.integrationId === id);

    const handleConnect = async (integration: Integration) => {
        setConnectionError(null);
        const missingFields = integration.authFields.filter(f => !formFields[f.key]?.trim());
        if (missingFields.length > 0) {
            setConnectionError(`Please fill in: ${missingFields.map(f => f.label).join(", ")}`);
            return;
        }

        setIsConnecting(true);
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

    const handleCompanySave = async () => {
        setCompanySaving(true);
        setCompanyMessage(null);
        const result = await updateCompany(companyForm);
        setCompanySaving(false);
        if (result.error) {
            setCompanyMessage({ type: "error", text: result.error });
        } else {
            // Update the shared profile context so the sidebar reflects changes immediately
            updateProfile({
                companyName: companyForm.name,
                usdotNumber: companyForm.usdotNumber,
                phone: companyForm.phone,
                email: companyForm.email,
            });
            // Close the modal on success
            setSettingsModal(null);
        }
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
            " at " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    };

    const maskField = (val: string) => val.length > 8 ? val.slice(0, 4) + "••••" + val.slice(-4) : "••••••••";

    const renderCompanyModal = () => (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 1000,
        }} onClick={() => setSettingsModal(null)}>
            <div onClick={(e) => e.stopPropagation()} style={{
                background: "white", borderRadius: "16px", padding: "2rem", width: "90%", maxWidth: 600,
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Company Profile</h3>
                    <button onClick={() => setSettingsModal(null)} style={{ border: "none", background: "none", cursor: "pointer", color: "#64748b" }}><X size={20} /></button>
                </div>

                {!company && (
                    <div style={{
                        padding: "0.75rem 1rem", background: "#fffbeb", border: "1px solid #fef3c7",
                        borderRadius: "8px", marginBottom: "1.25rem", fontSize: "0.85rem", color: "#92400e",
                        display: "flex", alignItems: "center", gap: "0.5rem",
                    }}>
                        <AlertTriangle size={16} />
                        Complete onboarding first to set up your company profile.
                    </div>
                )}

                <div style={{ display: "flex", flexDirection: "column" as const, gap: "1rem" }}>
                    <div>
                        <label style={labelStyle}>Company Name *</label>
                        <input
                            value={companyForm.name}
                            onChange={(e) => setCompanyForm(p => ({ ...p, name: e.target.value }))}
                            placeholder="Your company name"
                            style={inputStyle}
                            disabled={!company}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={labelStyle}>USDOT Number</label>
                            <input
                                value={companyForm.usdotNumber}
                                onChange={(e) => setCompanyForm(p => ({ ...p, usdotNumber: e.target.value.replace(/\D/g, "").slice(0, 8) }))}
                                placeholder="1234567"
                                style={{ ...inputStyle, fontFamily: "monospace" }}
                                disabled={!company}
                            />
                            <span style={helpStyle}>Your 7-8 digit FMCSA registration number</span>
                        </div>
                        <div>
                            <label style={labelStyle}>MC Number</label>
                            <input
                                value={companyForm.mcNumber}
                                onChange={(e) => setCompanyForm(p => ({ ...p, mcNumber: e.target.value }))}
                                placeholder="MC-123456"
                                style={inputStyle}
                                disabled={!company}
                            />
                            <span style={helpStyle}>Motor Carrier number (if applicable)</span>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={labelStyle}>Operation Type</label>
                            <select
                                value={companyForm.operationType}
                                onChange={(e) => setCompanyForm(p => ({ ...p, operationType: e.target.value }))}
                                style={inputStyle}
                                disabled={!company}
                            >
                                <option value="">Not set</option>
                                <option value="FOR_HIRE">For-Hire Carrier</option>
                                <option value="PRIVATE">Private Carrier</option>
                                <option value="EXEMPT">Exempt Carrier</option>
                            </select>
                            <span style={helpStyle}>Determines which compliance items apply</span>
                        </div>
                        <div>
                            <label style={labelStyle}>Operation Scope</label>
                            <select
                                value={companyForm.operationScope}
                                onChange={(e) => setCompanyForm(p => ({ ...p, operationScope: e.target.value }))}
                                style={inputStyle}
                                disabled={!company}
                            >
                                <option value="">Not set</option>
                                <option value="INTERSTATE">Interstate (cross state lines)</option>
                                <option value="INTRASTATE">Intrastate only (one state)</option>
                                <option value="BOTH">Both</option>
                            </select>
                            <span style={helpStyle}>Intrastate carriers have fewer federal requirements</span>
                        </div>
                    </div>

                    <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1rem", marginTop: "0.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem" }}>
                            <MapPin size={16} style={{ color: "#64748b" }} />
                            <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#334155" }}>Business Address</span>
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Street Address</label>
                        <input
                            value={companyForm.address}
                            onChange={(e) => setCompanyForm(p => ({ ...p, address: e.target.value }))}
                            placeholder="123 Main St"
                            style={inputStyle}
                            disabled={!company}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={labelStyle}>City</label>
                            <input
                                value={companyForm.city}
                                onChange={(e) => setCompanyForm(p => ({ ...p, city: e.target.value }))}
                                placeholder="Kansas City"
                                style={inputStyle}
                                disabled={!company}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>State</label>
                            <select
                                value={companyForm.state}
                                onChange={(e) => setCompanyForm(p => ({ ...p, state: e.target.value }))}
                                style={inputStyle}
                                disabled={!company}
                            >
                                <option value="">--</option>
                                {US_STATES.map(s => (
                                    <option key={s.code} value={s.code}>{s.code}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>ZIP</label>
                            <input
                                value={companyForm.zip}
                                onChange={(e) => setCompanyForm(p => ({ ...p, zip: e.target.value }))}
                                placeholder="64101"
                                style={inputStyle}
                                disabled={!company}
                            />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={labelStyle}>Phone</label>
                            <input
                                value={companyForm.phone}
                                onChange={(e) => setCompanyForm(p => ({ ...p, phone: formatPhone(e.target.value) }))}
                                type="tel"
                                placeholder="(555) 123-4567"
                                style={inputStyle}
                                disabled={!company}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Email</label>
                            <input
                                value={companyForm.email}
                                onChange={(e) => setCompanyForm(p => ({ ...p, email: e.target.value }))}
                                placeholder="contact@company.com"
                                type="email"
                                style={inputStyle}
                                disabled={!company}
                            />
                        </div>
                    </div>
                </div>

                {companyMessage && (
                    <div style={{
                        marginTop: "1rem", padding: "0.6rem 1rem", borderRadius: "8px", fontSize: "0.85rem",
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        background: companyMessage.type === "success" ? "#f0fdf4" : "#fef2f2",
                        color: companyMessage.type === "success" ? "#16a34a" : "#dc2626",
                        border: `1px solid ${companyMessage.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                    }}>
                        {companyMessage.type === "success" ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                        {companyMessage.text}
                    </div>
                )}

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
                    <button
                        onClick={handleCompanySave}
                        disabled={companySaving || !company}
                        style={{
                            display: "flex", alignItems: "center", gap: "0.4rem",
                            padding: "0.65rem 1.5rem", borderRadius: "8px",
                            border: "none", background: companySaving ? "#93c5fd" : "#22c55e",
                            color: "white", fontSize: "0.85rem", fontWeight: 600,
                            cursor: companySaving || !company ? "not-allowed" : "pointer",
                            opacity: !company ? 0.5 : 1,
                        }}
                    >
                        {companySaving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={14} />}
                        {companySaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button onClick={() => setSettingsModal(null)} style={{
                        padding: "0.65rem 1rem", borderRadius: "8px",
                        border: "1px solid #e2e8f0", background: "white",
                        fontSize: "0.85rem", color: "#64748b", cursor: "pointer",
                    }}>Cancel</button>
                </div>
            </div>
        </div>
    );

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
                    const cardStyle: React.CSSProperties = {
                        display: "flex", alignItems: "center", gap: "1rem",
                        padding: "1.25rem 1.5rem", background: "white", borderRadius: "12px",
                        border: "1px solid #e2e8f0", cursor: "pointer", textAlign: "left", width: "100%",
                        textDecoration: "none", color: "inherit",
                    };
                    const inner = (
                        <>
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
                        </>
                    );
                    if ("href" in section && section.href) {
                        return (
                            <Link key={section.name} href={section.href} style={cardStyle}>
                                {inner}
                            </Link>
                        );
                    }
                    return (
                        <button key={section.name} onClick={() => setSettingsModal(section.name)} style={cardStyle}>
                            {inner}
                        </button>
                    );
                })}
            </div>

            {/* ─── Settings Modal ─── */}
            {settingsModal === "Company" && renderCompanyModal()}

            {/* ─── Integrations ─── */}
            <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <Link2 size={20} style={{ color: "#22c55e" }} />
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
                                                    <RefreshCw size={12} style={conn.status === "syncing" ? { animation: "spin 1s linear infinite" } : {}} />
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
                                                    background: "#22c55e", color: "white", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
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
                                                <a href={integration.docsUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#22c55e", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
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
                                                {integration.authType === "api_key" && `Enter your ${integration.name} API token to connect. This token gives Greenlight USDOT read access to your fleet data.`}
                                                {integration.authType === "oauth" && `Enter your OAuth 2.0 credentials from the ${integration.name} developer portal. We'll use these to securely authorize the connection.`}
                                                {integration.authType === "credentials" && `Enter your ${integration.name} login credentials. These are the same credentials you use to log into ${integration.name}.`}
                                            </p>

                                            <div style={{
                                                display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem",
                                                padding: "0.25rem 0.6rem", borderRadius: "6px", background: "#f1f5f9", color: "#475569",
                                                marginBottom: "1rem", fontWeight: 500,
                                            }}>
                                                {integration.authType === "api_key" ? "Bearer Token Authentication" : integration.authType === "oauth" ? "OAuth 2.0 Authorization" : "Session-Based Authentication"}
                                            </div>

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

                                            {connectionError && (
                                                <div style={{
                                                    display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.75rem",
                                                    padding: "0.5rem 0.75rem", background: "#fef2f2", borderRadius: "8px",
                                                    fontSize: "0.8rem", color: "#dc2626",
                                                }}>
                                                    <AlertTriangle size={14} /> {connectionError}
                                                </div>
                                            )}

                                            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem" }}>
                                                <button
                                                    onClick={() => handleConnect(integration)}
                                                    disabled={isConnecting}
                                                    style={{
                                                        display: "flex", alignItems: "center", gap: "0.4rem",
                                                        padding: "0.65rem 1.5rem", borderRadius: "8px",
                                                        border: "none", background: isConnecting ? "#86efac" : "#22c55e", color: "white",
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

                                            <div style={{ marginTop: "1rem", fontSize: "0.75rem" }}>
                                                <a href={integration.docsUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#22c55e", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
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

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.85rem", fontWeight: 600,
    color: "#334155", marginBottom: "0.35rem",
};

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
    borderRadius: "8px", fontSize: "0.9rem",
};

const helpStyle: React.CSSProperties = {
    display: "block", fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.2rem",
};
