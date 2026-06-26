import { Router } from "express";
import { RegisterController } from "../controllers/registerController.js";
import { validateRequest } from "../middleware/vallidation.js";
import { registerSchema } from "../controllers/schemas/registerSchema.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUser:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the user (at least 2 characters)
 *           example: "João Silva"
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *           example: "joao.silva@example.com"
 *         password:
 *           type: string
 *           description: Password of the user (at least 6 characters)
 *           example: "senha123"
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user profile with a role of 'client', and initializes their cart and profile.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request. Validation failed or missing fields.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ZodErrorResponse'
 *       409:
 *         description: Conflict. User with this email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const registerController = new RegisterController();
const router = Router();

router
    .post('/', validateRequest(registerSchema), registerController.register);

export default router;