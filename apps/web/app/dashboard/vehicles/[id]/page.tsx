"use client";

import Link from "next/link";
import { ArrowLeft, Truck, Wrench, FileText, Clock, CheckCircle } from "lucide-react";

// In production, this would fetch from database
const demoVehicle = {
    unitNumber: "101", make: "Freightliner", model: "Cascadia", year: 2022,
    vin: "1FUJGLDR5CLBP8401", licensePlate: "TRK-1234", licensePlateState: "KS",
    vehicleType: "Tractor", status: "active",
    annualInspectionDue: "Mar 15, 2026", lastPmDate: "Jan 20, 2026",
    nextPmDue: "Apr 20, 2026", mileage: "245,000",
};

export default function VehicleDetailPage() {
    return (
        <div style={{ padding: "2rem", maxWidth: 800 }}>
            <Link href="/dashboard/vehicles" style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                color: "#64748b", fontSize: "0.875rem", textDecoration: "none",
                marginBottom: "1.5rem",
            }}>
                <ArrowLeft size={16} /> Back to Vehicles
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                <div style={{
                    width: 64, height: 64, borderRadius: "16px",
                    background: "#eff6ff", display: "flex",
                    alignItems: "center", justifyContent: "center", color: "#3b82f6",
                }}>
                    <Truck size={28} />
                </div>
                <div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
                        Unit {demoVehicle.unitNumber} — {demoVehicle.year} {demoVehicle.make} {demoVehicle.model}
                    </h1>
                    <p style={{ color: "#64748b", margin: "0.25rem 0 0" }}>
                        {demoVehicle.vehicleType} · {demoVehicle.licensePlate} ({demoVehicle.licensePlateState})
                    </p>
                </div>
                <span style={{
                    marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.3rem",
                    padding: "0.3rem 0.75rem", borderRadius: "6px",
                    background: "#dcfce7", color: "#16a34a", fontSize: "0.8rem", fontWeight: 600,
                }}><CheckCircle size={14} /> {demoVehicle.status}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
                {[
                    { label: "VIN", value: demoVehicle.vin, icon: FileText },
                    { label: "Annual Inspection Due", value: demoVehicle.annualInspectionDue, icon: Clock },
                    { label: "Next PM Due", value: demoVehicle.nextPmDue, icon: Wrench, sub: "Preventive Maintenance" },
                    { label: "Last PM Service", value: demoVehicle.lastPmDate, icon: Wrench },
                    { label: "Mileage", value: `${demoVehicle.mileage} mi`, icon: Truck },
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
                            {item.sub && <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.15rem" }}>{item.sub}</div>}
                        </div>
                    );
                })}
            </div>

            <div style={{
                padding: "1.25rem", background: "#f8fafc", borderRadius: "12px",
                border: "1px solid #e2e8f0", textAlign: "center" as const,
            }}>
                <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
                    🔧 Full vehicle maintenance history, inspection records, and DVIR logs will be available in the production release.
                </p>
            </div>
        </div>
    );
}
