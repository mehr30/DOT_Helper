"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    ClipboardList,
    FileText,
    Printer,
    Save,
    Trash2,
    AlertCircle,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Users,
    Truck,
    Send,
    Copy,
    ExternalLink,
    Loader2,
} from "lucide-react";
import styles from "./page.module.css";
import {
    assessmentQuestions,
    getRecommendedForms,
    dotForms,
    DOTForm,
    FormSection,
    FormField,
    ComplianceAlert,
} from "./forms";
import { saveDocument, getDocumentByFormId, SavedDocument } from "../savedDocuments";
import { useCompanyProfile } from "../../../components/CompanyProfileContext";
import {
    saveWizardFormAsDocument,
    getDriversForWizard,
    getVehiclesForWizard,
    type WizardDriverOption,
    type WizardVehicleOption,
} from "../../../actions/documents";
import { createSigningRequest } from "../../../actions/signing";
import SignaturePad from "../../../components/SignaturePad";
import { formatPhone } from "../../../../lib/formatPhone";

// Map wizard form IDs to database DocumentType values
const formToDocumentType: Record<string, string> = {
    mcs150: "OTHER",
    driverApp: "EMPLOYMENT_APPLICATION",
    annualCertViolations: "OTHER",
    dvir: "OTHER",
    accidentRegister: "OTHER",
    drugAlcoholPolicy: "CLEARINGHOUSE_CONSENT",
    roadTestCert: "ROAD_TEST_CERTIFICATE",
    annualMVRReview: "MVR",
    vehicleMaintenance: "OTHER",
    boc3: "BOC3",
};

type WizardStep = "assessment" | "results" | "fillForm";

