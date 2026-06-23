import { Router } from "express";
import { AIClient } from "../AI/AIClient.js";

const aiClient = new AIClient();
const router = Router();

router 
    .post('/description', aiClient.getDescription);

export default router;