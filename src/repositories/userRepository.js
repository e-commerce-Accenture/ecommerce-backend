import fs from 'fs'

const file = "./src/repositories/data/users.json"

export class UserRepository {
    async create(user){
        const newUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            passwordHash: user.passwordHash,
            role: user.role
        };

        const users = await JSON.parse(fs.readFileSync(file, 'utf-8'));

        users.push(newUser);

        const updatedUsers = JSON.stringify(users, null, 2);

        fs.writeFileSync(file, updatedUsers)

        return newUser;

    }

    async findByEmail(email){
        const users = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const finded = users.find(u => u.email === email)

        if(finded){
            return true
        }

        return false;
    }

    async findAll(){
        return JSON.parse(fs.readFileSync(file, 'utf-8'))
    }
}