import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateRequest } from '../../middleware/vallidation.js';
import z from 'zod';

describe('Validation Middleware', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {},
            query: {},
            params: {}
        };
        res = {};
        next = vi.fn();
    });
    const mockSchema = z.object({
        body: z.object({
            email: z.string().email()
        })
    });

    it('deve chamar next() e popular req.validated se a validação passar', () => {
        req.body = { email: 'test@example.com' };
        const middleware = validateRequest(mockSchema);
        middleware(req, res, next);
        expect(next).toHaveBeenCalledWith();
        expect(req.validated).toEqual({
            body: { email: 'test@example.com' }
        });
    });

    it('deve passar o erro para next(error) se a validação falhar', () => {
        req.body = { email: 'email_invalido' };
        const middleware = validateRequest(mockSchema);
        middleware(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(z.ZodError));
    });
});
