import { Router } from "express";
import { RegisterController } from "../controllers/registerController.js";
import { validateRequest } from "../middleware/vallidation.js";
import { registerSchema } from "../controllers/schemas/registerSchema.js";

const registerController = new RegisterController();
const router = Router();

router
    .post('/', validateRequest(registerSchema), registerController.register);

export default router;