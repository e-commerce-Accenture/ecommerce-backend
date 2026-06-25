import { UserNotFound } from "../utils/exceptions.js";

export class CartService {
    constructor(cartRepository, userRepository, productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
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
                    quantity: quantity
                });
            }

            return this.cartRepository.create({
                productId,
                name: product.name,
                price: product.price,
                quantity
            });
    }

    async getUserCart(id){
        try {
            const userExists = await this.userRepository.findById(id);
            if(!userExists) throw new UserNotFound(`User with id ${id} not found.`);
    
            const cart = await this.cartRepository.findByUserId(id);

            return cart;
            
        } catch (error) {
            throw error;
        }
    }

    async updateItem(userId, productId, data) {
        const cart = this.cartRepository.findByUserId(userId);

        return await this.cartRepository.updateItem(cart.id, productId, data)
    }

    async removeProduct(userId, productId) {
        const cart = await this.cartRepository.findByUserId(userId);       

        await this.cartRepository.deleteItem(userId, productId);
    }
}