import { UserRepository } from "../repositories/userRepository.js";
import { UserService } from "../services/userService.js";

const repository = new UserRepository();
const userService = new UserService(repository);

export class UserController {

    async getUsers(_, res) {
        try {
            const response = await userService.findAll();
            return res.status(200).json(response)

        } catch (error) {
            return res.status(500)
        }
    }

    async getUserById(req, res) {
        const { id } = req.params

        try {
            const response = await userService.findById(id);

            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    async updateUser(req, res) {
        const { id } = req.params;
        const { name, email } = req.body

        try {
            const response = await userService.update(id, { name, email })

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }

    }

    async deleteUser(req, res) {
        const { id } = req.params

        try {
            await userService.delete(id)
            return res.status(204).send()
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }
}