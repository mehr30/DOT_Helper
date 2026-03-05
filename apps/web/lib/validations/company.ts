import { z } from "zod";

export const companyOnboardingSchema = z.object({
    name: z.string().min(1, "Company name is required").max(200),
    usdotNumber: z
        .string()
        .min(1, "USDOT number is required")
        .regex(/^\d{1,8}$/, "USDOT number must be 1-8 digits"),
    mcNumber: z.string().max(20).optional().or(z.literal("")),
    address: z.string().max(500).optional().or(z.literal("")),
    city: z.string().max(100).optional().or(z.literal("")),
    state: z.string().max(2).optional().or(z.literal("")),
    zip: z.string().max(10).optional().or(z.literal("")),
    phone: z.string().max(20).optional().or(z.literal("")),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
});

export type CompanyOnboardingInput = z.input<typeof companyOnboardingSchema>;
