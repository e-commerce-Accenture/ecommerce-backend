import { UserRepository } from "../repositories/userRepository.js";
import { AuthenticateService } from "../services/authenticateService.js";

const repository = new UserRepository();
const service = new AuthenticateService(repository);

export class AuthenticateController {
    async signIn(req, res, next) {
        const { email, password } = req.validated.body;

        try {
            const response = await service.authenticate(email, password);
            res.status(200).json({accessToken: response});
        } catch (error) {
            next(error)
        }
    }
}