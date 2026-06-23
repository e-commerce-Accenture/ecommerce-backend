export class UserService {
    constructor(userRepository){
        this.userRepository = userRepository;
    }
    
    async findAll(){
        const users = await this.userRepository.findAll();

        return users;
    }
}