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

    // --------------------------------------------------
    // CENÁRIO 1: Buscar perfil com sucesso
    // --------------------------------------------------
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

        // Não deve expor dados sensíveis
        expect(result).not.toHaveProperty('passwordHash');
        expect(result).not.toHaveProperty('userId');

        // Deve mesclar dados do usuário e do perfil
        expect(result.name).toBe('João');
        expect(result.phone).toBe('11999999999');
        expect(result.address.city).toBe('SP');
    });

    // --------------------------------------------------
    // CENÁRIO 2: Atualizar senha com sucesso
    // --------------------------------------------------
    it('Atualiza a senha corretamente quando o usuário existe', async () => {
        mockUserRepository.findById.mockResolvedValue({
            id: 'uuid-123',
            name: 'João'
        });

        mockUserRepository.updatePassword.mockResolvedValue(undefined);

        await profileService.updatePassword('uuid-123', 'novaSenha456');

        // Verifica que updatePassword foi chamado com o userId e uma senha hasheada (não a senha pura)
        expect(mockUserRepository.updatePassword).toHaveBeenCalledWith(
            'uuid-123',
            expect.not.stringContaining('novaSenha456') // a senha deve estar hasheada
        );
    });

    // --------------------------------------------------
    // CENÁRIO 3: Atualizar senha de usuário inexistente
    // --------------------------------------------------
    it('Lança UserNotFound ao tentar atualizar senha de usuário inexistente', async () => {
        mockUserRepository.findById.mockResolvedValue(null);

        await expect(
            profileService.updatePassword('id-inexistente', 'qualquerSenha')
        ).rejects.toThrow(UserNotFound);

        // A senha nunca deve ser atualizada se o usuário não existe
        expect(mockUserRepository.updatePassword).not.toHaveBeenCalled();
    });

});
