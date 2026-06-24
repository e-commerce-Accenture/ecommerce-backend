import { Router } from "express";
import { CategoryController } from "../controllers/categoryController.js";
import { authorizationRoles } from "../middleware/auth.js";

const categoryController = new CategoryController();
const router = Router();

router
    .post('/', authorizationRoles('admin'), categoryController.createCategory)
    .get('/', authorizationRoles('admin'), categoryController.getCategories)
    .get('/:id', authorizationRoles('admin'), categoryController.getCategoryById)
    .patch('/:id', authorizationRoles('admin'), categoryController.updateCategory)
    .delete('/:id', authorizationRoles('admin'), categoryController.deleteCategory)

export default router;