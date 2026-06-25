import z, { email } from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z.string({ required_error: "name is required"}).min(2),
        email: z
            .string({ required_error: "email is required"})
            .trim()
            .toLowerCase()
            .email(),
        password: z.string({ required_error: "password is required"}).min(6),
    }).strict()
});