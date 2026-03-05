"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { driverCreateSchema, type DriverCreateInput } from "../../../../lib/validations/driver";
import { createDriver } from "../../../actions/drivers";

export default function NewDriverPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<DriverCreateInput>({
        resolver: zodResolver(driverCreateSchema),
        defaultValues: {
            cdlClass: "A",
            endorsements: [],
        },
    });

    const onSubmit = async (data: DriverCreateInput) => {
        setServerError("");
        const result = await createDriver(data);
        if (result?.error) {
            setServerError(result.error);
            return;
        }
        router.push("/dashboard/drivers");
    };

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
                        <label style={labelStyle}>First Name *</label>
                        <input {...register("firstName")} placeholder="John" style={inputStyle} />
                        {errors.firstName && <span style={errorStyle}>{errors.firstName.message}</span>}
                    </div>
                    <div>
                        <label style={labelStyle}>Last Name *</label>
                        <input {...register("lastName")} placeholder="Smith" style={inputStyle} />
                        {errors.lastName && <span style={errorStyle}>{errors.lastName.message}</span>}
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                        <label style={labelStyle}>Email</label>
                        <input {...register("email")} type="email" placeholder="john@company.com" style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Phone</label>
                        <input {...register("phone")} type="tel" placeholder="(555) 123-4567" style={inputStyle} />
                    </div>
                </div>

                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem", paddingTop: "0.5rem", borderTop: "1px solid #e2e8f0" }}>
                    CDL Information
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                        <label style={labelStyle}>CDL Number *</label>
                        <input {...register("cdlNumber")} placeholder="D1234567" style={inputStyle} />
                        {errors.cdlNumber && <span style={errorStyle}>{errors.cdlNumber.message}</span>}
                    </div>
                    <div>
                        <label style={labelStyle}>CDL State *</label>
                        <input {...register("cdlState")} placeholder="KS" maxLength={2} style={inputStyle} />
                        {errors.cdlState && <span style={errorStyle}>{errors.cdlState.message}</span>}
                    </div>
                    <div>
                        <label style={labelStyle}>CDL Class</label>
                        <select {...register("cdlClass")} style={inputStyle}>
                            <option value="A">Class A</option>
                            <option value="B">Class B</option>
                            <option value="C">Class C</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                        <label style={labelStyle}>CDL Expiration *</label>
                        <input {...register("cdlExpiration")} type="date" style={inputStyle} />
                        {errors.cdlExpiration && <span style={errorStyle}>{errors.cdlExpiration.message}</span>}
                    </div>
                    <div>
                        <label style={labelStyle}>Medical Card Expiration *</label>
                        <input {...register("medicalCardExpiration")} type="date" style={inputStyle} />
                        {errors.medicalCardExpiration && <span style={errorStyle}>{errors.medicalCardExpiration.message}</span>}
                    </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={labelStyle}>Hire Date *</label>
                    <input {...register("hireDate")} type="date" style={{ ...inputStyle, maxWidth: 220 }} />
                    {errors.hireDate && <span style={errorStyle}>{errors.hireDate.message}</span>}
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
                        {isSubmitting ? "Saving..." : "Save Driver"}
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
