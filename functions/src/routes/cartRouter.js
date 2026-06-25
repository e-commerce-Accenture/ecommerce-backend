import { Router } from "express";
import { CartController } from "../controllers/cartController.js";
import { authorizationRoles } from "../middleware/auth.js";
import { validateRequest } from "../middleware/vallidation.js";
import { addProductShcema, updateItemSchema } from "../controllers/schemas/cartSchema.js";

const router = Router();
const cartController = new CartController();

router
    .get('/', cartController.getUserCart)
    .post('/', validateRequest(addProductShcema), cartController.addProduct)
    .patch('/items/:productId', validateRequest(updateItemSchema), cartController.updateItem)
    .delete('/items/:productId', cartController.removeProduct);

export default router;