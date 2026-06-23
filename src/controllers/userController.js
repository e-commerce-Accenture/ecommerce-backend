import { UserRepository } from "../repositories/userRepository.js";
import { UserService } from "../services/userService.js";

const repository = new UserRepository();
const userService = new UserService(repository);

export class UserController {
    async getUsers(_, res){
        try {
            const response = await userService.findAll();
            res.status(200).send(response)
        } catch (error) {
            res.status(500)
        }
    }
}