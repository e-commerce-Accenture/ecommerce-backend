import { Router } from "express";
import { AuthenticateController } from "../controllers/authenticateController.js";
import { validateRequest } from "../middleware/vallidation.js";
import { authenticateSchema } from "../controllers/schemas/authenticateSchema.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *           example: "joao.silva@example.com"
 *         password:
 *           type: string
 *           description: Password of the user
 *           example: "senha123"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT token to be used in Authorization header as Bearer token
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Authenticate user
 *     description: Authenticates user credentials and returns a JWT access token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Authentication successful. Returns JWT access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Bad Request. Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ZodErrorResponse'
 *       401:
 *         description: Unauthorized. Invalid credentials (e-mail or password).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const authenticateController = new AuthenticateController();
const router = Router();

router
    .post('/', validateRequest(authenticateSchema), authenticateController.signIn);

export default router;