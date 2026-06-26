import { ItemCartAlreadyExists, ProductNotFound, UserNotFound } from "../utils/exceptions.js";

export class CartService {
    constructor(cartRepository, userRepository, productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    async addProduct (userId, productId, quantity) {
    
            const product = this.productRepository.findById(productId);

            if(!product) {
                throw new ProductNotFound(`Product with id ${productId} not found`);
            }

            const cartItem = this.cartRepository.findByProductId(productId);
            const productCart = this.cartRepository.findCartProduct(userId, product.id);

            if(productCart) {
                throw new ItemCartAlreadyExists(`Item with id ${productCart.productId} already exists.`)
            }

            return this.cartRepository.addItem(
                userId,
                {
                productId,
                unitPrice: product.currentPrice,
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
        
        const itemUpdated = await this.cartRepository.updateItem(cart.id, productId, data);

        return itemUpdated || [];
    }

    async removeProduct(userId, productId) {
        const cart = await this.cartRepository.findByUserId(userId);       

        await this.cartRepository.deleteItem(userId, productId);
    }
}