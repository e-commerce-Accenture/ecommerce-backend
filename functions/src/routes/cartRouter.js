import { Router } from "express";
import { CartController } from "../controllers/cartController.js";
import { authorizationRoles } from "../middleware/auth.js";

const router = Router();
const cartController = new CartController();

router
    .get('/', cartController.getUserCart)
    .post('/', cartController.addProduct)
    .patch('/items/:productId', cartController.updateItem)
    .delete('/items/:productId', cartController.removeProduct);

export default router