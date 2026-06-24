import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { UserAlreadyExists } from "../utils/exceptions.js";

export class RegisterService {
    constructor(userRepository, cartRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
    }

    async create(name, email, password) {
        try {
            const isExists = await this.userRepository.findByEmail(email);

            if (isExists) {
                throw new UserAlreadyExists('User already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await this.userRepository.create({
                id: uuidv4(),
                name: name,
                email: email,
                passwordHash: hashedPassword,
                role: 'client'
            });

            await this.#createCart(newUser.id)

            const { passwordHash, ...user } = newUser;

            return user;
        } catch (error) {
            throw error;
        }
    }

    async #createCart(userId){
        const cart = await this.cartRepository.create({
            id: uuidv4(),
            userId: userId
        })
    }
}