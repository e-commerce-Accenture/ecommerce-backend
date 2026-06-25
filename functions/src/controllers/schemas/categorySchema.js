import z from 'zod';

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string({ required_error: "name is required"}).min(2),
        imgUrl: z.string({ required_error: "url is required"})
    }).strict()
});

export const updateCategorySchema = z.object({
    body: z.object({
        name: z.string({ required_error: "name is required"}).min(2).optional(),
        imgUrl: z.string({ required_error: "url is required"}).optional()
    }).strict()
});