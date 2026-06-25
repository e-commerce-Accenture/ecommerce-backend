import z from 'zod';

export const addProductShcema = z.object({
    body: z.object({
        productId: z.string(),
        quantity: z.number().min(0)
    }).strict()
})

export const updateItemSchema = z.object({
    body: z.object({
        quantity: z.number().int().min(0)
    }).strict()
})