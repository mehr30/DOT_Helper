"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ArrowLeft, Loader2, Building2, Truck, Users, ShieldCheck, Headset, Check } from "lucide-react";
import {
    onboardingStep1Schema,
    onboardingStep2Schema,
    onboardingStep3Schema,
    type OnboardingStep1Input,
    type OnboardingStep2Input,
    type OnboardingStep3Input,
} from "../../../lib/validations/company";
import { createCompany } from "../../actions/company";
import GreenlightLogo from "../../components/GreenlightLogo";
import styles from "./page.module.css";

type FormData = OnboardingStep1Input & OnboardingStep2Input & Partial<OnboardingStep3Input>;

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Partial<FormData>>({});
    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitToServer = async (data: FormData) => {
        setIsSubmitting(true);
        setServerError("");
        try {
            const result = await createCompany(data);
            if (result?.error) {
                setServerError(result.error);
                // If duplicate USDOT, go back to step 1
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
        { label: "Fleet", number: 2 },
        { label: "Details", number: 3 },
    ];

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
                        defaultValues={formData}
                        onNext={(data) => {
                            setFormData(prev => ({ ...prev, ...data }));
                            setServerError("");
                            setCurrentStep(2);
                        }}
                    />
                )}

                {currentStep === 2 && (
                    <Step2
                        defaultValues={formData}
                        onNext={(data) => {
                            setFormData(prev => ({ ...prev, ...data }));
                            setServerError("");
                            setCurrentStep(3);
                        }}
                        onBack={() => setCurrentStep(1)}
                    />
                )}

                {currentStep === 3 && (
                    <Step3
                        defaultValues={formData}
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
                        onBack={() => setCurrentStep(2)}
                    />
                )}
            </div>
        </div>
    );
}

/* ─── Step 1: Company Info ──────────────────────────────────────────── */

function Step1({
    defaultValues,
    onNext,
}: {
    defaultValues: Partial<FormData>;
    onNext: (data: OnboardingStep1Input) => void;
}) {
    const { register, handleSubmit, formState: { errors } } = useForm<OnboardingStep1Input>({
        resolver: zodResolver(onboardingStep1Schema),
        defaultValues: {
            name: defaultValues.name ?? "",
            usdotNumber: defaultValues.usdotNumber ?? "",
        },
    });

    return (
        <>
            <div className={styles.header}>
                <h1>Set up your company</h1>
                <p>We just need two things to get started.</p>
            </div>
            <form onSubmit={handleSubmit(onNext)}>
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Company Name</label>
                    <input
                        {...register("name")}
                        placeholder="Acme Trucking LLC"
                        className={styles.input}
                        autoFocus
                    />
                    {errors.name && <span className={styles.fieldError}>{errors.name.message}</span>}
                </div>
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
                <div className={styles.buttonRow}>
                    <button type="submit" className={styles.continueButton}>
                        Continue
                        <ArrowRight size={18} />
                    </button>
                </div>
            </form>
        </>
    );
}

/* ─── Step 2: Fleet Profile ─────────────────────────────────────────── */

const fleetOptions = [
    { value: "1-5" as const, label: "1–5 trucks", desc: "Owner-operator or small fleet", icon: Truck },
    { value: "6-15" as const, label: "6–15 trucks", desc: "Growing carrier", icon: Users },
    { value: "16-50" as const, label: "16–50 trucks", desc: "Mid-size fleet", icon: Building2 },
];

const roleOptions = [
    { value: "OWNER" as const, label: "Owner-Operator", desc: "I own and run the fleet", icon: ShieldCheck },
    { value: "ADMIN" as const, label: "Safety Manager", desc: "I manage compliance", icon: ShieldCheck },
    { value: "DISPATCHER" as const, label: "Dispatcher", desc: "I handle operations", icon: Headset },
];

function Step2({
    defaultValues,
    onNext,
    onBack,
}: {
    defaultValues: Partial<FormData>;
    onNext: (data: OnboardingStep2Input) => void;
    onBack: () => void;
}) {
    const [fleetSize, setFleetSize] = useState(defaultValues.fleetSizeRange ?? "");
    const [role, setRole] = useState(defaultValues.userRole ?? "");
    const [error, setError] = useState("");

    const handleContinue = () => {
        const parsed = onboardingStep2Schema.safeParse({
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

/* ─── Step 3: Optional Details ──────────────────────────────────────── */

function Step3({
    defaultValues,
    isSubmitting,
    onSubmit,
    onSkip,
    onBack,
}: {
    defaultValues: Partial<FormData>;
    isSubmitting: boolean;
    onSubmit: (data: OnboardingStep3Input) => void;
    onSkip: () => void;
    onBack: () => void;
}) {
    const { register, handleSubmit, formState: { errors } } = useForm<OnboardingStep3Input>({
        resolver: zodResolver(onboardingStep3Schema),
        defaultValues: {
            mcNumber: defaultValues.mcNumber ?? "",
            address: defaultValues.address ?? "",
            city: defaultValues.city ?? "",
            state: defaultValues.state ?? "",
            zip: defaultValues.zip ?? "",
            phone: defaultValues.phone ?? "",
            email: defaultValues.email ?? "",
        },
    });

    return (
        <>
            <div className={styles.header}>
                <h1>A few more details</h1>
                <p>Optional — you can always add these later in Settings.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.fieldGroup}>
                    <label className={styles.label}>MC Number</label>
                    <input {...register("mcNumber")} placeholder="MC-123456" className={styles.input} />
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Street Address</label>
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
                        <input {...register("phone")} placeholder="(555) 123-4567" className={styles.input} />
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
                    Skip for now — I'll add these later
                </button>
            </form>
        </>
    );
}
