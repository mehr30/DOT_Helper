"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowRight, ArrowLeft, Loader2, Building2, Truck, Users,
    ShieldCheck, Headset, Check, HelpCircle, ExternalLink,
    Search, Sparkles, Globe, Lock, Package,
} from "lucide-react";
import {
    onboardingStep1Schema,
    onboardingStep2Schema,
    onboardingStep3Schema,
    onboardingStep4Schema,
    type OnboardingStep1Input,
    type OnboardingStep2Input,
    type OnboardingStep3Input,
    type OnboardingStep4Input,
} from "../../../lib/validations/company";
import { createCompany } from "../../actions/company";
import styles from "./page.module.css";
import { formatPhone } from "../../../lib/formatPhone";

type FormData = OnboardingStep1Input & OnboardingStep2Input & OnboardingStep3Input & Partial<OnboardingStep4Input>;

// FMCSA lookup response type
interface SAFERData {
    dotNumber: string;
    name: string | null;
    dbaName: string | null;
    mcNumber: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    phone: string | null;
    email: string | null;
    operationType: string | null;
    operationScope: string | null;
    hazmat: boolean;
    statusCode: string | null;
}

type OnboardingPath = "new" | "existing" | null;

export default function OnboardingPage() {
    const [path, setPath] = useState<OnboardingPath>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<Partial<FormData>>({});
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saferData, setSaferData] = useState<SAFERData | null>(null);

    const selectPath = (p: OnboardingPath) => {
        setPath(p);
        setCurrentStep(1);
    };

    const submitToServer = async (data: FormData) => {
        setIsSubmitting(true);
        setServerError("");
        try {
            const result = await createCompany(data);
            if (result?.error) {
                setServerError(result.error);
                if (result.error.includes("USDOT")) {
                    setCurrentStep(1);
                }
                setIsSubmitting(false);
            }
        } catch {
            setServerError("Something went wrong. Please try again.");
            setIsSubmitting(false);
        }
    };

    const steps = [
        { label: "Company", number: 1 },
        { label: "Operation", number: 2 },
        { label: "Fleet", number: 3 },
        { label: "Details", number: 4 },
    ];

    // Step 0: Path selection
    if (currentStep === 0) {
        return (
            <div className={styles.onboardingPage}>
                <div className={styles.onboardingCard}>
                    <div className={styles.header}>
                        <h1>How can we help?</h1>
                        <p>We&apos;ll tailor your setup based on where you are.</p>
                    </div>

                    <div className={styles.pathGrid}>
                        <button
                            type="button"
                            className={styles.pathCard}
                            onClick={() => selectPath("new")}
                        >
                            <div className={styles.pathCardIcon}>
                                <Sparkles size={26} />
                            </div>
                            <span className={styles.pathCardTitle}>Starting Fresh</span>
                            <span className={styles.pathCardDesc}>
                                I&apos;m setting up a brand new carrier or just got my USDOT
                            </span>
                        </button>

                        <button
                            type="button"
                            className={styles.pathCard}
                            onClick={() => selectPath("existing")}
                        >
                            <div className={styles.pathCardIcon}>
                                <Search size={26} />
                            </div>
                            <span className={styles.pathCardTitle}>Already Operating</span>
                            <span className={styles.pathCardDesc}>
                                I have a USDOT number and want to organize my compliance
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.onboardingPage}>
            <div className={styles.onboardingCard}>
                {/* Step Indicator */}
                <div className={styles.stepIndicator}>
                    {steps.map((step, i) => (
                        <div key={step.number} style={{ display: "flex", alignItems: "center" }}>
                            <div className={styles.stepItem}>
                                <div className={`${styles.stepDot} ${
                                    currentStep > step.number ? styles.stepDotCompleted :
                                    currentStep === step.number ? styles.stepDotActive : ""
                                }`}>
                                    {currentStep > step.number ? <Check size={16} /> : step.number}
                                </div>
                                <span className={`${styles.stepLabel} ${
                                    currentStep >= step.number ? styles.stepLabelActive : ""
                                }`}>
                                    {step.label}
                                </span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`${styles.stepLine} ${
                                    currentStep > step.number ? styles.stepLineCompleted : ""
                                }`} />
                            )}
                        </div>
                    ))}
                </div>

                {serverError && (
                    <div className={styles.serverError}>{serverError}</div>
                )}

                {currentStep === 1 && (
                    <Step1
                        path={path!}
                        defaultValues={formData}
                        saferData={saferData}
                        onSaferData={setSaferData}
                        onNext={(data) => {
                            setFormData(prev => ({ ...prev, ...data }));
                            setServerError("");
                            setCurrentStep(2);
                        }}
                        onBack={() => {
                            setCurrentStep(0);
                            setPath(null);
                        }}
                    />
                )}

                {currentStep === 2 && (
                    <Step2OperationType
                        defaultValues={formData}
                        saferData={saferData}
                        onNext={(data) => {
                            setFormData(prev => ({ ...prev, ...data }));
                            setServerError("");
                            setCurrentStep(3);
                        }}
                        onBack={() => setCurrentStep(1)}
                    />
                )}

                {currentStep === 3 && (
                    <Step3Fleet
                        defaultValues={formData}
                        onNext={(data) => {
                            setFormData(prev => ({ ...prev, ...data }));
                            setServerError("");
                            setCurrentStep(4);
                        }}
                        onBack={() => setCurrentStep(2)}
                    />
                )}

                {currentStep === 4 && (
                    <Step4Details
                        defaultValues={formData}
                        saferData={saferData}
                        isSubmitting={isSubmitting}
                        onSubmit={(data) => {
                            const merged = { ...formData, ...data } as FormData;
                            setFormData(merged);
                            submitToServer(merged);
                        }}
                        onSkip={() => {
                            const merged = formData as FormData;
                            submitToServer(merged);
                        }}
                        onBack={() => setCurrentStep(3)}
                    />
                )}
            </div>
        </div>
    );
}

