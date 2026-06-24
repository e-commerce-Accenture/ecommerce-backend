import { Router } from "express";
import { CartController } from "../controllers/cartController.js";

const router = Router();
const cartController = new CartController();

router

    .get('/', cartController.getCart)
    .post('/', cartController.addProduct)
    .patch('/:productId', cartController.updateQuantity)
    .delete('/:productId', cartController.removeProduct);

export default router