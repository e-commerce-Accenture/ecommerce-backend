import { Router } from "express";
import { authMiddleware, authorizationRoles } from "../middleware/auth.js";
import { validateRequest } from "../middleware/vallidation.js";
import {
    createProductSchema,
    updateProductSchema,
    addAttributeSchema
} from "../controllers/schemas/productSchema.js";
import { ProductController } from "../controllers/productsController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductAttribute:
 *       type: object
 *       required:
 *         - title
 *         - paragraph
 *       properties:
 *         title:
 *           type: string
 *           description: Attribute name or key
 *           example: "Processor"
 *         paragraph:
 *           type: string
 *           description: Attribute value or description
 *           example: "Intel Core i7"
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the product
 *           example: "d3b07384-d113-4ec2-a50d-ce183a21855a"
 *         name:
 *           type: string
 *           description: Name of the product
 *           example: "Notebook Gamer"
 *         currentPrice:
 *           type: number
 *           description: Current selling price of the product
 *           example: 4500
 *         originalPrice:
 *           type: number
 *           description: Original price before discount
 *           example: 5000
 *         discount:
 *           type: number
 *           description: Discount percentage
 *           example: 10
 *         image:
 *           type: string
 *           description: URL or file path of the product image
 *           example: "http://example.com/images/notebook.jpg"
 *         categoryId:
 *           type: string
 *           description: ID of the category the product belongs to
 *           example: "electronics"
 *         stock:
 *           type: number
 *           description: Stock quantity
 *           example: 15
 *         brand:
 *           type: string
 *           description: Brand name of the product
 *           example: "Dell"
 *         description:
 *           type: string
 *           description: Description of the product
 *           example: "High performance gaming laptop with 16GB RAM and RTX 4060."
 *         active:
 *           type: boolean
 *           description: Indicates if the product is active/visible
 *           example: true
 *         attributes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductAttribute'
 *     CreateProduct:
 *       type: object
 *       required:
 *         - name
 *         - currentPrice
 *         - originalPrice
 *         - discount
 *         - image
 *         - categoryId
 *         - stock
 *         - brand
 *       properties:
 *         name:
 *           type: string
 *           example: "Notebook Gamer"
 *         currentPrice:
 *           type: number
 *           example: 4500
 *         originalPrice:
 *           type: number
 *           example: 5000
 *         discount:
 *           type: number
 *           example: 10
 *         image:
 *           type: string
 *           example: "http://example.com/images/notebook.jpg"
 *         categoryId:
 *           type: string
 *           example: "electronics"
 *         description:
 *           type: string
 *           example: "High performance gaming laptop with 16GB RAM and RTX 4060."
 *         stock:
 *           type: number
 *           example: 15
 *         brand:
 *           type: string
 *           example: "Dell"
 *     UpdateProduct:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Notebook Gamer Pro"
 *         currentPrice:
 *           type: number
 *           example: 4200
 *         originalPrice:
 *           type: number
 *           example: 5000
 *         discount:
 *           type: number
 *           example: 16
 *         image:
 *           type: string
 *           example: "http://example.com/images/notebook_pro.jpg"
 *         categoryId:
 *           type: string
 *           example: "electronics"
 *         description:
 *           type: string
 *           example: "Updated description for Dell gaming laptop."
 *         stock:
 *           type: number
 *           example: 10
 *         brand:
 *           type: string
 *           example: "Dell"
 *         active:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product. Only accessible by administrators.
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProduct'
 *     responses:
 *       200:
 *         description: Product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
 *         description: Conflict. Product with this name already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: Retrieve all products
 *     description: Returns a list of all products. Public access.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: List of products retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *
 * /products/{id}:
 *   get:
 *     summary: Retrieve product by ID
 *     description: Returns a single product's details. Public access.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The product ID
 *         example: "d3b07384-d113-4ec2-a50d-ce183a21855a"
 *     responses:
 *       200:
 *         description: Product found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   patch:
 *     summary: Update product details
 *     description: Updates an existing product. Only accessible by administrators.
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The product ID
 *         example: "d3b07384-d113-4ec2-a50d-ce183a21855a"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProduct'
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflict. Product with this name already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product by ID. Only accessible by administrators.
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The product ID
 *         example: "d3b07384-d113-4ec2-a50d-ce183a21855a"
 *     responses:
 *       204:
 *         description: Product deleted successfully. No content returned.
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid/expired token or user does not have 'admin' role.
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /products/category/{categoryId}:
 *   get:
 *     summary: Retrieve products by category ID
 *     description: Returns all products belonging to a specific category. Public access.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *         example: "electronics"
 *     responses:
 *       200:
 *         description: List of products in the category.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Category not found or has no products.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /products/brand/{brand}:
 *   get:
 *     summary: Retrieve products by brand
 *     description: Returns all products belonging to a specific brand. Public access.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: brand
 *         required: true
 *         schema:
 *           type: string
 *         description: The brand name
 *         example: "Dell"
 *     responses:
 *       200:
 *         description: List of products under the specified brand.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Brand not found or has no products.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /products/{id}/attributes:
 *   post:
 *     summary: Add an attribute to a product
 *     description: Adds a new technical attribute (specifications) to the specified product. Only accessible by administrators.
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The product ID
 *         example: "d3b07384-d113-4ec2-a50d-ce183a21855a"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductAttribute'
 *     responses:
 *       200:
 *         description: Attribute added successfully. Returns updated product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /products/{id}/attributes/{title}:
 *   delete:
 *     summary: Remove an attribute from a product
 *     description: Removes a technical attribute by title from the specified product. Only accessible by administrators.
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The product ID
 *         example: "d3b07384-d113-4ec2-a50d-ce183a21855a"
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The attribute title to remove
 *         example: "Processor"
 *     responses:
 *       200:
 *         description: Attribute removed successfully. Returns updated product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid/expired token or user does not have 'admin' role.
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const productController = new ProductController();
const router = Router();

router
    .post(
        '/',
        authMiddleware,
        validateRequest(createProductSchema),
        authorizationRoles('admin'),
        productController.createProduct
    )
    .get(
        '/',
        productController.getProducts
    )
    .get(
        '/:id',
        productController.getProductById
    )
    .get(
        '/category/:categoryId',
        productController.getProductsByCategory
    )
    .get(
        '/brand/:brand',
        productController.getProductsByBrand
    )
    .patch(
        '/:id',
        authMiddleware,
        validateRequest(updateProductSchema),
        authorizationRoles('admin'),
        productController.updateProduct
    )
    .post(
        '/:id/attributes',
        authMiddleware,
        validateRequest(addAttributeSchema),
        authorizationRoles('admin'),
        productController.addAttribute
    )
    .delete(
        '/:id/attributes/:title',
        authMiddleware,
        authorizationRoles('admin'),
        productController.removeAttribute
    )
    .delete(
        '/:id',
        authMiddleware,
        authorizationRoles('admin'),
        productController.deleteProduct
    );

export default router;