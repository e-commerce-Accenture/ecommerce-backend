import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthenticateService } from '../../services/authenticateService.js';
import { UserNotFound, InvalidCredentials } from '../../utils/exceptions.js';
import bcrypt from 'bcryptjs';

vi.mock('../../middleware/jwt.js', () => ({
    generateToken: vi.fn(() => 'fake-jwt-token')
}));

describe('AuthenticateService', () => {

    let authenticateService;
    let mockUserRepository;


    beforeEach(() => {
        mockUserRepository = {
            findByEmail: vi.fn()
        };

        authenticateService = new AuthenticateService(mockUserRepository);
    });

    // CENÁRIO 1: Login com sucesso

    it('Retorna um token quando as credenciais são válidas', async () => {
        // ARRANGE 
        const email = 'usuario@teste.com';
        const password = 'senha123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simulação que o banco encontrou o usuário
        mockUserRepository.findByEmail.mockResolvedValue({
            id: 'uuid-123',
            name: 'Usuário Teste',
            email,
            passwordHash: hashedPassword,
            role: 'client'
        });

        // ACT 
        const token = await authenticateService.authenticate(email, password);

        // ASSERT — verificar o resultado
        expect(token).toBe('fake-jwt-token');
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    // CENÁRIO 2: Usuário não encontrado

    it('Lança UserNotFound quando o email não existe', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);

        await expect(
            authenticateService.authenticate('naoexiste@teste.com', 'qualquersenha')
        ).rejects.toThrow(UserNotFound);
    });

    // CENÁRIO 3: Senha incorreta

    it('Lança InvalidCredentials quando a senha está errada', async () => {
        const hashedPassword = await bcrypt.hash('senhaCorreta123', 10);

        mockUserRepository.findByEmail.mockResolvedValue({
            id: 'uuid-123',
            name: 'Usuário Teste',
            email: 'usuario@teste.com',
            passwordHash: hashedPassword,
            role: 'client'
        });

        await expect(
            authenticateService.authenticate('usuario@teste.com', 'senhaErrada999')
        ).rejects.toThrow(InvalidCredentials);
    });

});
