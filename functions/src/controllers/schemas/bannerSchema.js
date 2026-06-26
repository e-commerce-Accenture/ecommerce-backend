import z from 'zod'

export const createBannerSchema = z.object({
    body: z.object({
        imgUrl: z.string({ required_error: "url is required"})
    })
});

export const updateBannerSchema = z.object({
    body: z.object({
        imgUrl: z.string({ required_error: "url is required"})
    })
});