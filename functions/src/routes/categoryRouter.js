import { Router } from "express";
import { CategoryController } from "../controllers/categoryController.js";
import { authMiddleware, authorizationRoles } from "../middleware/auth.js";
import { validateRequest } from "../middleware/vallidation.js";
import { createCategorySchema, updateCategorySchema } from "../controllers/schemas/categorySchema.js";

const categoryController = new CategoryController();
const router = Router();

router
    .post('/', authMiddleware, validateRequest(createCategorySchema), authorizationRoles('admin'), categoryController.createCategory)
    .get('/', categoryController.getCategories)
    .get('/:id', categoryController.getCategoryById)
    .patch('/:id', authMiddleware, validateRequest(updateCategorySchema), authorizationRoles('admin'), categoryController.updateCategory)
    .delete('/:id', authMiddleware, authorizationRoles('admin'), categoryController.deleteCategory);

export default router;