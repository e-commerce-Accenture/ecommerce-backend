import z from 'zod';

export const createProductSchema = z.object({
    body: z.object({
        name: z.string({ required_error: "name is required" }).min(2),
        currentPrice: z.number({ required_error: "currentPrice is required" }),
        originalPrice: z.number({ required_error: "originalPrice is required" }),
        discount: z.number({ required_error: "discount is required" }),
        image: z.string({ required_error: "image is required" }),
        categoryId: z.string({ required_error: "categoryId is required" }),
        stock: z.number({ required_error: "stock is required" }),
        brand: z.string({ required_error: "brand is required" }).min(2)
    }).strict()
});

export const updateProductSchema = z.object({
    body: z.object({
        name: z.string({ required_error: "name is required" }).min(2).optional(),
        currentPrice: z.number({ required_error: "currentPrice is required" }).optional(),
        originalPrice: z.number({ required_error: "originalPrice is required" }).optional(),
        discount: z.number({ required_error: "discount is required" }).optional(),
        image: z.string({ required_error: "image is required" }).optional(),
        categoryId: z.string({ required_error: "categoryId is required" }).optional(),
        stock: z.number({ required_error: "stock is required" }).optional(),
        brand: z.string({ required_error: "brand is required" }).min(2).optional(),
        active: z.boolean({ required_error: "active is required" }).optional()
    }).strict()
});

export const addAttributeSchema = z.object({
    body: z.object({
        title: z.string({ required_error: "title is required" }).min(2),
        paragraph: z.string({ required_error: "paragraph is required" }).min(2)
    }).strict()
});