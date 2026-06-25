import { UserRepository } from "../repositories/userRepository.js";
import { UserService } from "../services/userService.js";

const repository = new UserRepository();
const userService = new UserService(repository);

export class UserController {

    async getUsers(_, res, next) {
        try {
            const response = await userService.findAll();
            return res.status(200).json(response)

        } catch (error) {
            next(error)
        }
    }

    async getUserById(req, res, next) {
        const { id } = req.params

        try {
            const response = await userService.findById(id);

            return res.status(200).json(response);
        } catch (error) {
            next(error)
        }
    }

    async updateUser(req, res, next) {
        const { id } = req.params;
        const { name, email } = req.validated.body

        try {
            const response = await userService.update(id, { name, email })

            return res.status(200).json(response)
        } catch (error) {
            next(error)
        }

    }

    async deleteUser(req, res, next) {
        const { id } = req.params

        try {
            await userService.delete(id)
            return res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}