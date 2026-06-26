import { Router } from "express";
import { BannerController } from "../controllers/bannerController.js";
import { authMiddleware, authorizationRoles } from "../middleware/auth.js";
import { validateRequest } from "../middleware/vallidation.js";
import { createBannerSchema, updateBannerSchema } from "../controllers/schemas/bannerSchema.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Banner:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the banner
 *           example: "e8b07384-d113-4ec2-a50d-ce183a21855b"
 *         imgUrl:
 *           type: string
 *           description: URL or file path of the banner image
 *           example: "http://example.com/images/banner1.jpg"
 *     CreateBanner:
 *       type: object
 *       required:
 *         - imgUrl
 *       properties:
 *         imgUrl:
 *           type: string
 *           example: "http://example.com/images/banner1.jpg"
 *     UpdateBanner:
 *       type: object
 *       required:
 *         - imgUrl
 *       properties:
 *         imgUrl:
 *           type: string
 *           example: "http://example.com/images/banner1_updated.jpg"
 */

/**
 * @swagger
 * /banners:
 *   post:
 *     summary: Create a new banner
 *     description: Creates a new banner. Only accessible by administrators.
 *     tags:
 *       - Banners
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBanner'
 *     responses:
 *       200:
 *         description: Banner created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
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
 *   get:
 *     summary: Retrieve all banners
 *     description: Returns a list of all active banners. Public access.
 *     tags:
 *       - Banners
 *     responses:
 *       200:
 *         description: List of banners retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Banner'
 *
 * /banners/{id}:
 *   get:
 *     summary: Retrieve banner by ID
 *     description: Returns details of a specific banner. Only accessible by administrators.
 *     tags:
 *       - Banners
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The banner ID
 *         example: "e8b07384-d113-4ec2-a50d-ce183a21855b"
 *     responses:
 *       200:
 *         description: Banner found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid/expired token or user does not have 'admin' role.
 *       404:
 *         description: Banner not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   patch:
 *     summary: Update banner details
 *     description: Updates an existing banner's image URL. Only accessible by administrators.
 *     tags:
 *       - Banners
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The banner ID
 *         example: "e8b07384-d113-4ec2-a50d-ce183a21855b"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBanner'
 *     responses:
 *       200:
 *         description: Banner updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
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
 *         description: Banner not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete a banner
 *     description: Deletes a banner by ID. Only accessible by administrators.
 *     tags:
 *       - Banners
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The banner ID to delete
 *         example: "e8b07384-d113-4ec2-a50d-ce183a21855b"
 *     responses:
 *       204:
 *         description: Banner deleted successfully. No content returned.
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid/expired token or user does not have 'admin' role.
 *       404:
 *         description: Banner not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const bannerController = new BannerController();
const router = Router();

router
    .post('/', authMiddleware, validateRequest(createBannerSchema), authorizationRoles('admin'), bannerController.createBanner)
    .get('/', bannerController.getBanners)
    .get('/:id', authMiddleware, authorizationRoles('admin'), bannerController.getBannerById)
    .patch('/:id', authMiddleware, validateRequest(updateBannerSchema), authorizationRoles('admin'), bannerController.updateBanner)
    .delete('/:id', authMiddleware, authorizationRoles('admin'), bannerController.deleteBanner);

export default router;