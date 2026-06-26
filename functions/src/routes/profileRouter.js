import { Router } from "express";
import { ProfileController } from "../controllers/profileController.js";
import { validateRequest } from "../middleware/vallidation.js";
import { updatePassowrdSchema, updateProfileSchema } from "../controllers/schemas/profileSchema.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the profile
 *           example: "b1d8f76e-56b9-4a92-9cf1-2a9041bf63a0"
 *         name:
 *           type: string
 *           description: Name of the user
 *           example: "João Silva"
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *           example: "joao.silva@example.com"
 *         role:
 *           type: string
 *           description: Role of the user in the system
 *           example: "client"
 *         phone:
 *           type: string
 *           description: Phone number of the user
 *           example: "+5511999999999"
 *         address:
 *           type: object
 *           properties:
 *             cep:
 *               type: string
 *               example: "01001-000"
 *             street:
 *               type: string
 *               example: "Praça da Sé"
 *             number:
 *               type: string
 *               example: "123"
 *             neighborhood:
 *               type: string
 *               example: "Sé"
 *             city:
 *               type: string
 *               example: "São Paulo"
 *             state:
 *               type: string
 *               example: "SP"
 *     UpdateProfile:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           description: New name of the user
 *           example: "João de Souza"
 *         email:
 *           type: string
 *           format: email
 *           description: New email address of the user
 *           example: "joao.souza@example.com"
 *         phone:
 *           type: string
 *           description: Phone number
 *           example: "+5511999999999"
 *         cep:
 *           type: string
 *           description: Postal code
 *           example: "01001-000"
 *         street:
 *           type: string
 *           description: Street name
 *           example: "Praça da Sé"
 *         number:
 *           type: string
 *           description: Street number
 *           example: "123"
 *         neighborhood:
 *           type: string
 *           maxLength: 50
 *           description: Neighborhood
 *           example: "Sé"
 *         city:
 *           type: string
 *           description: City
 *           example: "São Paulo"
 *         state:
 *           type: string
 *           description: State
 *           example: "SP"
 *     UpdatePassword:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         password:
 *           type: string
 *           description: New password for the user
 *           example: "novaSenha123"
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Retrieve user profile
 *     description: Returns the profile details and user account information of the currently authenticated user.
 *     tags:
 *       - Profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid or expired token.
 *   patch:
 *     summary: Update profile details
 *     description: Updates the authenticated user's profile details and account information.
 *     tags:
 *       - Profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfile'
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Bad Request. Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ZodErrorResponse'
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid or expired token.
 *       409:
 *         description: Conflict. E-mail already registered by another user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /profile/change-password:
 *   patch:
 *     summary: Change user password
 *     description: Updates the password of the currently authenticated user.
 *     tags:
 *       - Profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePassword'
 *     responses:
 *       204:
 *         description: Password updated successfully. No content returned.
 *       400:
 *         description: Bad Request. Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ZodErrorResponse'
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid or expired token.
 */

const profileController = new ProfileController();
const router = Router();

router
    .get('/', profileController.getProfile)
    .patch('/', validateRequest(updateProfileSchema), profileController.updateProfile)
    .patch('/change-password', validateRequest(updatePassowrdSchema), profileController.updatePassword);

export default router;