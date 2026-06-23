import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import { ServiceUnavailableException } from "../utils/exceptions.js";
import messages from "../utils/messages.js";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export class AIClient {
    async getDescription(req, res) {
        const obj = req.body;

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `crie uma descrição para seguinte produto: ${JSON.stringify(obj)}. Não é necessário nenhum texto adicional, somente a descrição`
            })

            return res.status(200).json({ text: response.text })
        } catch (error) {
            throw new ServiceUnavailableException(messages.generic.AI_REQUISITION_FAILED)
        }
    }
}