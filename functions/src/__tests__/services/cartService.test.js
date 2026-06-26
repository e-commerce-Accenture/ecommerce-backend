import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CartService } from '../../services/cartService.js';
import { UserNotFound } from '../../utils/exceptions.js';

describe('CartService', () => {

    let cartService;
    let mockCartRepository;
    let mockUserRepository;
    let mockProductRepository;

    beforeEach(() => {
        mockCartRepository = {
            findByProduct: vi.fn(),
            findByUserId: vi.fn(),
            create: vi.fn(),
            updateCart: vi.fn(),
            updateItem: vi.fn(),
            deleteItem: vi.fn()
        };

        mockUserRepository = {
            findById: vi.fn()
        };

        mockProductRepository = {
            findById: vi.fn()
        };

        cartService = new CartService(
            mockCartRepository,
            mockUserRepository,
            mockProductRepository
        );
    });

    // CENÁRIO 1: Buscar carrinho de um usuário existente
   
    it('Retorna o carrinho quando o usuário existe', async () => {
        const userId = 'uuid-123';

        // Simula q o usuário existe
        mockUserRepository.findById.mockResolvedValue({ id: userId, name: 'João' });

        // Simula o carrinho do usuário
        mockCartRepository.findByUserId.mockResolvedValue({
            id: 'cart-uuid',
            userId,
            items: []
        });

        const cart = await cartService.getUserCart(userId);

        expect(cart).toHaveProperty('id', 'cart-uuid');
        expect(cart).toHaveProperty('userId', userId);
        expect(mockCartRepository.findByUserId).toHaveBeenCalledWith(userId);
    });

    // CENÁRIO 2: Buscar carrinho de usuário inexistente
   
    it('Lança UserNotFound quando o usuário não existe', async () => {
        // Simula que o usuário não foi encontrado
        mockUserRepository.findById.mockResolvedValue(null);

        await expect(
            cartService.getUserCart('id-inexistente')
        ).rejects.toThrow(UserNotFound);

        expect(mockCartRepository.findByUserId).not.toHaveBeenCalled();
    });

    // CENÁRIO 3: Remover produto do carrinho
  
    it('Remove um produto do carrinho corretamente', async () => {
        const userId = 'uuid-123';
        const productId = 'prod-456';

        mockCartRepository.findByUserId.mockResolvedValue({
            id: 'cart-uuid',
            userId
        });

        mockCartRepository.deleteItem.mockResolvedValue(undefined);

        await cartService.removeProduct(userId, productId);

        // Verifica que o deleteItem foi chamado com os parâmetros certos
        expect(mockCartRepository.deleteItem).toHaveBeenCalledWith(userId, productId);
    });

});
