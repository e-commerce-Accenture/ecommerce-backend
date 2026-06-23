import { UserRepository } from "../repositories/userRepository.js";
import { UserService } from "../services/userService.js";

const repository = new UserRepository();
const userService = new UserService(repository);

export class UserController {

    async register(req, res) {
        const { name, email, password } = req.body;

        try {
            const response = await userService.create(name, email, password);

            return res.status(201).json(response)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    async getUsers(_, res) {
        try {
            const response = await userService.findAll();
            return res.status(200).json(response)

        } catch (error) {
            return res.status(500)
        }
    }

    async getUserById(req, res){
        const { id } = req.params

        try {
            const response = await userService.findById(id);

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }
}