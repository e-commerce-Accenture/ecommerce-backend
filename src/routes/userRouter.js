import { Router } from "express";
import { UserController } from "../controllers/userController.js";

const userController = new UserController();
const router = Router();

router
    .get('/', userController.getUsers)
    .get('/:id', userController.getUserById)
    .post('/', userController.register)
    .patch('/:id', userController.updateUser)

export default router;