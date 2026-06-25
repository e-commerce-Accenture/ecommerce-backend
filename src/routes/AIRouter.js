import { Router } from "express";
import { AIClient } from "../AI/AIClient.js";
import { authorizationRoles } from "../middleware/auth.js";

const aiClient = new AIClient();
const router = Router();

router 
    .post('/description', authorizationRoles('admin'), aiClient.getDescription);

export default router;