import { response, Router } from "express"
import { CartRepository } from "../repositories/cartRepository.js";
import { CartService } from "../services/cartService.js";
import { UserRepository } from "../repositories/userRepository.js";


const cartRepository = new CartRepository();
const userRepository = new UserRepository();
const cartService = new CartService(cartRepository, userRepository);


export class CartController {

    async getUserCart(req, res, next) {
        const { id } = req.user;

        try {
            const response = await cartService.getUserCart(id);

            return res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    async addProduct(req, res, next) {
        try {
            const { productId, quantity } = req.body;
            const result = await cartService.addProduct(productId, quantity);

            return res.status(201).json(result);
        } catch (error) {
            next(error)
        }
    }

    async updateItem(req, res, next) {
        try {
            const { id } = req.user
            const { productId } = req.params;
            const { quantity } = req.body;

            const result = await cartService.updateItem(id, productId, quantity);

            return res.status(200).json(result);
        } catch (error) {
            next(error)
        }
    }

    async removeProduct(req, res, next) {
        try {
            const { id } = req.user
            const { productId } = req.params;

            const result = await cartService.removeProduct(id, productId);

            return res.json({ message: 'Item removido', result });
        } catch (error) {
            next(error)
        }
    }
}