import { Router } from "express";
import { ProfileController } from "../controllers/profileController.js";

const profileController = new ProfileController();
const router = Router();

router
    .get('/', profileController.getProfile)
    .patch('/', profileController.updateProfile)

export default router;