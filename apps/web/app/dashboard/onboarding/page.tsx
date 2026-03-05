"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Truck, ArrowRight, Loader2 } from "lucide-react";
import {
    companyOnboardingSchema,
    type CompanyOnboardingInput,
} from "../../../lib/validations/company";
import { createCompany } from "../../actions/company";

export default function OnboardingPage() {
    const [serverError, setServerError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CompanyOnboardingInput>({
        resolver: zodResolver(companyOnboardingSchema),
    });

    const onSubmit = async (data: CompanyOnboardingInput) => {
        setServerError("");
        const result = await createCompany(data);
        if (result?.error) {
            setServerError(result.error);
        }
        // On success, the server action redirects to /dashboard
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            padding: "2rem",
        }}>
            <div style={{
                width: "100%",
                maxWidth: 600,
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                padding: "2.5rem",
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.5rem",
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: "12px",
                        background: "#eff6ff", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        color: "#3b82f6",
                    }}>
                        <Truck size={24} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                            Set Up Your Company
                        </h1>
                        <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>
                            Tell us about your business to get started
                        </p>
                    </div>
                </div>

                {serverError && (
                    <div style={{
                        marginTop: "1rem",
                        padding: "0.75rem 1rem",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "8px",
                        color: "#dc2626",
                        fontSize: "0.85rem",
                    }}>
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "1.5rem" }}>
                    {/* Company Name */}
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label style={labelStyle}>Company Name *</label>
                        <input
                            {...register("name")}
                            placeholder="Acme Trucking LLC"
                            style={inputStyle}
                        />
                        {errors.name && <span style={errorStyle}>{errors.name.message}</span>}
                    </div>

                    {/* USDOT + MC */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                        <div>
                            <label style={labelStyle}>USDOT Number *</label>
                            <input
                                {...register("usdotNumber")}
                                placeholder="1234567"
                                style={inputStyle}
                            />
                            {errors.usdotNumber && <span style={errorStyle}>{errors.usdotNumber.message}</span>}
                        </div>
                        <div>
                            <label style={labelStyle}>MC Number</label>
                            <input
                                {...register("mcNumber")}
                                placeholder="MC-123456"
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div style={{ marginBottom: "1.25rem" }}>
                        <label style={labelStyle}>Street Address</label>
                        <input
                            {...register("address")}
                            placeholder="123 Main Street"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                        <div>
                            <label style={labelStyle}>City</label>
                            <input {...register("city")} placeholder="Kansas City" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>State</label>
                            <input {...register("state")} placeholder="KS" maxLength={2} style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>ZIP</label>
                            <input {...register("zip")} placeholder="66101" style={inputStyle} />
                        </div>
                    </div>

                    {/* Contact */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                        <div>
                            <label style={labelStyle}>Phone</label>
                            <input {...register("phone")} placeholder="(555) 123-4567" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Email</label>
                            <input {...register("email")} placeholder="dispatch@company.com" style={inputStyle} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "10px",
                            border: "none",
                            background: "#3b82f6",
                            color: "white",
                            fontSize: "0.95rem",
                            fontWeight: 600,
                            cursor: isSubmitting ? "not-allowed" : "pointer",
                            opacity: isSubmitting ? 0.7 : 1,
                            transition: "all 0.2s ease",
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                                Setting up...
                            </>
                        ) : (
                            <>
                                Continue to Dashboard
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#334155",
    marginBottom: "0.35rem",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.6rem 0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
};

const errorStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.78rem",
    color: "#dc2626",
    marginTop: "0.25rem",
};
