import { z } from "zod";

const cdlClassEnum = z.enum(["A", "B", "C"]);

export const driverCreateSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(100),
    lastName: z.string().min(1, "Last name is required").max(100),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().max(20).optional().or(z.literal("")),
    cdlNumber: z.string().min(1, "CDL number is required").max(30),
    cdlState: z.string().min(2, "CDL state is required").max(2),
    cdlClass: cdlClassEnum.default("A"),
    cdlExpiration: z.string().min(1, "CDL expiration is required"),
    medicalCardExpiration: z.string().min(1, "Medical card expiration is required"),
    hireDate: z.string().min(1, "Hire date is required"),
    endorsements: z.array(z.string()).default([]),
});

export const driverUpdateSchema = driverCreateSchema.partial().extend({
    id: z.string().min(1),
});

export type DriverCreateInput = z.input<typeof driverCreateSchema>;
export type DriverUpdateInput = z.input<typeof driverUpdateSchema>;
