import { Router } from "express";
import { AuthenticateController } from "../controllers/authenticateController.js";
import { validateRequest } from "../middleware/vallidation.js";
import { authenticateSchema } from "../controllers/schemas/authenticateSchema.js";

const authenticateController = new AuthenticateController();
const router = Router();

router
    .post('/', validateRequest(authenticateSchema), authenticateController.signIn);

export default router;