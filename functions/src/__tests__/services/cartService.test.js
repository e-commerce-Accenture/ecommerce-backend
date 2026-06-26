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

    it('Retorna o carrinho quando o usuário existe', async () => {
        const userId = 'uuid-123';

        mockUserRepository.findById.mockResolvedValue({ id: userId, name: 'João' });

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

    it('Lança UserNotFound quando o usuário não existe', async () => {
        mockUserRepository.findById.mockResolvedValue(null);

        await expect(
            cartService.getUserCart('id-inexistente')
        ).rejects.toThrow(UserNotFound);

        expect(mockCartRepository.findByUserId).not.toHaveBeenCalled();
    });

    it('Remove um produto do carrinho corretamente', async () => {
        const userId = 'uuid-123';
        const productId = 'prod-456';

        mockCartRepository.findByUserId.mockResolvedValue({
            id: 'cart-uuid',
            userId
        });

        mockCartRepository.deleteItem.mockResolvedValue(undefined);

        await cartService.removeProduct(userId, productId);

        expect(mockCartRepository.deleteItem).toHaveBeenCalledWith(userId, productId);
    });

});
