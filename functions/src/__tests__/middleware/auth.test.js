import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authMiddleware, authorizationRoles } from '../../middleware/auth.js';
import jwt from 'jsonwebtoken';
import { ForbiddenException } from '../../utils/exceptions.js';

vi.mock('jsonwebtoken');

describe('Auth Middleware', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        next = vi.fn();
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'test_secret';
    });

    describe('authMiddleware', () => {
        it('deve retornar 401 se o cabeçalho Authorization não for enviado', () => {
            authMiddleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Token not found' });
            expect(next).not.toHaveBeenCalled();
        });

        it('deve retornar 403 se o token for inválido ou expirar', () => {
            req.headers.authorization = 'Bearer token_invalido';
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });
            authMiddleware(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token or expired.' });
            expect(next).not.toHaveBeenCalled();
        });

        it('deve chamar next() e definir req.user se o token for válido', () => {
            req.headers.authorization = 'Bearer token_valido';
            const mockUser = { id: 1, role: 'admin' };
            jwt.verify.mockReturnValue(mockUser);
            authMiddleware(req, res, next);
            expect(jwt.verify).toHaveBeenCalledWith('token_valido', 'test_secret');
            expect(req.user).toEqual(mockUser);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('authorizationRoles', () => {
        it('deve lançar ForbiddenException se a role do usuário não estiver permitida', () => {
            req.user = { role: 'client' };
            const middleware = authorizationRoles('admin', 'manager');
            expect(() => middleware(req, res, next)).toThrow(ForbiddenException);
            expect(next).not.toHaveBeenCalled();
        });

        it('deve chamar next() se a role do usuário estiver permitida', () => {
            req.user = { role: 'admin' };
            const middleware = authorizationRoles('admin', 'manager');
            middleware(req, res, next);
            expect(next).toHaveBeenCalled();
        });
    });
});