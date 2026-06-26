import { describe, it, expect, vi, beforeEach } from 'vitest';
import errorHandler from '../../middleware/errorHandler.js';
import { BusinessException, ForbiddenException } from '../../utils/exceptions.js';
import { ZodError } from 'zod';
import messages from '../../utils/messages.js';

describe('Error Handler Middleware', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {};
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        next = vi.fn();
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    it('deve lidar com BusinessException corretamente', () => {
        const error = new BusinessException('Mensagem de erro de negócio', 400);
        errorHandler(error, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'BusinessException',
            message: 'Mensagem de erro de negócio'
        });
    });

    it('deve lidar com ForbiddenException corretamente', () => {
        const error = new ForbiddenException('Acesso negado');
        errorHandler(error, req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            error: 'ForbiddenException',
            message: 'Acesso negado'
        });
    });

    it('deve lidar com ZodError corretamente', () => {
        const mockZodError = new ZodError([
            {
                code: 'invalid_string',
                validation: 'email',
                message: 'Email inválido',
                path: ['email']
            }
        ]);
        errorHandler(mockZodError, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'ZodError',
            message: 'Invalid data',
            fields: { email: ['Email inválido'] }
        });
    });

    it('deve lidar com erros genéricos/desconhecidos com status 500', () => {
        const error = new Error('Bug inesperado');
        errorHandler(error, req, res, next);
        expect(console.error).toHaveBeenCalledWith('Erro interno do servidor:', error);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'InternalServerError',
            message: messages.generic.INTERNAL_ERROR
        });
    });
});
