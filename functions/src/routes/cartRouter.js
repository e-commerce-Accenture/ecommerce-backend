import { Router } from "express";
import { CartController } from "../controllers/cartController.js";
import { authorizationRoles } from "../middleware/auth.js";
import { validateRequest } from "../middleware/vallidation.js";
import { addProductShcema, updateItemSchema } from "../controllers/schemas/cartSchema.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           description: ID of the product in the cart
 *           example: "d3b07384-d113-4ec2-a50d-ce183a21855a"
 *         unitPrice:
 *           type: number
 *           description: Price per unit of the product
 *           example: 4500
 *         quantity:
 *           type: number
 *           description: Quantity of the product in the cart
 *           example: 2
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the cart
 *           example: "f2c9b3e1-789a-4bc0-9df1-8a9012345678"
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID of the user owning the cart
 *           example: "e6f4a862-23c2-40df-a6d1-cfc12850a41d"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *     AddProductToCart:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           example: "d3b07384-d113-4ec2-a50d-ce183a21855a"
 *         quantity:
 *           type: number
 *           minimum: 1
 *           example: 2
 *     UpdateCartItem:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: number
 *           minimum: 0
 *           example: 5
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Retrieve user's cart
 *     description: Returns the active cart details and items for the currently logged-in user.
 *     tags:
 *       - Cart
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid/expired token.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Add product to cart
 *     description: Adds a product with a specified quantity to the authenticated user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddProductToCart'
 *     responses:
 *       201:
 *         description: Product added to cart successfully. Returns the updated cart.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Bad Request. Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ZodErrorResponse'
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid/expired token.
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflict. Product is already in the cart.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /cart/items/{productId}:
 *   patch:
 *     summary: Update cart item quantity
 *     description: Updates the quantity of a specific product in the authenticated user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID in the cart
 *         example: "d3b07384-d113-4ec2-a50d-ce183a21855a"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCartItem'
 *     responses:
 *       200:
 *         description: Cart item updated successfully. Returns updated item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Bad Request. Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ZodErrorResponse'
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid/expired token.
 *   delete:
 *     summary: Remove product from cart
 *     description: Removes a product completely from the authenticated user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID to remove from cart
 *         example: "d3b07384-d113-4ec2-a50d-ce183a21855a"
 *     responses:
 *       200:
 *         description: Product removed from cart successfully.
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid/expired token.
 */

const router = Router();
const cartController = new CartController();

router
    .get('/', cartController.getUserCart)
    .post('/', validateRequest(addProductShcema), cartController.addProduct)
    .patch('/items/:productId', validateRequest(updateItemSchema), cartController.updateItem)
    .delete('/items/:productId', cartController.removeProduct);

export default router;