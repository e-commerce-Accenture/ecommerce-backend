import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterService } from '../../services/registerService.js';
import { UserAlreadyExists } from '../../utils/exceptions.js';

describe('RegisterService', () => {

    let registerService;
    let mockUserRepository;
    let mockCartRepository;
    let mockProfileRepository;

    beforeEach(() => {
        mockUserRepository = {
            findByEmail: vi.fn(),
            create: vi.fn()
        };

        mockCartRepository = {
            create: vi.fn()
        };

        mockProfileRepository = {
            create: vi.fn()
        };

        registerService = new RegisterService(
            mockUserRepository,
            mockCartRepository,
            mockProfileRepository
        );
    });

    it('Cria um usuário com sucesso e retorna sem o passwordHash', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);

        mockUserRepository.create.mockResolvedValue({
            id: 'uuid-123',
            name: 'João Silva',
            email: 'joao@teste.com',
            passwordHash: 'hash_secreto',
            role: 'client'
        });

        mockCartRepository.create.mockResolvedValue({ id: 'cart-uuid', userId: 'uuid-123' });
        mockProfileRepository.create.mockResolvedValue({ id: 'profile-uuid', userId: 'uuid-123' });

        const result = await registerService.create('João Silva', 'joao@teste.com', 'senha123');

        expect(result).not.toHaveProperty('passwordHash');
        expect(result.name).toBe('João Silva');
        expect(result.email).toBe('joao@teste.com');
        expect(result.role).toBe('client');
    });

    it('Lança UserAlreadyExists quando o email já está cadastrado', async () => {
        mockUserRepository.findByEmail.mockResolvedValue({
            id: 'uuid-existente',
            email: 'joao@teste.com'
        });

        await expect(
            registerService.create('João Silva', 'joao@teste.com', 'senha123')
        ).rejects.toThrow(UserAlreadyExists);

        expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('Cria carrinho e perfil automaticamente após o registro', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.create.mockResolvedValue({
            id: 'uuid-123',
            name: 'Maria',
            email: 'maria@teste.com',
            passwordHash: 'hash_secreto',
            role: 'client'
        });
        mockCartRepository.create.mockResolvedValue({});
        mockProfileRepository.create.mockResolvedValue({});

        await registerService.create('Maria', 'maria@teste.com', 'senha456');

        expect(mockCartRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({ userId: 'uuid-123' })
        );

        expect(mockProfileRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({ userId: 'uuid-123' })
        );
    });

});
