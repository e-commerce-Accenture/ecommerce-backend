import bcrypt from "bcryptjs";
import { EmailAlreadyExists, UserNotFound } from "../utils/exceptions.js";

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async findAll() {
        const users = await this.userRepository.findAll();
        const result = users.map(({passwordHash, ...user}) => user)

        return result;
    }

    async findById(id) {
        try {
            const finded = await this.userRepository.findById(id);
    
            if(!finded){
                throw new UserNotFound(`User with id ${id} not found.`);
            }
    
            const { passwordHash, ...user } = finded;
    
            return user;
            
        } catch (error) {
            throw error;
        }
    }

    async update(id, data){
        try {
            const isExist = await this.userRepository.findById(id);
    
            if(!isExist) throw new UserNotFound(`User with id ${id} not found.`);

            const emailExist = await this.userRepository.findByEmail(data.email);

            if(emailExist && data.email == emailExist.email) throw new EmailAlreadyExists(`Email ${data.email} already exists`); 

            const updatedUser = await this.userRepository.update(id, data);
            
            const {passwordHash, ...user} = updatedUser;

            return user;
            
        } catch (error) {
            throw error;
        }
    }

    async delete(id){
        try {
            const isExist = await this.userRepository.findById(id);
    
            if(!isExist) throw new UserNotFound(`User with id ${id} not found.`);
    
            await this.userRepository.deleteById(id);
            
        } catch (error) {
            throw error;
        }
    }
}