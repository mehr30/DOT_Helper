"use client";

import Link from "next/link";
import { ArrowLeft, User, FileText, Shield, Clock } from "lucide-react";

// In production, this would fetch from the database using the ID param
const demoDriver = {
    firstName: "John", lastName: "Smith", email: "john.smith@example.com",
    phone: "(555) 123-4567", cdlNumber: "D1234567", cdlState: "KS",
    cdlExpiration: "Feb 15, 2026", medicalExpiration: "Aug 20, 2026",
    status: "active", complianceScore: 95,
};

export default function DriverDetailPage() {
    return (
        <div style={{ padding: "2rem", maxWidth: 800 }}>
            <Link href="/dashboard/drivers" style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                color: "#64748b", fontSize: "0.875rem", textDecoration: "none",
                marginBottom: "1.5rem",
            }}>
                <ArrowLeft size={16} /> Back to Drivers
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                <div style={{
                    width: 64, height: 64, borderRadius: "16px",
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontSize: "1.25rem", fontWeight: 700,
                }}>
                    {demoDriver.firstName[0]}{demoDriver.lastName[0]}
                </div>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
                        {demoDriver.firstName} {demoDriver.lastName}
                    </h1>
                    <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>{demoDriver.email} · {demoDriver.phone}</p>
                </div>
                <span style={{
                    marginLeft: "auto", padding: "0.3rem 0.75rem", borderRadius: "6px",
                    background: "#dcfce7", color: "#16a34a", fontSize: "0.8rem", fontWeight: 600,
                }}>{demoDriver.status}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
                {[
                    { label: "CDL Number", value: demoDriver.cdlNumber, icon: FileText },
                    { label: "CDL State", value: demoDriver.cdlState, icon: Shield },
                    { label: "CDL Expiration", value: demoDriver.cdlExpiration, icon: Clock },
                    { label: "Medical Card Exp", value: demoDriver.medicalExpiration, icon: Clock },
                ].map(item => {
                    const Icon = item.icon;
                    return (
                        <div key={item.label} style={{
                            padding: "1.25rem", background: "white", borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", fontSize: "0.8rem", marginBottom: "0.35rem" }}>
                                <Icon size={14} /> {item.label}
                            </div>
                            <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "#0f172a" }}>{item.value}</div>
                        </div>
                    );
                })}
            </div>

            <div style={{
                padding: "1.25rem", background: "#f8fafc", borderRadius: "12px",
                border: "1px solid #e2e8f0", textAlign: "center" as const,
            }}>
                <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
                    📋 Full driver qualification file, document uploads, and compliance history will be available in the production release.
                </p>
            </div>
        </div>
    );
}
