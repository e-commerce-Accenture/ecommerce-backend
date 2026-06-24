import { CartRepository } from "../repositories/cartRepository.js";
import { UserRepository } from "../repositories/userRepository.js";
import { RegisterService } from "../services/registerService.js";
import { UserService } from "../services/userService.js";

const userRepository = new UserRepository();
const cartRepository = new CartRepository()
const registerService = new RegisterService(userRepository, cartRepository);

export class RegisterController {
    async register(req, res) {
        const { name, email, password } = req.body;

        try {
            const response = await registerService.create(name, email, password);

            return res.status(201).json(response)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}