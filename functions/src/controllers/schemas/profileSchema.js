import z, { email } from "zod";

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(50).optional(),
        email: z
            .string()
            .trim()
            .toLowerCase()
            .email()
            .optional(),
        phone: z.string().optional(),
        cep: z.string().optional(),
        street: z.string().optional(),
        number: z.string().optional(),
        neighborhood: z.string().max(50).optional(),
        city: z.string().optional(),
        state: z.string().optional()
    }).strict()
});

export const updatePassowrdSchema = z.object({
    body: z.object({
        password: z.string({ required_error: "password is required"})
    })
})