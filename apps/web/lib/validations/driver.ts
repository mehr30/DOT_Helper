import { z } from "zod";

const cdlClassEnum = z.enum(["A", "B", "C"]);

export const driverCreateSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(100),
    lastName: z.string().min(1, "Last name is required").max(100),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().max(20).optional().or(z.literal("")),
    licenseType: z.enum(["CDL", "NON_CDL"]).default("CDL"),
    cdlNumber: z.string().max(30).optional().or(z.literal("")),
    cdlState: z.string().max(2).optional().or(z.literal("")),
    cdlClass: cdlClassEnum.optional().or(z.literal("")),
    cdlExpiration: z.string().optional().or(z.literal("")),
    medicalCardExpiration: z.string().optional().or(z.literal("")),
    hireDate: z.string().min(1, "Hire date is required"),
    endorsements: z.array(z.string()).default([]),
}).superRefine((data, ctx) => {
    // CDL fields are required when license type is CDL
    if (data.licenseType === "CDL") {
        if (!data.cdlNumber?.trim()) {
            ctx.addIssue({ code: "custom", message: "License number is required for CDL drivers", path: ["cdlNumber"] });
        }
        if (!data.cdlState?.trim()) {
            ctx.addIssue({ code: "custom", message: "Issuing state is required for CDL drivers", path: ["cdlState"] });
        }
        if (!data.cdlExpiration) {
            ctx.addIssue({ code: "custom", message: "License expiration is required for CDL drivers", path: ["cdlExpiration"] });
        }
        // Medical card is tracked but not required at creation — compliance engine flags it if missing
    }
});

export const driverUpdateSchema = z.object({
    id: z.string().min(1),
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().min(1).max(100).optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().max(20).optional().or(z.literal("")),
    licenseType: z.enum(["CDL", "NON_CDL"]).optional(),
    cdlNumber: z.string().max(30).optional().or(z.literal("")),
    cdlState: z.string().max(2).optional().or(z.literal("")),
    cdlClass: cdlClassEnum.optional().or(z.literal("")),
    cdlExpiration: z.string().optional().or(z.literal("")),
    medicalCardExpiration: z.string().optional().or(z.literal("")),
    hireDate: z.string().optional(),
    endorsements: z.array(z.string()).optional(),
});

export type DriverCreateInput = z.input<typeof driverCreateSchema>;
export type DriverUpdateInput = z.input<typeof driverUpdateSchema>;
