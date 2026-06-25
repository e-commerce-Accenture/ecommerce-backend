import { Router } from "express";
import { RegisterController } from "../controllers/registerController.js";

const registerController = new RegisterController();
const router = Router();

router
    .post('/', registerController.register)

export default router;