import { generateToken } from "../middleware/jwt.js";
import bcrypt from 'bcryptjs';
import { InvalidCredentials, UserNotFound } from "../utils/exceptions.js";

export class AuthenticateService {
    constructor(userRepository){
        this.userRepository = userRepository;
    }

    async authenticate(email, password){
        try {
            const user = await this.userRepository.findByEmail(email);
    
            if(!user) throw new UserNotFound(`User with ${email} not found.`);

            const passwordIsMatch = await bcrypt.compare(password, user.passwordHash);

            if(!passwordIsMatch) throw new InvalidCredentials("Invalid credentials");

            const token = generateToken(user)

            return token;
            
        } catch (error) {
            throw error
        }
    }
}