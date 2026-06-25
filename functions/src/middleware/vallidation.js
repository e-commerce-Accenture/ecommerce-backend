import z from 'zod';

export const validateRequest = (schema) => (req, res, next) => {
    try {
        const result = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        })

        req.validated = result;
        next();
    } catch (error) {
        next(error);
    }
}