/* ─── Step 1: Company Info + FMCSA Lookup ──────────────────────────── */

function Step1({
    path,
    defaultValues,
    saferData,
    onSaferData,
    onNext,
    onBack,
}: {
    path: OnboardingPath;
    defaultValues: Partial<FormData>;
    saferData: SAFERData | null;
    onSaferData: (d: SAFERData | null) => void;
    onNext: (data: OnboardingStep1Input) => void;
    onBack: () => void;
}) {
    const isExisting = path === "existing";
    const [noDot, setNoDot] = useState(!isExisting && !defaultValues.usdotNumber);
    const [lookupLoading, setLookupLoading] = useState(false);
    const [lookupStatus, setLookupStatus] = useState<"idle" | "found" | "not_found" | "error">("idle");
    const [lookupMessage, setLookupMessage] = useState("");

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<OnboardingStep1Input>({
        resolver: zodResolver(onboardingStep1Schema),
        defaultValues: {
            name: defaultValues.name ?? "",
            usdotNumber: defaultValues.usdotNumber ?? "",
        },
    });

    const dotValue = watch("usdotNumber");

    const handleLookup = useCallback(async () => {
        const dot = dotValue?.trim();
        if (!dot || !/^\d{1,8}$/.test(dot)) return;

        setLookupLoading(true);
        setLookupStatus("idle");
        setLookupMessage("");

        try {
            const res = await fetch(`/api/lookup/safer?dot=${dot}`);
            const data = await res.json();

            if (res.ok && data.name) {
                onSaferData(data);
                setValue("name", data.name);
                setLookupStatus("found");
                setLookupMessage(`Found: ${data.name}`);
            } else if (res.status === 404) {
                setLookupStatus("not_found");
                setLookupMessage(
                    "This USDOT number wasn't found in the federal database. " +
                    "If you just registered, it can take up to 48 hours to appear. " +
                    "You can continue setup — we'll try again later."
                );
                onSaferData(null);
            } else {
                setLookupStatus("error");
                setLookupMessage(data.error || "Lookup failed. You can continue without it.");
                onSaferData(null);
            }
        } catch {
            setLookupStatus("error");
            setLookupMessage("Couldn't reach the lookup service. You can continue manually.");
            onSaferData(null);
        }

        setLookupLoading(false);
    }, [dotValue, setValue, onSaferData]);

    const handleNoDotToggle = () => {
        const next = !noDot;
        setNoDot(next);
        if (next) {
            setValue("usdotNumber", "");
            onSaferData(null);
            setLookupStatus("idle");
        }
    };

    return (
        <>
            <div className={styles.header}>
                <h1>{isExisting ? "Look up your company" : "Set up your company"}</h1>
                <p>{isExisting
                    ? "Enter your USDOT number and we'll pull your info from FMCSA."
                    : "Just your company name to get started."
                }</p>
            </div>
            <form onSubmit={handleSubmit(onNext)}>
                {/* USDOT field — shown first for existing carriers */}
                {isExisting && (
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>USDOT Number</label>
                        <div className={styles.lookupRow}>
                            <input
                                {...register("usdotNumber")}
                                placeholder="1234567"
                                className={styles.input}
                                inputMode="numeric"
                                autoFocus
                            />
                            <button
                                type="button"
                                className={styles.lookupButton}
                                onClick={handleLookup}
                                disabled={lookupLoading || !dotValue?.trim()}
                            >
                                {lookupLoading ? (
                                    <Loader2 size={16} className={styles.spinner} />
                                ) : (
                                    <Search size={16} />
                                )}
                                Look Up
                            </button>
                        </div>
                        {errors.usdotNumber && <span className={styles.fieldError}>{errors.usdotNumber.message}</span>}
                    </div>
                )}

                {lookupStatus === "found" && (
                    <div className={styles.lookupResult}>
                        <Check size={16} />
                        {lookupMessage}
                    </div>
                )}

                {lookupStatus === "not_found" && (
                    <div className={styles.lookupWarning}>
                        {lookupMessage}
                    </div>
                )}

                {lookupStatus === "error" && (
                    <div className={styles.lookupError}>
                        {lookupMessage}
                    </div>
                )}

                {/* Company Name */}
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        Company Name
                        {saferData?.name && (
                            <span className={styles.prefilledBadge}>
                                <Check size={12} /> From FMCSA
                            </span>
                        )}
                    </label>
                    <input
                        {...register("name")}
                        placeholder="Acme Trucking LLC"
                        className={styles.input}
                        autoFocus={!isExisting}
                    />
                    {errors.name && <span className={styles.fieldError}>{errors.name.message}</span>}
                </div>

                {/* USDOT for new carriers */}
                {!isExisting && !noDot && (
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>USDOT Number</label>
                        <input
                            {...register("usdotNumber")}
                            placeholder="1234567"
                            className={styles.input}
                            inputMode="numeric"
                        />
                        {errors.usdotNumber && <span className={styles.fieldError}>{errors.usdotNumber.message}</span>}
                    </div>
                )}

                {!isExisting && (
                    <label style={{
                        display: "flex", alignItems: "center", gap: "0.5rem",
                        fontSize: "0.85rem", color: "#64748b", cursor: "pointer",
                        marginBottom: "0.5rem",
                    }}>
                        <input
                            type="checkbox"
                            checked={noDot}
                            onChange={handleNoDotToggle}
                            style={{ accentColor: "var(--color-brand-green, #22c55e)" }}
                        />
                        I don&apos;t have a USDOT number yet
                    </label>
                )}

                {noDot && !isExisting && (
                    <div style={{
                        padding: "0.75rem 1rem", marginBottom: "1rem",
                        background: "#f0fdf4", border: "1px solid #bbf7d0",
                        borderRadius: "8px", fontSize: "0.8rem", color: "#166534",
                        lineHeight: 1.6,
                    }}>
                        <strong>No problem!</strong> You can add it later in Settings. If you need to apply
                        for a USDOT number, you can do so for free on the FMCSA website:
                        <br />
                        <a
                            href="https://www.fmcsa.dot.gov/registration/getting-started"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "0.25rem",
                                color: "#15803d", fontWeight: 600, marginTop: "0.25rem",
                            }}
                        >
                            FMCSA Registration — Getting Started <ExternalLink size={12} />
                        </a>
                    </div>
                )}

                <div className={styles.buttonRow}>
                    <button type="button" className={styles.backButton} onClick={onBack}>
                        <ArrowLeft size={16} />
                    </button>
                    <button type="submit" className={styles.continueButton}>
                        Continue
                        <ArrowRight size={18} />
                    </button>
                </div>
            </form>
        </>
    );
}

