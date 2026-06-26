import { Router } from "express";
import { AIClient } from "../AI/AIClient.js";
import { authorizationRoles } from "../middleware/auth.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     AIDescriptionRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the product
 *           example: "Notebook Gamer"
 *         brand:
 *           type: string
 *           description: Brand of the product
 *           example: "Dell"
 *         currentPrice:
 *           type: number
 *           description: Price of the product
 *           example: 4500
 *     AIDescriptionResponse:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *           description: Generated description of the product
 *           example: "Notebook Gamer potente de alta performance, ideal para jogos modernos..."
 */

/**
 * @swagger
 * /ai/description:
 *   post:
 *     summary: Generate product description using AI
 *     description: Takes product attributes in the body and generates a high-quality product description using Google Gemini AI. Only accessible by administrators.
 *     tags:
 *       - AI
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AIDescriptionRequest'
 *     responses:
 *       200:
 *         description: Description generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIDescriptionResponse'
 *       401:
 *         description: Unauthorized. Missing token.
 *       403:
 *         description: Forbidden. Invalid/expired token or user does not have 'admin' role.
 *       503:
 *         description: Service Unavailable. AI generation failed or API key invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const aiClient = new AIClient();
const router = Router();

router 
    .post('/description', authorizationRoles('admin'), aiClient.getDescription);

export default router;