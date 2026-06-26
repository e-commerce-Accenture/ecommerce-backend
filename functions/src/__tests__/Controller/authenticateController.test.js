import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthenticateController } from '../../controllers/authenticateController.js';
import { AuthenticateService } from '../../services/authenticateService.js';

vi.mock('../../services/authenticateService.js');

describe('Authenticate Controller', () => {
    let req;
    let res;
    let next;
    let controller;

    beforeEach(() => {
        req = {
            validated: {
                body: {
                    email: 'test@example.com',
                    password: 'password123'
                }
            }
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        next = vi.fn();
        controller = new AuthenticateController();
        vi.clearAllMocks();
    });

    it('deve retornar status 200 e o accessToken em caso de sucesso', async () => {
        const mockToken = 'mock_jwt_token';
        AuthenticateService.prototype.authenticate.mockResolvedValue(mockToken);

        await controller.signIn(req, res, next);

        expect(AuthenticateService.prototype.authenticate).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ accessToken: mockToken });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next(error) em caso de falha', async () => {
        const error = new Error('Falha na autenticação');
        AuthenticateService.prototype.authenticate.mockRejectedValue(error);

        await controller.signIn(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(error);
    });
});
