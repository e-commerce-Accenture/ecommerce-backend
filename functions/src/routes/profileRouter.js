import { Router } from "express";
import { ProfileController } from "../controllers/profileController.js";
import { validateRequest } from "../middleware/vallidation.js";
import { updateProfileSchema } from "../controllers/schemas/profileSchema.js";

const profileController = new ProfileController();
const router = Router();

router
    .get('/', profileController.getProfile)
    .patch('/', validateRequest(updateProfileSchema), profileController.updateProfile);

export default router;