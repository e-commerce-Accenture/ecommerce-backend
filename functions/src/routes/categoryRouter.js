import { Router } from "express";
import { CategoryController } from "../controllers/categoryController.js";
import { authMiddleware, authorizationRoles } from "../middleware/auth.js";
import { validateRequest } from "../middleware/vallidation.js";
import { createCategorySchema, updateCategorySchema } from "../controllers/schemas/categorySchema.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the category
 *           example: "a687efcd-1234-4567-89ab-cdef01234567"
 *         name:
 *           type: string
 *           description: Name of the category
 *           example: "Electronics"
 *         imgUrl:
 *           type: string
 *           description: URL or path to the category icon or image
 *           example: "http://example.com/images/electronics.png"
 *     CreateCategory:
 *       type: object
 *       required:
 *         - name
 *         - imgUrl
 *       properties:
 *         name:
 *           type: string
 *           example: "Electronics"
 *         imgUrl:
 *           type: string
 *           example: "http://example.com/images/electronics.png"
 *     UpdateCategory:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Consumer Electronics"
 *         imgUrl:
 *           type: string
 *           example: "http://example.com/images/electronics_new.png"
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     description: Creates a new category. Only accessible by administrators.
 *     tags:
 *       - Categories
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategory'
 *     responses:
 *       200:
 *         description: Category created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad Request. Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ZodErrorResponse'
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid/expired token or user does not have 'admin' role.
 *       409:
 *         description: Conflict. Category with this name already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: Retrieve all categories
 *     description: Returns a list of all categories. Public access.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: List of categories retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *
 * /categories/{id}:
 *   get:
 *     summary: Retrieve category by ID
 *     description: Returns details of a specific category by its ID. Public access.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The category ID
 *         example: "a687efcd-1234-4567-89ab-cdef01234567"
 *     responses:
 *       200:
 *         description: Category found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   patch:
 *     summary: Update category details
 *     description: Updates an existing category. Only accessible by administrators.
 *     tags:
 *       - Categories
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The category ID
 *         example: "a687efcd-1234-4567-89ab-cdef01234567"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategory'
 *     responses:
 *       200:
 *         description: Category updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad Request. Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ZodErrorResponse'
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid/expired token or user does not have 'admin' role.
 *       404:
 *         description: Category not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflict. Category with this name already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete a category
 *     description: Deletes a category by ID. Only accessible by administrators.
 *     tags:
 *       - Categories
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The category ID to delete
 *         example: "a687efcd-1234-4567-89ab-cdef01234567"
 *     responses:
 *       204:
 *         description: Category deleted successfully. No content returned.
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid/expired token or user does not have 'admin' role.
 *       404:
 *         description: Category not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const categoryController = new CategoryController();
const router = Router();

router
    .post('/', authMiddleware, validateRequest(createCategorySchema), authorizationRoles('admin'), categoryController.createCategory)
    .get('/', categoryController.getCategories)
    .get('/:id', categoryController.getCategoryById)
    .patch('/:id', authMiddleware, validateRequest(updateCategorySchema), authorizationRoles('admin'), categoryController.updateCategory)
    .delete('/:id', authMiddleware, authorizationRoles('admin'), categoryController.deleteCategory);

export default router;