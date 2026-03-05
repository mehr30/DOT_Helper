"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, HelpCircle } from "lucide-react";
import { driverCreateSchema, type DriverCreateInput } from "../../../../lib/validations/driver";
import { createDriver } from "../../../actions/drivers";
import { useCompanyProfile } from "../../../components/CompanyProfileContext";

export default function NewDriverPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");
    const [licenseType, setLicenseType] = useState<"CDL" | "NON_CDL">("CDL");
    const { profile } = useCompanyProfile();
    const companyState = profile.addresses[0]?.state || "";
    const today = new Date().toISOString().split("T")[0];
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<DriverCreateInput>({
        resolver: zodResolver(driverCreateSchema),
        defaultValues: {
            licenseType: "CDL",
            cdlClass: "A",
            endorsements: [],
            cdlState: companyState,
            hireDate: today,
        },
    });

    const handleLicenseTypeChange = (type: "CDL" | "NON_CDL") => {
        setLicenseType(type);
        setValue("licenseType", type);
        if (type === "NON_CDL") {
            setValue("cdlClass", undefined);
            setValue("endorsements", []);
        }
    };

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
                Enter the driver&apos;s details and license information.
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
                {/* Basic Info */}
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

                {/* License Type Selector */}
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid #e2e8f0" }}>
                    License Information
                </h3>

                <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        What type of license does this driver have?
                        <span
                            title="CDL (Commercial Driver's License) is required for vehicles over 26,001 lbs, buses with 16+ passengers, or hazmat transport. Most pickup trucks and vans only need a regular license."
                            style={{ cursor: "help", color: "#94a3b8" }}
                        >
                            <HelpCircle size={14} />
                        </span>
                    </label>
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.35rem" }}>
                        <button
                            type="button"
                            onClick={() => handleLicenseTypeChange("CDL")}
                            style={{
                                flex: 1, padding: "0.85rem 1rem", borderRadius: "10px",
                                border: licenseType === "CDL" ? "2px solid var(--color-brand-green, #22c55e)" : "1px solid #e2e8f0",
                                background: licenseType === "CDL" ? "#f0fdf4" : "white",
                                cursor: "pointer", textAlign: "left",
                            }}
                        >
                            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0f172a" }}>CDL</div>
                            <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.15rem" }}>
                                Commercial Driver&apos;s License (Class A, B, or C)
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleLicenseTypeChange("NON_CDL")}
                            style={{
                                flex: 1, padding: "0.85rem 1rem", borderRadius: "10px",
                                border: licenseType === "NON_CDL" ? "2px solid var(--color-brand-green, #22c55e)" : "1px solid #e2e8f0",
                                background: licenseType === "NON_CDL" ? "#f0fdf4" : "white",
                                cursor: "pointer", textAlign: "left",
                            }}
                        >
                            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0f172a" }}>Regular License</div>
                            <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.15rem" }}>
                                Standard driver&apos;s license (non-CDL)
                            </div>
                        </button>
                    </div>
                </div>

                {/* CDL-specific fields */}
                {licenseType === "CDL" && (
                    <>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div>
                                <label style={labelStyle}>CDL Number *</label>
                                <input {...register("cdlNumber")} placeholder="D1234567" style={inputStyle} />
                                {errors.cdlNumber && <span style={errorStyle}>{errors.cdlNumber.message}</span>}
                            </div>
                            <div>
                                <label style={labelStyle}>Issuing State *</label>
                                <select {...register("cdlState")} style={inputStyle}>
                                    <option value="">Select state...</option>
                                    <option value="AL">Alabama</option><option value="AK">Alaska</option><option value="AZ">Arizona</option><option value="AR">Arkansas</option>
                                    <option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DE">Delaware</option>
                                    <option value="FL">Florida</option><option value="GA">Georgia</option><option value="HI">Hawaii</option><option value="ID">Idaho</option>
                                    <option value="IL">Illinois</option><option value="IN">Indiana</option><option value="IA">Iowa</option><option value="KS">Kansas</option>
                                    <option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="ME">Maine</option><option value="MD">Maryland</option>
                                    <option value="MA">Massachusetts</option><option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MS">Mississippi</option>
                                    <option value="MO">Missouri</option><option value="MT">Montana</option><option value="NE">Nebraska</option><option value="NV">Nevada</option>
                                    <option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NY">New York</option>
                                    <option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option>
                                    <option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option>
                                    <option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TX">Texas</option><option value="UT">Utah</option>
                                    <option value="VT">Vermont</option><option value="VA">Virginia</option><option value="WA">Washington</option><option value="WV">West Virginia</option>
                                    <option value="WI">Wisconsin</option><option value="WY">Wyoming</option><option value="DC">Washington D.C.</option>
                                </select>
                                {errors.cdlState && <span style={errorStyle}>{errors.cdlState.message}</span>}
                            </div>
                            <div>
                                <label style={labelStyle}>CDL Class</label>
                                <select {...register("cdlClass")} style={inputStyle}>
                                    <option value="A">Class A — Tractor-trailers, semis</option>
                                    <option value="B">Class B — Straight trucks, buses</option>
                                    <option value="C">Class C — Small vehicles (hazmat/passenger)</option>
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
                                <span style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.15rem", display: "block" }}>
                                    DOT medical certificate — usually valid for 2 years
                                </span>
                            </div>
                        </div>
                    </>
                )}

                {/* Non-CDL fields */}
                {licenseType === "NON_CDL" && (
                    <>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div>
                                <label style={labelStyle}>License Number</label>
                                <input {...register("cdlNumber")} placeholder="D1234567" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Issuing State</label>
                                <select {...register("cdlState")} style={inputStyle}>
                                    <option value="">Select state...</option>
                                    <option value="AL">Alabama</option><option value="AK">Alaska</option><option value="AZ">Arizona</option><option value="AR">Arkansas</option>
                                    <option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DE">Delaware</option>
                                    <option value="FL">Florida</option><option value="GA">Georgia</option><option value="HI">Hawaii</option><option value="ID">Idaho</option>
                                    <option value="IL">Illinois</option><option value="IN">Indiana</option><option value="IA">Iowa</option><option value="KS">Kansas</option>
                                    <option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="ME">Maine</option><option value="MD">Maryland</option>
                                    <option value="MA">Massachusetts</option><option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MS">Mississippi</option>
                                    <option value="MO">Missouri</option><option value="MT">Montana</option><option value="NE">Nebraska</option><option value="NV">Nevada</option>
                                    <option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NY">New York</option>
                                    <option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option>
                                    <option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option>
                                    <option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TX">Texas</option><option value="UT">Utah</option>
                                    <option value="VT">Vermont</option><option value="VA">Virginia</option><option value="WA">Washington</option><option value="WV">West Virginia</option>
                                    <option value="WI">Wisconsin</option><option value="WY">Wyoming</option><option value="DC">Washington D.C.</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div>
                                <label style={labelStyle}>License Expiration</label>
                                <input {...register("cdlExpiration")} type="date" style={inputStyle} />
                            </div>
                            <div>
                                <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                                    Medical Card Expiration
                                    <span
                                        title="A DOT medical card may be required even without a CDL if the driver operates a vehicle over 10,001 lbs in interstate commerce."
                                        style={{ cursor: "help", color: "#94a3b8" }}
                                    >
                                        <HelpCircle size={14} />
                                    </span>
                                </label>
                                <input {...register("medicalCardExpiration")} type="date" style={inputStyle} />
                                <span style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.15rem", display: "block" }}>
                                    Only needed if operating vehicles over 10,001 lbs interstate
                                </span>
                            </div>
                        </div>
                    </>
                )}

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={labelStyle}>Hire Date *</label>
                    <input {...register("hireDate")} type="date" style={{ ...inputStyle, maxWidth: 220 }} />
                    {errors.hireDate && <span style={errorStyle}>{errors.hireDate.message}</span>}
                </div>

                <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
                    <button type="submit" disabled={isSubmitting} style={{
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.65rem 1.5rem", borderRadius: "8px",
                        border: "none", background: "var(--color-brand-green, #22c55e)", color: "white",
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