function WizardContent() {
    const searchParams = useSearchParams();
    const [step, setStep] = useState<WizardStep>(() => searchParams.get("form") ? "fillForm" : "assessment");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
    const [recommendedForms, setRecommendedForms] = useState<DOTForm[]>([]);
    const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>([]);
    const [activeForm, setActiveForm] = useState<DOTForm | null>(null);
    const [formData, setFormData] = useState<Record<string, string | boolean>>({});
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const [savedForms, setSavedForms] = useState<Set<string>>(new Set());
    const [saveNotice, setSaveNotice] = useState(false);
    const [addressPickerOpen, setAddressPickerOpen] = useState<string | null>(null);
    const [signingLinkUrl, setSigningLinkUrl] = useState<string | null>(null);
    const [signingLinkSending, setSigningLinkSending] = useState(false);
    const [signingLinkCopied, setSigningLinkCopied] = useState(false);
    const { profile, addAddress, removeAddress } = useCompanyProfile();

    // Driver/vehicle selection state
    const [availableDrivers, setAvailableDrivers] = useState<WizardDriverOption[]>([]);
    const [availableVehicles, setAvailableVehicles] = useState<WizardVehicleOption[]>([]);
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [entityLoaded, setEntityLoaded] = useState(false);

    // Load drivers/vehicles list on mount
    useEffect(() => {
        getDriversForWizard().then(setAvailableDrivers).catch(() => {});
        getVehiclesForWizard().then(setAvailableVehicles).catch(() => {});
    }, []);

    // Auto-fill form fields from a selected driver record
    const applyDriverData = (driver: WizardDriverOption, data: Record<string, string | boolean>) => {
        const [firstName, ...rest] = driver.name.split(" ");
        const lastName = rest.join(" ");
        // Map driver fields to common wizard form field IDs
        const map: Record<string, string> = {
            firstName: firstName || "",
            lastName: lastName || "",
            driverName: driver.name,
            employeeName: driver.name,
            licenseNumber: driver.cdlNumber || "",
            licenseState: driver.cdlState || "",
            licenseExpiry: driver.cdlExpiration || "",
            hireDate: driver.hireDate || "",
            endorsements: driver.endorsements?.join(", ") || "",
            phone: driver.phone || "",
            email: driver.email || "",
        };
        // Map CDL class to license class
        if (driver.cdlClass) {
            map.licenseClass = driver.cdlClass;
        }
        for (const [fieldId, value] of Object.entries(map)) {
            if (value && !data[fieldId]) {
                data[fieldId] = value;
            }
        }
        return data;
    };

    // Auto-fill form fields from a selected vehicle record
    const applyVehicleData = (vehicle: WizardVehicleOption, data: Record<string, string | boolean>) => {
        const map: Record<string, string> = {
            vehicle: vehicle.unitNumber,
            unitNumber: vehicle.unitNumber,
            vin: vehicle.vin || "",
            year: vehicle.year?.toString() || "",
            make: `${vehicle.make || ""} ${vehicle.model || ""}`.trim(),
            licensePlate: vehicle.licensePlate || "",
            vehicleUnit: vehicle.unitNumber,
        };
        for (const [fieldId, value] of Object.entries(map)) {
            if (value && !data[fieldId]) {
                data[fieldId] = value;
            }
        }
        return data;
    };

    // Handle ?form= and ?driver= / ?vehicle= query parameters to jump directly to a form
    useEffect(() => {
        if (entityLoaded) return; // Already applied entity data, don't re-run

        const formId = searchParams.get("form");
        const driverIdParam = searchParams.get("driver");
        const vehicleIdParam = searchParams.get("vehicle");

        if (formId) {
            const form = dotForms.find(f => f.id === formId);
            if (form) {
                // If we need driver/vehicle data but it hasn't loaded yet, wait
                if (driverIdParam && availableDrivers.length === 0) return;
                if (vehicleIdParam && availableVehicles.length === 0) return;

                // Load any existing saved data
                const existingDoc = getDocumentByFormId(formId);
                const initialData: Record<string, string | boolean> = existingDoc ? { ...existingDoc.data } : {};

                // Auto-fill company fields and today's date
                const today = new Date().toISOString().split("T")[0] ?? "";
                const autoFillMap: Record<string, string> = {
                    usdotNumber: profile.usdotNumber,
                    carrierName: profile.companyName,
                    companyName: profile.companyName,
                    certDate: today,
                    reviewDate: today,
                    signDate: today,
                    serviceDate: today,
                };
                for (const [fieldId, value] of Object.entries(autoFillMap)) {
                    if (value && !initialData[fieldId]) initialData[fieldId] = value;
                }

                // Apply driver auto-fill if ?driver= param provided
                if (driverIdParam) {
                    const driver = availableDrivers.find(d => d.id === driverIdParam);
                    if (driver) {
                        setSelectedDriverId(driverIdParam);
                        applyDriverData(driver, initialData);
                    }
                }

                // Apply vehicle auto-fill if ?vehicle= param provided
                if (vehicleIdParam) {
                    const vehicle = availableVehicles.find(v => v.id === vehicleIdParam);
                    if (vehicle) {
                        setSelectedVehicleId(vehicleIdParam);
                        applyVehicleData(vehicle, initialData);
                    }
                }

                setEntityLoaded(true);
                setFormData(initialData);
                setActiveForm(form);
                setExpandedSections(new Set(form.sections.map(s => s.id)));
                setStep("fillForm");
            }
        }
    }, [searchParams, availableDrivers, availableVehicles, entityLoaded, profile]);

    // ─── Assessment Logic ──────────────────

    const question = assessmentQuestions[currentQuestion];

    const handleAnswer = (value: string) => {
        if (!question) return;
        if (question.type === "multi") {
            const current = (answers[question.id] as string[]) || [];
            if (value === "none") {
                setAnswers({ ...answers, [question.id]: ["none"] });
            } else {
                const filtered = current.filter(v => v !== "none");
                const updated = filtered.includes(value)
                    ? filtered.filter(v => v !== value)
                    : [...filtered, value];
                setAnswers({ ...answers, [question.id]: updated });
            }
        } else {
            setAnswers({ ...answers, [question.id]: value });
            // Auto-advance for single-select
            if (currentQuestion < assessmentQuestions.length - 1) {
                setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
            }
        }
    };

    const handleFinishAssessment = () => {
        const result = getRecommendedForms(answers);
        setRecommendedForms(result.forms);
        setComplianceAlerts(result.alerts);
        setStep("results");
    };

    const isAnswered = (qId: string) => {
        const a = answers[qId];
        if (Array.isArray(a)) return a.length > 0;
        return !!a;
    };

    const isMultiSelected = (value: string) => {
        if (question?.type !== "multi") return false;
        return ((answers[question.id] as string[]) || []).includes(value);
    };

    // ─── Driver/Vehicle Selection in the wizard ──────────────────

    const handleDriverSelect = (driverId: string) => {
        if (!driverId) {
            setSelectedDriverId(null);
            return;
        }
        const driver = availableDrivers.find(d => d.id === driverId);
        if (!driver) return;
        setSelectedDriverId(driverId);
        setFormData(prev => {
            const updated = { ...prev };
            return applyDriverData(driver, updated);
        });
    };

    const handleVehicleSelect = (vehicleId: string) => {
        if (!vehicleId) {
            setSelectedVehicleId(null);
            return;
        }
        const vehicle = availableVehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;
        setSelectedVehicleId(vehicleId);
        setFormData(prev => {
            const updated = { ...prev };
            return applyVehicleData(vehicle, updated);
        });
    };

    // ─── Form Filling Logic ──────────────────

    const startForm = (form: DOTForm) => {
        // Load any existing saved data
        const existingDoc = getDocumentByFormId(form.id);
        const initialData: Record<string, string | boolean> = existingDoc ? { ...existingDoc.data } : {};

        // Auto-fill company fields and today's date for common date fields
        const today = new Date().toISOString().split("T")[0] ?? "";
        const autoFillMap: Record<string, string> = {
            usdotNumber: profile.usdotNumber,
            carrierName: profile.companyName,
            companyName: profile.companyName,
            phone: profile.phone,
            email: profile.email,
            certDate: today,
            reviewDate: today,
            signDate: today,
            serviceDate: today,
        };
        for (const [fieldId, value] of Object.entries(autoFillMap)) {
            if (value && !initialData[fieldId]) {
                initialData[fieldId] = value;
            }
        }
        // Auto-fill address from first saved address if available
        if (profile.addresses.length > 0 && !initialData["street"]) {
            const addr = profile.addresses[0]!;
            if (!initialData["street"]) initialData["street"] = addr.street;
            if (!initialData["city"]) initialData["city"] = addr.city;
            if (!initialData["state"]) initialData["state"] = addr.state;
            if (!initialData["zip"]) initialData["zip"] = addr.zip;
        }

        // Apply selected driver/vehicle data if already chosen
        if (selectedDriverId && (form.category === "driver" || form.category === "safety")) {
            const driver = availableDrivers.find(d => d.id === selectedDriverId);
            if (driver) applyDriverData(driver, initialData);
        }
        if (selectedVehicleId && form.category === "vehicle") {
            const vehicle = availableVehicles.find(v => v.id === selectedVehicleId);
            if (vehicle) applyVehicleData(vehicle, initialData);
        }

        setActiveForm(form);
        setFormData(initialData);
        setExpandedSections(new Set(form.sections.map(s => s.id)));
        setStep("fillForm");
    };

    const handleFieldChange = (fieldId: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(sectionId)) next.delete(sectionId);
            else next.add(sectionId);
            return next;
        });
    };

    const getRequiredMissing = () => {
        if (!activeForm) return [];
        const missing: string[] = [];
        for (const section of activeForm.sections) {
            for (const field of section.fields) {
                if (!field.required) continue;
                const val = formData[field.id];
                if (field.type === "checkbox") {
                    // Checkboxes only required if explicitly marked (skip for MVR red flags)
                    if (!val) missing.push(field.label);
                } else if (field.type === "signature") {
                    if (!val) missing.push(field.label);
                } else {
                    if (!val || (typeof val === "string" && !val.trim())) missing.push(field.label);
                }
            }
        }
        return missing;
    };

    const handleSaveForm = async () => {
        if (activeForm) {
            // Validate required fields before saving
            const missing = getRequiredMissing();
            if (missing.length > 0) {
                alert(`Please fill out these required fields before saving:\n\n• ${missing.join("\n• ")}`);
                return;
            }

            const totalFields = activeForm.sections.reduce((acc, s) => acc + s.fields.length, 0);
            const completedFields = activeForm.sections.reduce((acc, s) => acc + getFilledCount(s), 0);
            const isComplete = completedFields >= totalFields * 0.8; // 80%+ = completed

            const doc: SavedDocument = {
                id: `wizard_${activeForm.id}_${Date.now()}`,
                formId: activeForm.id,
                title: activeForm.title,
                shortTitle: activeForm.shortTitle,
                category: activeForm.category,
                cfrReference: activeForm.cfrReference,
                data: formData,
                savedAt: new Date().toISOString(),
                completedFields,
                totalFields,
                status: isComplete ? "completed" : "draft",
            };

            // Check if we already saved this form — update instead of creating new
            const existing = getDocumentByFormId(activeForm.id);
            if (existing) {
                doc.id = existing.id;
            }

            saveDocument(doc);
            setSavedForms(prev => new Set(prev).add(activeForm.id));
            setSaveNotice(true);
            setTimeout(() => setSaveNotice(false), 4000);

            // Also save to database so the compliance engine can see it
            try {
                await saveWizardFormAsDocument({
                    formId: activeForm.id,
                    title: activeForm.title,
                    documentType: formToDocumentType[activeForm.id] ?? "OTHER",
                    category: activeForm.category,
                    driverId: selectedDriverId || undefined,
                    vehicleId: selectedVehicleId || undefined,
                });
            } catch {
                // localStorage save succeeded — database save may fail for unauthenticated users
            }

            // Save new address to profile if address fields were filled
            const street = formData["street"] as string;
            const city = formData["city"] as string;
            const state = formData["state"] as string;
            const zip = formData["zip"] as string;
            if (street && city && state) {
                const alreadySaved = profile.addresses.some(
                    a => a.street === street && a.city === city && a.state === state
                );
                if (!alreadySaved) {
                    addAddress({ label: `${city}, ${state}`, street, city, state, zip: zip || "" });
                }
            }
        }
    };

    const handleSendForSignature = async () => {
        if (!activeForm) return;

        // Validate required text/date/select fields are filled (checkboxes + signatures are excluded since the driver fills those)
        const missingFields: string[] = [];
        for (const section of activeForm.sections) {
            for (const field of section.fields) {
                if (!field.required) continue;
                if (field.type === "checkbox" || field.type === "signature") continue; // driver fills these
                const val = formData[field.id];
                if (!val || (typeof val === "string" && !val.trim())) {
                    missingFields.push(field.label);
                }
            }
        }
        if (missingFields.length > 0) {
            alert(`Please fill out the following required fields before sending:\n\n• ${missingFields.join("\n• ")}`);
            return;
        }

        setSigningLinkSending(true);

        // Find the driver's email for auto-sending
        const driverEmail = selectedDriverId
            ? availableDrivers.find(d => d.id === selectedDriverId)?.email || undefined
            : undefined;

        try {
            // Reset checkboxes and signatures so the driver must check/sign themselves
            const signingFormData = { ...formData };
            for (const [key, val] of Object.entries(signingFormData)) {
                if (typeof val === "boolean") signingFormData[key] = false;
                if (typeof val === "string" && val.startsWith("data:image")) delete signingFormData[key];
            }

            const result = await createSigningRequest({
                formId: activeForm.id,
                formTitle: activeForm.title,
                formData: signingFormData,
                driverId: selectedDriverId || undefined,
                vehicleId: selectedVehicleId || undefined,
                driverEmail,
            });

            if ("error" in result) {
                alert(result.error);
            } else if (result.url) {
                setSigningLinkUrl(result.url);
            }
        } catch {
            alert("Failed to create signing link");
        } finally {
            setSigningLinkSending(false);
        }
    };

    const getFilledCount = (section: FormSection) => {
        return section.fields.filter(f => {
            const val = formData[f.id];
            if (f.type === "checkbox") return val === true;
            return !!val;
        }).length;
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case "driver": return "Driver Files";
            case "vehicle": return "Vehicle Records";
            case "company": return "Company Filing";
            case "safety": return "Safety Program";
            default: return category;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "driver": return "#3b82f6";
            case "vehicle": return "#10b981";
            case "company": return "#8b5cf6";
            case "safety": return "#f59e0b";
            default: return "#64748b";
        }
    };

    // ─── Render Field ──────────────────

    const renderField = (field: FormField) => {
        const value = formData[field.id];
        const isAddressField = ["street", "businessAddress"].includes(field.id);

        return (
            <div
                key={field.id}
                className={`${styles.fieldWrapper} ${field.halfWidth ? styles.halfWidth : ""}`}
            >
                <label className={styles.fieldLabel}>
                    {field.label}
                    {field.required && <span className={styles.requiredStar}>*</span>}
                </label>

                {/* Address picker for street/address fields */}
                {isAddressField && profile.addresses.length > 0 && (
                    <div style={{ position: "relative", marginBottom: "0.4rem" }}>
                        <button
                            type="button"
                            onClick={() => setAddressPickerOpen(addressPickerOpen === field.id ? null : field.id)}
                            style={{
                                display: "flex", alignItems: "center", gap: "0.35rem",
                                padding: "0.3rem 0.6rem", fontSize: "0.7rem", fontWeight: 500,
                                border: "1px solid #e2e8f0", borderRadius: "6px",
                                background: "#f8fafc", color: "#3b82f6", cursor: "pointer",
                            }}
                        >
                            📋 Use saved address ({profile.addresses.length})
                        </button>
                        {addressPickerOpen === field.id && (
                            <div style={{
                                position: "absolute", top: "100%", left: 0, zIndex: 20,
                                background: "white", border: "1px solid #e2e8f0",
                                borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                minWidth: 280, marginTop: "0.25rem", overflow: "hidden",
                            }}>
                                <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid #f1f5f9", fontSize: "0.7rem", fontWeight: 600, color: "#64748b" }}>
                                    Select an address
                                </div>
                                {profile.addresses.map(addr => (
                                    <div
                                        key={addr.id}
                                        style={{
                                            display: "flex", alignItems: "center",
                                            borderBottom: "1px solid #f1f5f9",
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    [field.id]: addr.street,
                                                    city: addr.city,
                                                    state: addr.state,
                                                    zip: addr.zip,
                                                }));
                                                setAddressPickerOpen(null);
                                            }}
                                            style={{
                                                flex: 1, textAlign: "left" as const,
                                                padding: "0.5rem 0.75rem", border: "none", background: "none",
                                                cursor: "pointer", fontSize: "0.8rem", lineHeight: 1.4,
                                            }}
                                        >
                                            <div style={{ fontWeight: 500, color: "#0f172a" }}>{addr.label}</div>
                                            <div style={{ color: "#64748b", fontSize: "0.7rem" }}>
                                                {addr.street}, {addr.city}, {addr.state} {addr.zip}
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeAddress(addr.id);
                                            }}
                                            title="Remove address"
                                            style={{
                                                padding: "0.4rem", border: "none", background: "none",
                                                cursor: "pointer", color: "#94a3b8", marginRight: "0.4rem",
                                                borderRadius: "4px", display: "flex",
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                                <div style={{ padding: "0.4rem 0.75rem", borderTop: "1px solid #f1f5f9", fontSize: "0.65rem", color: "#94a3b8" }}>
                                    Or type a new address below
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {field.type === "signature" ? (
                    <div style={{ marginTop: "0.25rem" }}>
                        {value ? (
                            <div style={{
                                display: "flex", alignItems: "center", gap: "0.75rem",
                                padding: "0.75rem 1rem", background: "#f0fdf4",
                                border: "1px solid #86efac", borderRadius: "10px",
                            }}>
                                <img
                                    src={value as string}
                                    alt="Signature"
                                    style={{ height: 48, borderRadius: "4px" }}
                                />
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#16a34a" }}>
                                        Signature captured
                                    </span>
                                    <span className="sig-timestamp" style={{ fontSize: "0.7rem", color: "#64748b", display: "block" }}>
                                        Signed: {(() => {
                                            const ts = formData[`${field.id}_timestamp`];
                                            if (ts && typeof ts === "string") {
                                                return new Date(ts).toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
                                            }
                                            const sd = formData["signDate"] || formData["certDate"];
                                            if (sd && typeof sd === "string") {
                                                return new Date(sd).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
                                            }
                                            return new Date().toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
                                        })()}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleFieldChange(field.id, "")}
                                    style={{
                                        padding: "0.3rem 0.6rem", fontSize: "0.7rem", fontWeight: 500,
                                        border: "1px solid #e2e8f0", borderRadius: "6px",
                                        background: "white", cursor: "pointer", color: "#64748b",
                                    }}
                                >
                                    Re-sign
                                </button>
                            </div>
                        ) : (
                            <SignaturePad
                                onSignature={(dataUrl) => {
                                    handleFieldChange(field.id, dataUrl);
                                    // Capture exact timestamp when signature is drawn
                                    handleFieldChange(`${field.id}_timestamp`, new Date().toISOString());
                                }}
                                width={440}
                                height={150}
                            />
                        )}
                    </div>
                ) : field.type === "checkbox" ? (
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={!!value}
                            onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                            className={styles.checkbox}
                        />
                        <span className={styles.checkboxText}>{field.label}</span>
                    </label>
                ) : field.type === "select" ? (
                    <select
                        value={(value as string) || ""}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className={styles.fieldInput}
                    >
                        {field.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                ) : field.type === "textarea" ? (
                    <textarea
                        value={(value as string) || ""}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className={`${styles.fieldInput} ${styles.textarea}`}
                        rows={3}
                    />
                ) : (
                    <input
                        type={field.type === "ssn" ? "password" : field.type}
                        value={(value as string) || ""}
                        onChange={(e) => handleFieldChange(field.id, field.type === "tel" ? formatPhone(e.target.value) : e.target.value)}
                        placeholder={field.type === "tel" ? "(555) 123-4567" : field.placeholder}
                        className={styles.fieldInput}
                    />
                )}

                {field.helpText && (
                    <span className={styles.helpText}>
                        <HelpCircle size={12} />
                        {field.helpText}
                    </span>
                )}
            </div>
        );
    };

    // ─── RENDER ──────────────────────────

    return (
        <div className={styles.wizard}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/dashboard/documents" className={styles.backLink}>
                        <ArrowLeft size={18} />
                        Back to Documents
                    </Link>
                    <h1 className={styles.title}>
                        {step === "assessment" && "DOT Compliance Setup"}
                        {step === "results" && "Your Required Documents"}
                        {step === "fillForm" && activeForm?.shortTitle}
                    </h1>
                    <p className={styles.subtitle}>
                        {step === "assessment" && "Answer a few simple questions and we'll tell you exactly which DOT documents your business needs."}
                        {step === "results" && "Based on your answers, here are the forms and documents you need to stay compliant."}
                        {step === "fillForm" && activeForm?.description}
                    </p>
                </div>
            </header>

            {/* ─── ASSESSMENT STEP ─── */}
            {step === "assessment" && (
                <div className={styles.assessmentContainer}>
                    {/* Progress */}
                    <div className={styles.progressBar}>
                        {assessmentQuestions.map((q, idx) => (
                            <div
                                key={q.id}
                                className={`${styles.progressDot} ${idx === currentQuestion ? styles.current :
                                    isAnswered(q.id) ? styles.completed : ""
                                    }`}
                                onClick={() => setCurrentQuestion(idx)}
                            >
                                {isAnswered(q.id) && idx !== currentQuestion ? (
                                    <CheckCircle size={14} />
                                ) : (
                                    <span>{idx + 1}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Question Card */}
                    {question && (
                        <div className={styles.questionCard}>
                            <div className={styles.questionNumber}>
                                Question {currentQuestion + 1} of {assessmentQuestions.length}
                            </div>
                            <h2 className={styles.questionTitle}>{question.question}</h2>
                            <p className={styles.questionDesc}>{question.description}</p>

                            {/* State question uses a dropdown */}
                            {question.id === "state" ? (
                                <select
                                    className={styles.stateDropdown}
                                    value={(answers.state as string) || ""}
                                    onChange={(e) => {
                                        handleAnswer(e.target.value);
                                    }}
                                >
                                    <option value="" disabled>Select your state...</option>
                                    {question.options?.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className={styles.optionsGrid}>
                                    {question.type === "multi" && (
                                        <div className={styles.multiSelectHint}>✅ Select all that apply</div>
                                    )}
                                    {question.options?.map(opt => (
                                        <button
                                            key={opt.value}
                                            className={`${styles.optionButton} ${question.type === "multi"
                                                ? isMultiSelected(opt.value) ? styles.selected : ""
                                                : answers[question.id] === opt.value ? styles.selected : ""
                                                } ${question.type === "multi" ? styles.multiOption : ""}`}
                                            onClick={() => handleAnswer(opt.value)}
                                        >
                                            <span className={styles.selectIndicator}>
                                                {question.type === "multi"
                                                    ? (isMultiSelected(opt.value) ? "☑" : "☐")
                                                    : (answers[question.id] === opt.value ? "●" : "○")
                                                }
                                            </span>
                                            <span className={styles.optionIcon}>{opt.icon}</span>
                                            <span className={styles.optionLabel}>{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation */}
                    <div className={styles.assessmentNav}>
                        <button
                            className={styles.navButton}
                            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                            disabled={currentQuestion === 0}
                        >
                            <ArrowLeft size={16} /> Previous
                        </button>

                        {currentQuestion < assessmentQuestions.length - 1 ? (
                            <button
                                className={`${styles.navButton} ${styles.navPrimary}`}
                                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                disabled={!isAnswered(question?.id || "")}
                            >
                                Next <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button
                                className={`${styles.navButton} ${styles.navPrimary}`}
                                onClick={handleFinishAssessment}
                                disabled={!isAnswered(question?.id || "")}
                            >
                                <Sparkles size={16} /> See My Required Documents
                            </button>
                        )}
                    </div>

                    {/* Info box for home service businesses */}
                    {currentQuestion === 0 && (
                        <div className={styles.infoBox}>
                            <AlertCircle size={18} />
                            <div>
                                <strong>Not sure if DOT regulations apply to you?</strong>
                                <p>
                                    If your business operates <em>any</em> vehicle over 10,001 lbs GVWR
                                    (check the sticker inside your driver&apos;s door), you likely need DOT compliance.
                                    And remember: the weight of your vehicle <strong>plus any trailer</strong> counts too.
                                    A work truck pulling an equipment trailer can easily push past 10,001 lbs combined.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ─── RESULTS STEP ─── */}
            {step === "results" && (
                <div className={styles.resultsContainer}>
                    {/* Summary Card */}
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryIcon}>
                            <ClipboardList size={28} />
                        </div>
                        <div className={styles.summaryContent}>
                            <h3>{recommendedForms.length} documents required</h3>
                            <p>
                                Based on your answers, these are the DOT forms and records you need.
                                Click any form to start filling it out right here.
                            </p>
                        </div>
                        <button
                            className={styles.restartButton}
                            onClick={() => { setStep("assessment"); setCurrentQuestion(0); setAnswers({}); }}
                        >
                            Retake Assessment
                        </button>
                    </div>

                    {/* Compliance Alerts */}
                    {complianceAlerts.length > 0 && (
                        <div className={styles.alertsSection}>
                            {complianceAlerts.map((alert, idx) => (
                                <div key={idx} className={`${styles.alertCard} ${styles[alert.type]}`}>
                                    <div className={styles.alertIcon}>
                                        {alert.type === "danger" ? <AlertCircle size={18} /> :
                                            alert.type === "warning" ? <AlertCircle size={18} /> :
                                                <HelpCircle size={18} />}
                                    </div>
                                    <div>
                                        <strong>{alert.title}</strong>
                                        <p>{alert.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Jargon explainer */}
                    <div className={styles.jargonBox}>
                        <HelpCircle size={16} />
                        <div>
                            <strong>Understanding the abbreviations:</strong>
                            <p>
                                <strong>CFR</strong> = Code of Federal Regulations (the official rule book).{" "}
                                <strong>FMCSA</strong> = Federal Motor Carrier Safety Administration (the agency that enforces DOT rules).{" "}
                                <strong>CMV</strong> = Commercial Motor Vehicle (any vehicle over 10,001 lbs used for business).{" "}
                                <strong>GVWR</strong> = Gross Vehicle Weight Rating (max weight your vehicle can carry — check your door sticker).{" "}
                                <strong>GCWR</strong> = Gross Combined Weight Rating (your vehicle + trailer combined weight).
                            </p>
                        </div>
                    </div>

                    {/* Form Cards */}
                    <div className={styles.formCardsGrid}>
                        {recommendedForms.map(form => (
                            <div key={form.id} className={styles.formCard}>
                                <div className={styles.formCardHeader}>
                                    <span
                                        className={styles.formCategoryTag}
                                        style={{ background: getCategoryColor(form.category) + "15", color: getCategoryColor(form.category) }}
                                    >
                                        {getCategoryLabel(form.category)}
                                    </span>
                                    {savedForms.has(form.id) && (
                                        <span className={styles.savedBadge}>
                                            <CheckCircle size={14} /> Saved
                                        </span>
                                    )}
                                </div>
                                <h3 className={styles.formCardTitle}>{form.shortTitle}</h3>
                                <p className={styles.formCardDesc}>{form.description}</p>
                                <div className={styles.formCardMeta}>
                                    <span><FileText size={14} /> {form.cfrReference}</span>
                                    <span>⏱ ~{form.estimatedTime}</span>
                                </div>
                                <button
                                    className={styles.fillButton}
                                    onClick={() => startForm(form)}
                                >
                                    {savedForms.has(form.id) ? "Edit Form" : "Start Filling Out"}
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading state when jumping to a form via URL */}
            {step === "fillForm" && !activeForm && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "4rem 0", color: "#64748b" }}>
                    <Loader2 size={24} style={{ animation: "spin 1s linear infinite", marginRight: "0.5rem" }} />
                    <span>Loading form...</span>
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
            )}

            {/* ─── FILL FORM STEP ─── */}
            {step === "fillForm" && activeForm && (
                <div className={styles.fillContainer}>
                    {/* Form sidebar - sections */}
                    <div className={styles.formSidebar}>
                        <h4 className={styles.sidebarTitle}>Sections</h4>
                        {activeForm.sections.map((section, idx) => {
                            const filled = getFilledCount(section);
                            const total = section.fields.length;
                            return (
                                <button
                                    key={section.id}
                                    className={`${styles.sidebarItem} ${expandedSections.has(section.id) ? styles.active : ""}`}
                                    onClick={() => {
                                        setExpandedSections(new Set([section.id]));
                                        document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                >
                                    <span className={styles.sidebarNumber}>{idx + 1}</span>
                                    <span className={styles.sidebarLabel}>{section.title}</span>
                                    <span className={styles.sidebarProgress}>
                                        {filled}/{total}
                                    </span>
                                </button>
                            );
                        })}

                        <div className={styles.sidebarActions}>
                            <button className={styles.saveButton} onClick={handleSaveForm}>
                                <Save size={16} /> Save to Documents
                            </button>
                            <button className={styles.backToResults} onClick={() => setStep("results")}>
                                <ArrowLeft size={16} /> All Documents
                            </button>
                        </div>
                    </div>

                    {/* Form content */}
                    <div className={styles.formContent}>
                        <div className={styles.formHeader}>
                            <h2>{activeForm.title}</h2>
                            <span className={styles.formRef}>{activeForm.cfrReference}</span>
                        </div>

                        {/* Driver/Vehicle selector for applicable forms */}
                        {(activeForm.category === "driver" || activeForm.category === "safety") && availableDrivers.length > 0 && (
                            <div style={{
                                display: "flex", alignItems: "center", gap: "0.75rem",
                                padding: "0.75rem 1rem", marginBottom: "1rem",
                                background: "#f0fdf4", border: "1px solid #bbf7d0",
                                borderRadius: "10px",
                            }}>
                                <Users size={18} style={{ color: "#16a34a", flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#15803d", display: "block", marginBottom: "0.25rem" }}>
                                        Select Driver / Employee
                                    </label>
                                    <select
                                        value={selectedDriverId || ""}
                                        onChange={(e) => handleDriverSelect(e.target.value)}
                                        style={{
                                            width: "100%", padding: "0.4rem 0.5rem",
                                            border: "1px solid #86efac", borderRadius: "6px",
                                            fontSize: "0.85rem", background: "white",
                                        }}
                                    >
                                        <option value="">— Choose a driver to auto-fill —</option>
                                        {availableDrivers.map(d => (
                                            <option key={d.id} value={d.id}>
                                                {d.name}{d.cdlNumber ? ` (CDL: ${d.cdlNumber})` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {selectedDriverId && (
                                    <CheckCircle size={18} style={{ color: "#16a34a", flexShrink: 0 }} />
                                )}
                            </div>
                        )}
                        {activeForm.category === "vehicle" && availableVehicles.length > 0 && (
                            <div style={{
                                display: "flex", alignItems: "center", gap: "0.75rem",
                                padding: "0.75rem 1rem", marginBottom: "1rem",
                                background: "#f0fdf4", border: "1px solid #bbf7d0",
                                borderRadius: "10px",
                            }}>
                                <Truck size={18} style={{ color: "#16a34a", flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#15803d", display: "block", marginBottom: "0.25rem" }}>
                                        Select Vehicle
                                    </label>
                                    <select
                                        value={selectedVehicleId || ""}
                                        onChange={(e) => handleVehicleSelect(e.target.value)}
                                        style={{
                                            width: "100%", padding: "0.4rem 0.5rem",
                                            border: "1px solid #86efac", borderRadius: "6px",
                                            fontSize: "0.85rem", background: "white",
                                        }}
                                    >
                                        <option value="">— Choose a vehicle to auto-fill —</option>
                                        {availableVehicles.map(v => (
                                            <option key={v.id} value={v.id}>
                                                {v.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {selectedVehicleId && (
                                    <CheckCircle size={18} style={{ color: "#16a34a", flexShrink: 0 }} />
                                )}
                            </div>
                        )}

                        {activeForm.sections.map(section => (
                            <div key={section.id} id={`section-${section.id}`} className={styles.formSection}>
                                <button
                                    className={styles.sectionHeader}
                                    onClick={() => toggleSection(section.id)}
                                >
                                    <div>
                                        <h3 className={styles.sectionTitle}>{section.title}</h3>
                                        {section.description && (
                                            <p className={styles.sectionDesc}>{section.description}</p>
                                        )}
                                    </div>
                                    <div className={styles.sectionMeta}>
                                        <span className={styles.sectionCount}>
                                            {getFilledCount(section)}/{section.fields.length} filled
                                        </span>
                                        {expandedSections.has(section.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </div>
                                </button>

                                {expandedSections.has(section.id) && (
                                    <div className={styles.fieldsGrid}>
                                        {section.fields.map(field => renderField(field))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Bottom actions */}
                        <div className={styles.formBottomActions}>
                            <button className={styles.saveButton} onClick={handleSaveForm}>
                                <Save size={16} /> Save to Documents
                            </button>
                            <button className={styles.downloadButton} onClick={() => {
                                const missing = getRequiredMissing();
                                if (missing.length > 0) {
                                    alert(`Please fill out these required fields before printing:\n\n• ${missing.join("\n• ")}`);
                                    return;
                                }
                                window.print();
                            }}>
                                <Printer size={16} /> Print / Save as PDF
                            </button>
                            {(activeForm.category === "driver" || activeForm.category === "safety") && (
                                <button
                                    className={styles.downloadButton}
                                    onClick={handleSendForSignature}
                                    disabled={signingLinkSending}
                                    style={{
                                        background: "#eff6ff", color: "#2563eb",
                                        border: "1px solid #bfdbfe",
                                    }}
                                >
                                    {signingLinkSending ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={16} />}
                                    {signingLinkSending ? "Creating link..." : "Send for Signature"}
                                </button>
                            )}
                        </div>

                        {/* Signing link modal */}
                        {signingLinkUrl && (
                            <div style={{
                                padding: "1rem", marginTop: "1rem",
                                background: "#eff6ff", border: "1px solid #bfdbfe",
                                borderRadius: "10px",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                    <Send size={16} style={{ color: "#2563eb" }} />
                                    <strong style={{ color: "#1e40af", fontSize: "0.9rem" }}>Signing Link Created</strong>
                                </div>
                                {selectedDriverId && availableDrivers.find(d => d.id === selectedDriverId)?.email && (
                                    <p style={{ color: "#3b82f6", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
                                        An email has been sent to {availableDrivers.find(d => d.id === selectedDriverId)?.email}
                                    </p>
                                )}
                                <div style={{
                                    display: "flex", gap: "0.5rem", alignItems: "center",
                                }}>
                                    <input
                                        readOnly
                                        value={signingLinkUrl}
                                        style={{
                                            flex: 1, padding: "0.5rem 0.75rem",
                                            border: "1px solid #93c5fd", borderRadius: "6px",
                                            fontSize: "0.8rem", background: "white", color: "#1e3a5f",
                                        }}
                                        onClick={(e) => (e.target as HTMLInputElement).select()}
                                    />
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(signingLinkUrl);
                                            setSigningLinkCopied(true);
                                            setTimeout(() => setSigningLinkCopied(false), 2000);
                                        }}
                                        style={{
                                            padding: "0.5rem 0.75rem", border: "1px solid #93c5fd",
                                            borderRadius: "6px", background: "white",
                                            cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem",
                                            fontSize: "0.8rem", fontWeight: 500,
                                            color: signingLinkCopied ? "#16a34a" : "#2563eb",
                                        }}
                                    >
                                        {signingLinkCopied ? <CheckCircle size={14} /> : <Copy size={14} />}
                                        {signingLinkCopied ? "Copied" : "Copy"}
                                    </button>
                                    <a
                                        href={signingLinkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            padding: "0.5rem 0.75rem", border: "1px solid #93c5fd",
                                            borderRadius: "6px", background: "white",
                                            display: "flex", alignItems: "center", gap: "0.3rem",
                                            fontSize: "0.8rem", fontWeight: 500, color: "#2563eb",
                                            textDecoration: "none",
                                        }}
                                    >
                                        <ExternalLink size={14} /> Open
                                    </a>
                                </div>
                                <p style={{ color: "#64748b", fontSize: "0.7rem", marginTop: "0.5rem" }}>
                                    Share this link with the employee. They can review and sign without an account. Link expires in 7 days.
                                </p>
                                <button
                                    onClick={() => setSigningLinkUrl(null)}
                                    style={{
                                        marginTop: "0.5rem", padding: "0.3rem 0.6rem",
                                        border: "none", background: "none",
                                        cursor: "pointer", fontSize: "0.75rem", color: "#94a3b8",
                                    }}
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}

                        {saveNotice && (
                            <div className={styles.savedNotice}>
                                <CheckCircle size={16} />
                                Form saved to your <Link href="/dashboard/documents" style={{ color: "#16a34a", fontWeight: 600 }}>Documents</Link>! You can come back to edit it anytime.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DocumentWizardPage() {
    return (
        <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>Loading wizard...</div>}>
            <WizardContent />
        </Suspense>
    );
}
