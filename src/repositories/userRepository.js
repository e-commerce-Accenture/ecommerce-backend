import fs from 'fs'

const file = "./src/repositories/data/users.json"

export class UserRepository {
    async findAll(){
        return await JSON.parse(fs.readFileSync(file))
    }
}