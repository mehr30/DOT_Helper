"use client";

import Link from "next/link";
import { ArrowLeft, Save, Truck } from "lucide-react";

export default function NewVehiclePage() {
    return (
        <div style={{ padding: "2rem", maxWidth: 700 }}>
            <Link href="/dashboard/vehicles" style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                color: "#64748b", fontSize: "0.875rem", textDecoration: "none",
                marginBottom: "1.5rem",
            }}>
                <ArrowLeft size={16} /> Back to Vehicles
            </Link>

            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>Add New Vehicle</h1>
            <p style={{ color: "#64748b", marginBottom: "2rem" }}>
                Enter the vehicle or trailer details and registration information.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert("In production, this would save the vehicle to your database."); }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>Unit Number *</label>
                        <input type="text" required placeholder="101" style={{
                            width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                            borderRadius: "8px", fontSize: "0.9rem",
                        }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>Vehicle Type *</label>
                        <select required style={{
                            width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                            borderRadius: "8px", fontSize: "0.9rem",
                        }}>
                            <option value="">Select type...</option>
                            <option value="tractor">Tractor / Truck</option>
                            <option value="trailer">Trailer</option>
                            <option value="straight">Straight Truck</option>
                            <option value="van">Cargo Van</option>
                            <option value="pickup">Pickup Truck</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>Year *</label>
                        <input type="number" required placeholder="2024" min="1990" max="2027" style={{
                            width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                            borderRadius: "8px", fontSize: "0.9rem",
                        }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>Make *</label>
                        <input type="text" required placeholder="Freightliner" style={{
                            width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                            borderRadius: "8px", fontSize: "0.9rem",
                        }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>Model *</label>
                        <input type="text" required placeholder="Cascadia" style={{
                            width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                            borderRadius: "8px", fontSize: "0.9rem",
                        }} />
                    </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>VIN *</label>
                    <input type="text" required placeholder="1FUJGLDR5CLBP8401" maxLength={17} style={{
                        width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                        borderRadius: "8px", fontSize: "0.9rem", fontFamily: "monospace",
                    }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>License Plate</label>
                        <input type="text" placeholder="TRK-1234" style={{
                            width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                            borderRadius: "8px", fontSize: "0.9rem",
                        }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>Plate State</label>
                        <input type="text" placeholder="KS" style={{
                            width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                            borderRadius: "8px", fontSize: "0.9rem",
                        }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "0.35rem" }}>
                            GVWR (lbs) <span title="Gross Vehicle Weight Rating — the maximum weight the vehicle is rated for. Vehicles over 10,001 lbs are subject to DOT regulations." style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", background: "#f1f5f9", fontSize: "0.6rem", lineHeight: "14px", textAlign: "center" as const, color: "#64748b", cursor: "help" }}>?</span>
                        </label>
                        <input type="number" placeholder="26000" style={{
                            width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
                            borderRadius: "8px", fontSize: "0.9rem",
                        }} />
                    </div>
                </div>

                <div style={{
                    padding: "0.75rem 1rem", background: "#fffbeb", borderRadius: "8px",
                    border: "1px solid #fef3c7", marginBottom: "1.5rem", fontSize: "0.825rem", color: "#92400e",
                }}>
                    💡 <strong>Tip:</strong> If the GVWR is over 10,001 lbs, DOT regulations apply. Over 26,001 lbs requires the driver to have a CDL.
                </div>

                <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
                    <button type="submit" style={{
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.65rem 1.5rem", borderRadius: "8px",
                        border: "none", background: "#3b82f6", color: "white",
                        fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
                    }}>
                        <Save size={16} /> Save Vehicle
                    </button>
                    <Link href="/dashboard/vehicles" style={{
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
