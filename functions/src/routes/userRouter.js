import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { authorizationRoles } from "../middleware/auth.js";
import { validateRequest } from "../middleware/vallidation.js";
import { updateUserSchema } from "../controllers/schemas/userSchema.js";

const userController = new UserController();
const router = Router();

router
    .get('/', authorizationRoles('admin'), userController.getUsers)
    .get('/:id', authorizationRoles('admin'), userController.getUserById)
    .patch('/:id', validateRequest(updateUserSchema), authorizationRoles('admin'), userController.updateUser)
    .delete('/:id', userController.deleteUser)

export default router;