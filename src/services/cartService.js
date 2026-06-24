export class CartService {
    constructor(cartRepository, productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    async addProduct (productId, quantity) {
    
            const product = this.productRepository.findById(productId);

            if(!product) {
                throw new Error("Produto não encontrado")
            }

            const cartItem = this.cartRepository.findByProduct(productId);

            if(cartItem) {
                return this.cartRepository.updateCart(productId, {
                    quantity: cartItem.quantity + quantity
                });
            }

            return this.cartRepository.create({
                productId,
                name: product.name,
                price: product.price,
                quantity
            });
    }

    async getCart() {
        return this.cartRepository.findAll();
    }

    async updateQuantity(productId, quantity) {
        const item = this.cartRepository.findByProductId(productId);

        if(!item) {
            throw new Error('item não encontrado no carrinho');
        }

        return this.cartRepository.update(productId, {
            quantity: item.quantity + quantity
        });
    }

    async removeProduct(productId) {
        const item = this.cartRepository.findByProductId(productId);

        if(!item) {
            throw new Error('Item não encontrado no carrinho');
        }

        return this.cartRepository.delete(productId);
    }
}