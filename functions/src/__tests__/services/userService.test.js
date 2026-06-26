import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '../../services/userService.js';
import { UserNotFound, EmailAlreadyExists } from '../../utils/exceptions.js';

describe('UserService', () => {

    let userService;
    let mockUserRepository;

    beforeEach(() => {
        mockUserRepository = {
            findAll: vi.fn(),
            findById: vi.fn(),
            findByEmail: vi.fn(),
            update: vi.fn(),
            deleteById: vi.fn()
        };

        userService = new UserService(mockUserRepository);
    });

    it('Retorna todos os usuários sem o passwordHash', async () => {
        mockUserRepository.findAll.mockResolvedValue([
            { id: 'uuid-1', name: 'João', email: 'joao@teste.com', passwordHash: 'hash1', role: 'client' },
            { id: 'uuid-2', name: 'Maria', email: 'maria@teste.com', passwordHash: 'hash2', role: 'admin' }
        ]);

        const result = await userService.findAll();

        expect(result).toHaveLength(2);
        result.forEach(user => {
            expect(user).not.toHaveProperty('passwordHash');
        });
        expect(result[0].name).toBe('João');
        expect(result[1].name).toBe('Maria');
    });

    it('Retorna um usuário sem passwordHash quando o ID existe', async () => {
        mockUserRepository.findById.mockResolvedValue({
            id: 'uuid-1',
            name: 'João',
            email: 'joao@teste.com',
            passwordHash: 'hash_secreto',
            role: 'client'
        });

        const result = await userService.findById('uuid-1');

        expect(result).not.toHaveProperty('passwordHash');
        expect(result.id).toBe('uuid-1');
        expect(result.name).toBe('João');
    });

    it('Lança UserNotFound quando o ID não existe', async () => {
        mockUserRepository.findById.mockResolvedValue(null);

        await expect(
            userService.findById('id-inexistente')
        ).rejects.toThrow(UserNotFound);
    });

    it('Lança EmailAlreadyExists quando o email novo já está em uso', async () => {
        mockUserRepository.findById.mockResolvedValue({ id: 'uuid-1', email: 'joao@teste.com' });
        mockUserRepository.findByEmail.mockResolvedValue({ id: 'uuid-1', email: 'novo@teste.com' });

        await expect(
            userService.update('uuid-1', { email: 'novo@teste.com' })
        ).rejects.toThrow(EmailAlreadyExists);

        expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it('Lança UserNotFound ao tentar deletar um ID que não existe', async () => {
        mockUserRepository.findById.mockResolvedValue(null);

        await expect(
            userService.delete('id-inexistente')
        ).rejects.toThrow(UserNotFound);

        expect(mockUserRepository.deleteById).not.toHaveBeenCalled();
    });

});
