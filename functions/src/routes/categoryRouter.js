import { Router } from "express";
import { CategoryController } from "../controllers/categoryController.js";
import { authorizationRoles } from "../middleware/auth.js";
import { validateRequest } from "../middleware/vallidation.js";
import { createCategorySchema, updateCategorySchema } from "../controllers/schemas/categorySchema.js";

const categoryController = new CategoryController();
const router = Router();

router
    .post('/', validateRequest(createCategorySchema), authorizationRoles('admin'), categoryController.createCategory)
    .get('/', authorizationRoles('admin'), categoryController.getCategories)
    .get('/:id', authorizationRoles('admin'), categoryController.getCategoryById)
    .patch('/:id', validateRequest(updateCategorySchema), authorizationRoles('admin'), categoryController.updateCategory)
    .delete('/:id', authorizationRoles('admin'), categoryController.deleteCategory);

export default router;