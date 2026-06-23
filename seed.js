const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const { log } = require('console');

const usersPath = path.join(__dirname, 'src/data/users.json');

const seedAdmin = async () => {
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

    const adminExists = users.find(u => u.role === 'admin');
    if(adminExists) {
        console.log('Admin já existe!');
        return;
    }

    const passwordHash = await bcrypt.hash('admin123', 10);

    const admin = {
        id: uuidv4(),
        name: 'Admin',
        email: 'admin@nextgen.com',
        passwordHash,
        role: "admin"
    };

    users.push(admin);
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    console.log("Admin criado com sucesso!");
    console.log("Email: admin@nextgen.com");
    console.log("Senha: admin123");
        
};

seedAdmin();