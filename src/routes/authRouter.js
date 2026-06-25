import { Router } from "express";
import { AuthenticateController } from "../controllers/authenticateController.js";

const authenticateController = new AuthenticateController();
const router = Router();

router
    .post('/', authenticateController.signIn);

export default router;