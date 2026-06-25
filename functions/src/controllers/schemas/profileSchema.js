import z, { email } from "zod";

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        email: z
            .string()
            .trim()
            .toLowerCase()
            .email()
            .optional()
    }).strict()
});