/* ─── Step 2: Operation Type + Scope ───────────────────────────────── */

const operationTypes = [
    {
        value: "FOR_HIRE" as const,
        label: "For-Hire Carrier",
        desc: "You get paid to move other people's freight or passengers",
        icon: Package,
    },
    {
        value: "PRIVATE" as const,
        label: "Private Carrier",
        desc: "You only move your own company's goods (e.g., a bakery delivering its own bread)",
        icon: Lock,
    },
    {
        value: "EXEMPT" as const,
        label: "Exempt Carrier",
        desc: "You haul exempt commodities like farm products or newspapers",
        icon: ShieldCheck,
    },
];

const operationScopes = [
    {
        value: "INTERSTATE" as const,
        label: "Interstate",
        desc: "You cross state lines",
        icon: Globe,
    },
    {
        value: "INTRASTATE" as const,
        label: "Intrastate Only",
        desc: "You only operate within one state",
        icon: Building2,
    },
    {
        value: "BOTH" as const,
        label: "Both",
        desc: "You do both interstate and intrastate",
        icon: Globe,
    },
];

function Step2OperationType({
    defaultValues,
    saferData,
    onNext,
    onBack,
}: {
    defaultValues: Partial<FormData>;
    saferData: SAFERData | null;
    onNext: (data: OnboardingStep2Input) => void;
    onBack: () => void;
}) {
    const [opType, setOpType] = useState(
        defaultValues.operationType ?? saferData?.operationType ?? ""
    );
    const [opScope, setOpScope] = useState(
        defaultValues.operationScope ?? saferData?.operationScope ?? ""
    );
    const [error, setError] = useState("");

    const handleContinue = () => {
        const parsed = onboardingStep2Schema.safeParse({
            operationType: opType,
            operationScope: opScope,
        });
        if (!parsed.success) {
            setError("Please select both your operation type and scope.");
            return;
        }
        setError("");
        onNext(parsed.data);
    };

    return (
        <>
            <div className={styles.header}>
                <h1>How do you operate?</h1>
                <p>This determines which compliance items apply to you.</p>
            </div>

            {error && <div className={styles.serverError}>{error}</div>}

            <div className={styles.selectionSection}>
                <span className={styles.selectionLabel}>
                    What type of carrier are you?
                    {saferData?.operationType && (
                        <span className={styles.prefilledBadge}>
                            <Check size={12} /> Pre-selected from FMCSA
                        </span>
                    )}
                </span>
                <div className={styles.selectionGrid}>
                    {operationTypes.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            className={`${styles.selectionCard} ${opType === opt.value ? styles.selectionCardActive : ""}`}
                            onClick={() => setOpType(opt.value)}
                        >
                            <div className={styles.selectionIcon}>
                                <opt.icon size={20} />
                            </div>
                            <span className={styles.selectionTitle}>{opt.label}</span>
                            <span className={styles.opDescription}>{opt.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.selectionSection}>
                <span className={styles.selectionLabel}>Where do you operate?</span>
                <div className={styles.selectionGrid}>
                    {operationScopes.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            className={`${styles.selectionCard} ${opScope === opt.value ? styles.selectionCardActive : ""}`}
                            onClick={() => setOpScope(opt.value)}
                        >
                            <div className={styles.selectionIcon}>
                                <opt.icon size={20} />
                            </div>
                            <span className={styles.selectionTitle}>{opt.label}</span>
                            <span className={styles.opDescription}>{opt.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.buttonRow}>
                <button type="button" className={styles.backButton} onClick={onBack}>
                    <ArrowLeft size={16} />
                </button>
                <button type="button" className={styles.continueButton} onClick={handleContinue}>
                    Continue
                    <ArrowRight size={18} />
                </button>
            </div>
        </>
    );
}

/* ─── Step 3: Fleet Profile ─────────────────────────────────────────── */

const fleetOptions = [
    { value: "1-5" as const, label: "1\u20135 trucks", desc: "Owner-operator or small fleet", icon: Truck },
    { value: "6-15" as const, label: "6\u201315 trucks", desc: "Growing carrier", icon: Users },
    { value: "16-50" as const, label: "16\u201350 trucks", desc: "Mid-size fleet", icon: Building2 },
];

const roleOptions = [
    { value: "OWNER" as const, label: "Owner-Operator", desc: "I own and run the fleet", icon: ShieldCheck },
    { value: "ADMIN" as const, label: "Safety Manager", desc: "I manage compliance", icon: ShieldCheck },
    { value: "DISPATCHER" as const, label: "Dispatcher", desc: "I handle operations", icon: Headset },
];

function Step3Fleet({
    defaultValues,
    onNext,
    onBack,
}: {
    defaultValues: Partial<FormData>;
    onNext: (data: OnboardingStep3Input) => void;
    onBack: () => void;
}) {
    const [fleetSize, setFleetSize] = useState(defaultValues.fleetSizeRange ?? "");
    const [role, setRole] = useState(defaultValues.userRole ?? "");
    const [error, setError] = useState("");

    const handleContinue = () => {
        const parsed = onboardingStep3Schema.safeParse({
            fleetSizeRange: fleetSize,
            userRole: role,
        });
        if (!parsed.success) {
            setError("Please select both your fleet size and role.");
            return;
        }
        setError("");
        onNext(parsed.data);
    };

    return (
        <>
            <div className={styles.header}>
                <h1>Tell us about your fleet</h1>
                <p>This helps us tailor your compliance dashboard.</p>
            </div>

            {error && <div className={styles.serverError}>{error}</div>}

            <div className={styles.selectionSection}>
                <span className={styles.selectionLabel}>Fleet size</span>
                <div className={styles.selectionGrid}>
                    {fleetOptions.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            className={`${styles.selectionCard} ${fleetSize === opt.value ? styles.selectionCardActive : ""}`}
                            onClick={() => setFleetSize(opt.value)}
                        >
                            <div className={styles.selectionIcon}>
                                <opt.icon size={20} />
                            </div>
                            <span className={styles.selectionTitle}>{opt.label}</span>
                            <span className={styles.selectionDesc}>{opt.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.selectionSection}>
                <span className={styles.selectionLabel}>Your role</span>
                <div className={styles.selectionGrid}>
                    {roleOptions.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            className={`${styles.selectionCard} ${role === opt.value ? styles.selectionCardActive : ""}`}
                            onClick={() => setRole(opt.value)}
                        >
                            <div className={styles.selectionIcon}>
                                <opt.icon size={20} />
                            </div>
                            <span className={styles.selectionTitle}>{opt.label}</span>
                            <span className={styles.selectionDesc}>{opt.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.buttonRow}>
                <button type="button" className={styles.backButton} onClick={onBack}>
                    <ArrowLeft size={16} />
                </button>
                <button type="button" className={styles.continueButton} onClick={handleContinue}>
                    Continue
                    <ArrowRight size={18} />
                </button>
            </div>
        </>
    );
}

/* ─── Step 4: Optional Details ──────────────────────────────────────── */

function Step4Details({
    defaultValues,
    saferData,
    isSubmitting,
    onSubmit,
    onSkip,
    onBack,
}: {
    defaultValues: Partial<FormData>;
    saferData: SAFERData | null;
    isSubmitting: boolean;
    onSubmit: (data: OnboardingStep4Input) => void;
    onSkip: () => void;
    onBack: () => void;
}) {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<OnboardingStep4Input>({
        resolver: zodResolver(onboardingStep4Schema),
        defaultValues: {
            mcNumber: defaultValues.mcNumber ?? saferData?.mcNumber ?? "",
            address: defaultValues.address ?? saferData?.address ?? "",
            city: defaultValues.city ?? saferData?.city ?? "",
            state: defaultValues.state ?? saferData?.state ?? "",
            zip: defaultValues.zip ?? saferData?.zip ?? "",
            phone: defaultValues.phone ?? saferData?.phone ?? "",
            email: defaultValues.email ?? saferData?.email ?? "",
        },
    });

    const hasPrefill = saferData && (saferData.mcNumber || saferData.address || saferData.city);

    return (
        <>
            <div className={styles.header}>
                <h1>A few more details</h1>
                <p>
                    {hasPrefill
                        ? "We pre-filled what we could from FMCSA. Review and adjust as needed."
                        : "Optional \u2014 you can always add these later in Settings."}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.fieldGroup}>
                    <label className={styles.label} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        MC Number
                        <span
                            title="You need an MC number if you haul freight or passengers for hire across state lines. If you only carry your own goods, or only operate within one state, you likely don't need one."
                            style={{ cursor: "help", color: "#94a3b8" }}
                        >
                            <HelpCircle size={14} />
                        </span>
                        {saferData?.mcNumber && (
                            <span className={styles.prefilledBadge}>
                                <Check size={12} /> From FMCSA
                            </span>
                        )}
                    </label>
                    <input {...register("mcNumber")} placeholder="MC-123456" className={styles.input} />
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.15rem", lineHeight: 1.5 }}>
                        You need this if you get paid to move freight or passengers across state lines.
                        Not sure?{" "}
                        <a
                            href="https://www.fmcsa.dot.gov/registration/getting-started"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--color-brand-green, #22c55e)", fontWeight: 500 }}
                        >
                            Check on FMCSA.dot.gov
                        </a>
                    </span>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                        Street Address
                        {saferData?.address && (
                            <span className={styles.prefilledBadge}>
                                <Check size={12} /> From FMCSA
                            </span>
                        )}
                    </label>
                    <input {...register("address")} placeholder="123 Main Street" className={styles.input} />
                </div>

                <div className={`${styles.fieldRow} ${styles.fieldRow3}`}>
                    <div>
                        <label className={styles.label}>City</label>
                        <input {...register("city")} placeholder="Kansas City" className={styles.input} />
                    </div>
                    <div>
                        <label className={styles.label}>State</label>
                        <input {...register("state")} placeholder="KS" maxLength={2} className={styles.input} />
                    </div>
                    <div>
                        <label className={styles.label}>ZIP</label>
                        <input {...register("zip")} placeholder="66101" className={styles.input} />
                    </div>
                </div>

                <div className={`${styles.fieldRow} ${styles.fieldRow2}`}>
                    <div>
                        <label className={styles.label}>Phone</label>
                        <input {...register("phone", { onChange: (e) => setValue("phone", formatPhone(e.target.value)) })} type="tel" placeholder="(555) 123-4567" className={styles.input} />
                        {errors.phone && <span className={styles.fieldError}>{errors.phone.message}</span>}
                    </div>
                    <div>
                        <label className={styles.label}>Email</label>
                        <input {...register("email")} placeholder="dispatch@company.com" className={styles.input} />
                        {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
                    </div>
                </div>

                <div className={styles.buttonRow}>
                    <button type="button" className={styles.backButton} onClick={onBack} disabled={isSubmitting}>
                        <ArrowLeft size={16} />
                    </button>
                    <button type="submit" className={styles.continueButton} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className={styles.spinner} />
                                Setting up...
                            </>
                        ) : (
                            <>
                                Complete Setup
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </div>

                <button
                    type="button"
                    className={styles.skipButton}
                    onClick={onSkip}
                    disabled={isSubmitting}
                >
                    Skip for now — I&apos;ll add these later
                </button>
            </form>
        </>
    );
}
