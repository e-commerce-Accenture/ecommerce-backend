import { Router } from "express";
import { BannerController } from "../controllers/bannerController.js";
import { authMiddleware, authorizationRoles } from "../middleware/auth.js";
import { validateRequest } from "../middleware/vallidation.js";
import { createBannerSchema, updateBannerSchema } from "../controllers/schemas/bannerSchema.js";

const bannerController = new BannerController();
const router = Router();

router
    .post('/', authMiddleware, validateRequest(createBannerSchema), authorizationRoles('admin'), bannerController.createBanner)
    .get('/', bannerController.getBanners)
    .get('/:id', authMiddleware, authorizationRoles('admin'), bannerController.getBannerById)
    .patch('/:id', authMiddleware, validateRequest(updateBannerSchema), authorizationRoles('admin'), bannerController.updateBanner)
    .delete('/:id', authMiddleware, authorizationRoles('admin'), bannerController.deleteBanner);

export default router;