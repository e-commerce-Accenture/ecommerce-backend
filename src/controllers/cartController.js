import { Router } from "express"
import { CartRepository } from "../repositories/cartRepository";
import { CartService } from "../services/cartService";


const repository = new CartRepository();
const service = new CartService(repository);


export class CartController {
    
    async getCart(req, res) {
        try {
            const cart = await service.getCart();
            return res.json(cart);
        } catch (error) {
            return res.status(500).json({ message: error.message});
        }
    }

    async addProduct(req, res) {
        try {
            const { productId, quantity } = req.body;
            const result = await service.addProduct(productId, quantity);

            return res.status(201).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async updateQuantity(req, res) {
        try {
            const { productId } = req.params;
            const { quantity } = req.body;

            const result = await service.updateQuantity(productId, quantity);

            return res.json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message});
        }
    }

    async removeProduct(req, res) {
        try {
            const { productId } = req.params;

            const result = await service.removeProduct(productId);

            return res.json({ message: 'Item removido', result});
        } catch (error) {
            return res.status(400).json({ message: error.message});
        }
    }
}