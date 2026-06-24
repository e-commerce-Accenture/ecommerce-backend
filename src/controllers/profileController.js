import { UserRepository } from "../repositories/userRepository.js";
import { ProfileService } from "../services/profileService.js";

const repository = new UserRepository();
const profileService = new ProfileService(repository);

export class ProfileController {

    async getProfile(req, res, next) {
        const { id } = req.user;

        try {
            const response = await profileService.getProfile(id);

            res.status(200).json(response)
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        const { id } = req.user;
        const { name, email } = req.body;

        try {
            const response = await profileService.updateProfile(id, { name, email });

            res.status(200).json(response)
        } catch (error) {
            next(error);
        }
    }
}