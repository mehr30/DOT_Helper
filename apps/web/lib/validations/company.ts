import { z } from "zod";

// Shared enums
export const operationTypeValues = ["FOR_HIRE", "PRIVATE", "EXEMPT"] as const;
export const operationScopeValues = ["INTERSTATE", "INTRASTATE", "BOTH"] as const;

// Step 1: Essential info (company name required, USDOT optional for new carriers)
export const onboardingStep1Schema = z.object({
    name: z.string().min(1, "Company name is required").max(200),
    usdotNumber: z
        .string()
        .regex(/^(\d{1,8})?$/, "USDOT number must be 1-8 digits")
        .optional()
        .or(z.literal("")),
});

// Step 2: Operation Type + Scope (NEW)
export const onboardingStep2Schema = z.object({
    operationType: z.enum(operationTypeValues),
    operationScope: z.enum(operationScopeValues),
});

// Step 3: Fleet profile (card selection)
export const onboardingStep3Schema = z.object({
    fleetSizeRange: z.enum(["1-5", "6-15", "16-50"]),
    userRole: z.enum(["OWNER", "ADMIN", "DISPATCHER"]),
});

// Step 4: Optional details
export const onboardingStep4Schema = z.object({
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
    .merge(onboardingStep3Schema)
    .merge(onboardingStep4Schema);

// Schema for updating company profile (settings page)
export const companyUpdateSchema = z.object({
    name: z.string().min(1, "Company name is required").max(200),
    usdotNumber: z
        .string()
        .regex(/^(\d{1,8})?$/, "USDOT number must be 1-8 digits")
        .optional()
        .or(z.literal("")),
    mcNumber: z.string().max(20).optional().or(z.literal("")),
    address: z.string().max(500).optional().or(z.literal("")),
    city: z.string().max(100).optional().or(z.literal("")),
    state: z.string().max(2).optional().or(z.literal("")),
    zip: z.string().max(10).optional().or(z.literal("")),
    phone: z.string().max(20).optional().or(z.literal("")),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    operationType: z.enum(operationTypeValues).optional().or(z.literal("")),
    operationScope: z.enum(operationScopeValues).optional().or(z.literal("")),
});

export type OnboardingStep1Input = z.input<typeof onboardingStep1Schema>;
export type OnboardingStep2Input = z.input<typeof onboardingStep2Schema>;
export type OnboardingStep3Input = z.input<typeof onboardingStep3Schema>;
export type OnboardingStep4Input = z.input<typeof onboardingStep4Schema>;
export type CompanyOnboardingInput = z.input<typeof companyOnboardingSchema>;
export type CompanyUpdateInput = z.input<typeof companyUpdateSchema>;
