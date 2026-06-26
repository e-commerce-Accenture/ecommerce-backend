import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.hoisted(() => {
    process.env.JWT_SECRET = 'test_secret';
    process.env.JWT_EXPIRATION = '1h';
});

import { generateToken } from '../../middleware/jwt.js';
import jwt from 'jsonwebtoken';

vi.mock('jsonwebtoken');

describe('JWT Utility', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve gerar um token contendo o payload do usuário correto', () => {
        const mockUser = {
            id: 'user-123',
            name: 'Thiago',
            email: 'thiago@teste.com',
            role: 'client'
        };

        jwt.sign.mockReturnValue('mocked_token');
        const token = generateToken(mockUser);
        expect(jwt.sign).toHaveBeenCalledWith(
            {
                id: mockUser.id,
                name: mockUser.name,
                email: mockUser.email,
                role: mockUser.role
            },
            'test_secret',
            { expiresIn: '1h' }
        );
        expect(token).toBe('mocked_token');
    });
});
