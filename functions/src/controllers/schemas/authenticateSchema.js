import z, { email } from "zod";

export const authenticateSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: "emaail is required"})
            .trim()
            .toLowerCase()
            .email(),
        password: z.string({ required_error: "password is required"}),
    }).strict()
});