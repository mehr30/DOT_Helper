import { z } from "zod";

// Step 1: Essential info (required)
export const onboardingStep1Schema = z.object({
    name: z.string().min(1, "Company name is required").max(200),
    usdotNumber: z
        .string()
        .min(1, "USDOT number is required")
        .regex(/^\d{1,8}$/, "USDOT number must be 1-8 digits"),
});

// Step 2: Fleet profile (card selection)
export const onboardingStep2Schema = z.object({
    fleetSizeRange: z.enum(["1-5", "6-15", "16-50"]),
    userRole: z.enum(["OWNER", "ADMIN", "DISPATCHER"]),
});

// Step 3: Optional details
export const onboardingStep3Schema = z.object({
    mcNumber: z.string().max(20).optional().or(z.literal("")),
    address: z.string().max(500).optional().or(z.literal("")),
    city: z.string().max(100).optional().or(z.literal("")),
    state: z.string().max(2).optional().or(z.literal("")),
    zip: z.string().max(10).optional().or(z.literal("")),
    phone: z.string().max(20).optional().or(z.literal("")),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
});

// Combined schema for the createCompany server action
export const companyOnboardingSchema = onboardingStep1Schema
    .merge(onboardingStep2Schema)
    .merge(onboardingStep3Schema);

export type OnboardingStep1Input = z.input<typeof onboardingStep1Schema>;
export type OnboardingStep2Input = z.input<typeof onboardingStep2Schema>;
export type OnboardingStep3Input = z.input<typeof onboardingStep3Schema>;
export type CompanyOnboardingInput = z.input<typeof companyOnboardingSchema>;
