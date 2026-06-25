import { CartRepository } from "../repositories/cartRepository.js";
import { ProfileRepository } from "../repositories/profileRepository.js";
import { UserRepository } from "../repositories/userRepository.js";
import { RegisterService } from "../services/registerService.js";
import { UserService } from "../services/userService.js";

const userRepository = new UserRepository();
const cartRepository = new CartRepository()
const profileRepository = new ProfileRepository();

const registerService = new RegisterService(userRepository, cartRepository, profileRepository);

export class RegisterController {
    async register(req, res, next) {
        const { name, email, password } = req.validated.body;

        try {
            const response = await registerService.create(name, email, password);

            return res.status(201).json(response)
        } catch (error) {
            next(error)
        }
    }
}