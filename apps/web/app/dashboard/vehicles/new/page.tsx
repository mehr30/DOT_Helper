"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { vehicleCreateSchema, type VehicleCreateInput } from "../../../../lib/validations/vehicle";
import { createVehicle } from "../../../actions/vehicles";

export default function NewVehiclePage() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<VehicleCreateInput>({
        resolver: zodResolver(vehicleCreateSchema),
        defaultValues: {
            vehicleType: "TRACTOR",
        },
    });

    const onSubmit = async (data: VehicleCreateInput) => {
        setServerError("");
        const result = await createVehicle(data);
        if (result?.error) {
            setServerError(result.error);
            return;
        }
        router.push("/dashboard/vehicles");
    };

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

            {serverError && (
                <div style={{
                    marginBottom: "1rem", padding: "0.75rem 1rem",
                    background: "#fef2f2", border: "1px solid #fecaca",
                    borderRadius: "8px", color: "#dc2626", fontSize: "0.85rem",
                }}>
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                        <label style={labelStyle}>Unit Number *</label>
                        <input {...register("unitNumber")} placeholder="101" style={inputStyle} />
                        {errors.unitNumber && <span style={errorStyle}>{errors.unitNumber.message}</span>}
                    </div>
                    <div>
                        <label style={labelStyle}>Vehicle Type *</label>
                        <select {...register("vehicleType")} style={inputStyle}>
                            <option value="TRACTOR">Tractor / Truck</option>
                            <option value="TRAILER">Trailer</option>
                            <option value="STRAIGHT_TRUCK">Straight Truck</option>
                            <option value="BUS">Bus</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                        <label style={labelStyle}>Year *</label>
                        <input {...register("year")} type="number" placeholder="2024" min={1990} max={2027} style={inputStyle} />
                        {errors.year && <span style={errorStyle}>{errors.year.message}</span>}
                    </div>
                    <div>
                        <label style={labelStyle}>Make *</label>
                        <input {...register("make")} placeholder="Freightliner" style={inputStyle} />
                        {errors.make && <span style={errorStyle}>{errors.make.message}</span>}
                    </div>
                    <div>
                        <label style={labelStyle}>Model *</label>
                        <input {...register("model")} placeholder="Cascadia" style={inputStyle} />
                        {errors.model && <span style={errorStyle}>{errors.model.message}</span>}
                    </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={labelStyle}>VIN</label>
                    <input {...register("vin")} placeholder="1FUJGLDR5CLBP8401" maxLength={17} style={{
                        ...inputStyle, fontFamily: "monospace",
                    }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                        <label style={labelStyle}>License Plate</label>
                        <input {...register("licensePlate")} placeholder="TRK-1234" style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Plate State</label>
                        <input {...register("licensePlateState")} placeholder="KS" maxLength={2} style={inputStyle} />
                    </div>
                </div>

                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem", paddingTop: "0.5rem", borderTop: "1px solid #e2e8f0" }}>
                    Scheduling
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                        <label style={labelStyle}>Annual Inspection Due</label>
                        <input {...register("annualInspectionDue")} type="date" style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Next PM Due</label>
                        <input {...register("nextPmDue")} type="date" style={inputStyle} />
                    </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
                    <button type="submit" disabled={isSubmitting} style={{
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.65rem 1.5rem", borderRadius: "8px",
                        border: "none", background: "#3b82f6", color: "white",
                        fontSize: "0.9rem", fontWeight: 600, cursor: isSubmitting ? "not-allowed" : "pointer",
                        opacity: isSubmitting ? 0.7 : 1,
                    }}>
                        {isSubmitting ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={16} />}
                        {isSubmitting ? "Saving..." : "Save Vehicle"}
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

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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

const errorStyle: React.CSSProperties = {
    display: "block", fontSize: "0.78rem", color: "#dc2626", marginTop: "0.25rem",
};
