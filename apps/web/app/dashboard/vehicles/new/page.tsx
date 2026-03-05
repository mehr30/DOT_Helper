"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, HelpCircle } from "lucide-react";
import { vehicleCreateSchema, type VehicleCreateInput } from "../../../../lib/validations/vehicle";
import { createVehicle } from "../../../actions/vehicles";
import { useCompanyProfile } from "../../../components/CompanyProfileContext";

export default function NewVehiclePage() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");
    const { profile } = useCompanyProfile();
    const companyState = profile.addresses[0]?.state || "";
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<VehicleCreateInput>({
        resolver: zodResolver(vehicleCreateSchema),
        defaultValues: {
            vehicleType: "TRACTOR",
            licensePlateState: companyState,
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
                        <span style={helpStyle}>Your internal ID for this vehicle (e.g., 101, T-5, etc.)</span>
                        {errors.unitNumber && <span style={errorStyle}>{errors.unitNumber.message}</span>}
                    </div>
                    <div>
                        <label style={labelStyle}>Vehicle Type *</label>
                        <select {...register("vehicleType")} style={inputStyle}>
                            <option value="TRACTOR">Semi-Truck (Tractor) — pulls a trailer</option>
                            <option value="STRAIGHT_TRUCK">Straight Truck — box truck, no trailer</option>
                            <option value="PICKUP">Pickup Truck — F-150, Ram, Silverado, etc.</option>
                            <option value="VAN">Van — cargo van, sprinter, service van</option>
                            <option value="SUV">SUV — Tahoe, Expedition, Suburban, etc.</option>
                            <option value="TRAILER">Trailer — pulled by a tractor</option>
                            <option value="BUS">Bus / Passenger Vehicle</option>
                        </select>
                        <span style={helpStyle}>
                            Semi-trucks pull separate trailers. Straight trucks have the cargo area attached (box trucks, flatbeds). Pick the type that best describes your vehicle.
                        </span>
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
                    <span style={helpStyle}>17-character Vehicle Identification Number (found on driver door jamb or dashboard)</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                        <label style={labelStyle}>License Plate</label>
                        <input {...register("licensePlate")} placeholder="TRK-1234" style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Plate State</label>
                        <select {...register("licensePlateState")} style={inputStyle}>
                            <option value="">Select state...</option>
                            <option value="AL">Alabama</option><option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option><option value="AR">Arkansas</option>
                            <option value="CA">California</option><option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option><option value="DE">Delaware</option>
                            <option value="FL">Florida</option><option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option><option value="ID">Idaho</option>
                            <option value="IL">Illinois</option><option value="IN">Indiana</option>
                            <option value="IA">Iowa</option><option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option><option value="LA">Louisiana</option>
                            <option value="ME">Maine</option><option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option><option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option><option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option><option value="MT">Montana</option>
                            <option value="NE">Nebraska</option><option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option><option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option><option value="NY">New York</option>
                            <option value="NC">North Carolina</option><option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option><option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option><option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option><option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option><option value="TN">Tennessee</option>
                            <option value="TX">Texas</option><option value="UT">Utah</option>
                            <option value="VT">Vermont</option><option value="VA">Virginia</option>
                            <option value="WA">Washington</option><option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option><option value="WY">Wyoming</option>
                            <option value="DC">Washington D.C.</option>
                        </select>
                    </div>
                </div>

                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.25rem", paddingTop: "0.5rem", borderTop: "1px solid #e2e8f0" }}>
                    Maintenance Schedule
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1rem" }}>
                    These dates help us alert you before inspections are due. If you don't know them yet, you can add them later.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                        <label style={labelStyle}>
                            Annual DOT Inspection Due
                            <Tooltip text="Every commercial vehicle must pass an annual safety inspection by a certified mechanic. Check your last inspection sticker or report for the date — the next one is due within 12 months." />
                        </label>
                        <input {...register("annualInspectionDue")} type="date" style={inputStyle} />
                        <span style={helpStyle}>
                            When is the next annual DOT safety inspection due? Check the sticker on your vehicle or your last inspection report.
                        </span>
                    </div>
                    <div>
                        <label style={labelStyle}>
                            Next Preventive Maintenance (PM) Due
                            <Tooltip text="Preventive maintenance (PM) is your regular scheduled service — oil changes, brake checks, tire rotations, etc. Most fleets do this every 3-6 months or every 10,000-25,000 miles." />
                        </label>
                        <input {...register("nextPmDue")} type="date" style={inputStyle} />
                        <span style={helpStyle}>
                            When is the next scheduled service? (Oil change, brake check, tire rotation, etc.)
                        </span>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
                    <button type="submit" disabled={isSubmitting} style={{
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.65rem 1.5rem", borderRadius: "8px",
                        border: "none", background: "#22c55e", color: "white",
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

function Tooltip({ text }: { text: string }) {
    const [show, setShow] = useState(false);

    return (
        <span style={{ position: "relative", display: "inline-flex", marginLeft: "0.3rem", verticalAlign: "middle" }}>
            <HelpCircle
                size={14}
                style={{ color: "#94a3b8", cursor: "help" }}
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onClick={() => setShow(!show)}
            />
            {show && (
                <span style={{
                    position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
                    transform: "translateX(-50%)", width: 280, padding: "0.6rem 0.75rem",
                    background: "#1e293b", color: "white", fontSize: "0.75rem",
                    lineHeight: 1.5, borderRadius: "8px", zIndex: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    pointerEvents: "none",
                }}>
                    {text}
                </span>
            )}
        </span>
    );
}

const labelStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", fontSize: "0.85rem", fontWeight: 600,
    color: "#334155", marginBottom: "0.35rem",
};

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0",
    borderRadius: "8px", fontSize: "0.9rem",
};

const errorStyle: React.CSSProperties = {
    display: "block", fontSize: "0.78rem", color: "#dc2626", marginTop: "0.25rem",
};

const helpStyle: React.CSSProperties = {
    display: "block", fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.25rem", lineHeight: 1.4,
};
