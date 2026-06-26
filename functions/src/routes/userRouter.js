import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { authorizationRoles } from "../middleware/auth.js";
import { validateRequest } from "../middleware/vallidation.js";
import { updateUserSchema } from "../controllers/schemas/userSchema.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the user
 *           example: "e6f4a862-23c2-40df-a6d1-cfc12850a41d"
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
 *           enum: [admin, client]
 *           example: "admin"
 *     UpdateUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: New name of the user (at least 2 characters)
 *           example: "João de Souza"
 *         email:
 *           type: string
 *           format: email
 *           description: New email address of the user
 *           example: "joao.souza@example.com"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error type or class name
 *           example: "UserNotFound"
 *         message:
 *           type: string
 *           description: Detailed error message
 *           example: "User with id e6f4a862-23c2-40df-a6d1-cfc12850a41d not found."
 *     ZodErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error class name (usually ZodError)
 *           example: "ZodError"
 *         message:
 *           type: string
 *           description: Error summary
 *           example: "Invalid data"
 *         fields:
 *           type: object
 *           description: Validation errors grouped by field name
 *           additionalProperties:
 *             type: array
 *             items:
 *               type: string
 *             example: ["Invalid email"]
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Returns a list of all registered users. Only accessible by administrators.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized. Missing token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token not found"
 *       403:
 *         description: Forbidden. Invalid/expired token or user does not have 'admin' role.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     description: Returns a specific user's details based on their unique ID. Only accessible by administrators.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The user unique ID
 *         example: "e6f4a862-23c2-40df-a6d1-cfc12850a41d"
 *     responses:
 *       200:
 *         description: User found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid/expired token or user does not have 'admin' role.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   patch:
 *     summary: Update user details
 *     description: Updates an existing user's information (name and/or email). Only accessible by administrators.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The user unique ID
 *         example: "e6f4a862-23c2-40df-a6d1-cfc12850a41d"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request. Invalid data format or validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ZodErrorResponse'
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid/expired token or user does not have 'admin' role.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflict. Email already in use.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete a user
 *     description: Deletes an existing user from the database. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The user unique ID to delete
 *         example: "e6f4a862-23c2-40df-a6d1-cfc12850a41d"
 *     responses:
 *       204:
 *         description: User deleted successfully. No content returned.
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
 */

const userController = new UserController();
const router = Router();

router
    .get('/', authorizationRoles('admin'), userController.getUsers)
    .get('/:id', authorizationRoles('admin'), userController.getUserById)
    .patch('/:id', validateRequest(updateUserSchema), authorizationRoles('admin'), userController.updateUser)
    .delete('/:id', userController.deleteUser)

export default router;