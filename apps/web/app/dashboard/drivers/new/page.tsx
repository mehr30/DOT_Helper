"use client";

import Link from "next/link";
import { ArrowLeft, Save, User } from "lucide-react";

export default function NewDriverPage() {
    return (
        <div style={{ padding: "2rem", maxWidth: 700 }}>
            <Link href="/dashboard/drivers" style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                color: "#64748b", fontSize: "0.875rem", textDecoration: "none",
                marginBottom: "1.5rem",
            }}>
                <ArrowLeft size={16} /> Back to Drivers
            </Link>

            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>Add New Driver</h1>
            <p style={{ color: "#64748b", marginBottom: "2rem" }}>
                Enter the driver&apos;s details and qualification information.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert("In production, this would save the driver to your database."); }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>First Name *</label>
                        <input type="text" required placeholder="John" style={{
                            width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                            borderRadius: "8px", fontSize: "0.9rem",
                        }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>Last Name *</label>
                        <input type="text" required placeholder="Smith" style={{
                            width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                            borderRadius: "8px", fontSize: "0.9rem",
                        }} />
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>Email</label>
                        <input type="email" placeholder="john@company.com" style={{
                            width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                            borderRadius: "8px", fontSize: "0.9rem",
                        }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>Phone</label>
                        <input type="tel" placeholder="(555) 123-4567" style={{
                            width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                            borderRadius: "8px", fontSize: "0.9rem",
                        }} />
                    </div>
                </div>

                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem", paddingTop: "0.5rem", borderTop: "1px solid #e2e8f0" }}>
                    CDL Information
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.825rem", marginBottom: "1rem" }}>
                    Only required if this driver will operate a commercial motor vehicle (CMV) with a GVWR over 26,001 lbs.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>CDL Number</label>
                        <input type="text" placeholder="D1234567" style={{
                            width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                            borderRadius: "8px", fontSize: "0.9rem",
                        }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>CDL State</label>
                        <input type="text" placeholder="KS" style={{
                            width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                            borderRadius: "8px", fontSize: "0.9rem",
                        }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>CDL Expiration</label>
                        <input type="date" style={{
                            width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                            borderRadius: "8px", fontSize: "0.9rem",
                        }} />
                    </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>Medical Card Expiration</label>
                    <input type="date" style={{
                        width: "100%", maxWidth: 220, padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                        borderRadius: "8px", fontSize: "0.9rem",
                    }} />
                </div>

                <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
                    <button type="submit" style={{
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.65rem 1.5rem", borderRadius: "8px",
                        border: "none", background: "#3b82f6", color: "white",
                        fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
                    }}>
                        <Save size={16} /> Save Driver
                    </button>
                    <Link href="/dashboard/drivers" style={{
                        display: "flex", alignItems: "center",
                        padding: "0.65rem 1.5rem", borderRadius: "8px",
                        border: "1px solid #e2e8f0", background: "white",
                        fontSize: "0.9rem", fontWeight: 500, color: "#475569",
                        textDecoration: "none",
                    }}>
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
