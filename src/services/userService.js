import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async create(name, email, password) {
        try {
            const isExists = await this.userRepository.findByEmail(email);

            if (isExists) {
                throw new Error('User already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await this.userRepository.create({
                id: uuidv4(),
                name: name,
                email: email,
                passwordHash: hashedPassword,
                role: 'client'
            });

            const { passwordHash, ...user } = newUser;

            return user;
        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        const users = await this.userRepository.findAll();

        return users;
    }

    async findById(id) {
        const finded = await this.userRepository.findById(id);

        if(!finded){
            return [];
        }

        const { passwordHash, ...user } = finded;

        return user;
    }

    async update(id, data){
        try {
            const isExist = await this.userRepository.findById(id);
    
            if(!isExist) throw new Error('User not found');
    
            const updatedUser = await this.userRepository.update(id, data);
            
            const {passwordHash, ...user} = updatedUser;

            return user;
            
        } catch (error) {
            throw error;
        }
    }
}