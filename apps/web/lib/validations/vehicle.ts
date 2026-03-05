import { z } from "zod";

const vehicleTypeEnum = z.enum(["TRACTOR", "TRAILER", "STRAIGHT_TRUCK", "BUS"]);

export const vehicleCreateSchema = z.object({
    unitNumber: z.string().min(1, "Unit number is required").max(30),
    vehicleType: vehicleTypeEnum.default("TRACTOR"),
    make: z.string().min(1, "Make is required").max(100),
    model: z.string().min(1, "Model is required").max(100),
    year: z.coerce.number().min(1900).max(2100),
    vin: z.string().max(17).optional().or(z.literal("")),
    licensePlate: z.string().max(20).optional().or(z.literal("")),
    licensePlateState: z.string().max(2).optional().or(z.literal("")),
    annualInspectionDue: z.string().optional().or(z.literal("")),
    nextPmDue: z.string().optional().or(z.literal("")),
});

export const vehicleUpdateSchema = vehicleCreateSchema.partial().extend({
    id: z.string().min(1),
});

export type VehicleCreateInput = z.input<typeof vehicleCreateSchema>;
export type VehicleUpdateInput = z.input<typeof vehicleUpdateSchema>;
