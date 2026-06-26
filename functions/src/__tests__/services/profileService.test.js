import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileService } from '../../services/profileService.js';
import { UserNotFound } from '../../utils/exceptions.js';

describe('ProfileService', () => {

    let profileService;
    let mockUserRepository;
    let mockProfileRepository;

    beforeEach(() => {
        mockUserRepository = {
            findById: vi.fn(),
            findByEmail: vi.fn(),
            update: vi.fn(),
            updatePassword: vi.fn()
        };

        mockProfileRepository = {
            findProfileByUserId: vi.fn(),
            update: vi.fn()
        };

        profileService = new ProfileService(mockUserRepository, mockProfileRepository);
    });

    it('Retorna perfil unificado sem passwordHash e sem userId', async () => {
        mockUserRepository.findById.mockResolvedValue({
            id: 'uuid-123',
            name: 'João',
            email: 'joao@teste.com',
            passwordHash: 'hash_secreto',
            role: 'client'
        });

        mockProfileRepository.findProfileByUserId.mockResolvedValue({
            id: 'profile-uuid',
            userId: 'uuid-123',
            phone: '11999999999',
            address: { cep: '01310-100', street: 'Av. Paulista', city: 'SP' }
        });

        const result = await profileService.getProfile('uuid-123');

        expect(result).not.toHaveProperty('passwordHash');
        expect(result).not.toHaveProperty('userId');

        expect(result.name).toBe('João');
        expect(result.phone).toBe('11999999999');
        expect(result.address.city).toBe('SP');
    });

    it('Atualiza a senha corretamente quando o usuário existe', async () => {
        mockUserRepository.findById.mockResolvedValue({
            id: 'uuid-123',
            name: 'João'
        });

        mockUserRepository.updatePassword.mockResolvedValue(undefined);

        await profileService.updatePassword('uuid-123', 'novaSenha456');

        expect(mockUserRepository.updatePassword).toHaveBeenCalledWith(
            'uuid-123',
            expect.not.stringContaining('novaSenha456')
        );
    });

    it('Lança UserNotFound ao tentar atualizar senha de usuário inexistente', async () => {
        mockUserRepository.findById.mockResolvedValue(null);

        await expect(
            profileService.updatePassword('id-inexistente', 'qualquerSenha')
        ).rejects.toThrow(UserNotFound);

        expect(mockUserRepository.updatePassword).not.toHaveBeenCalled();
    });

});
