const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');

const getUsers = () => {
    const data = fs.readFileSync(usersPath, 'utf-8');
    return JSON.parse(data);
};

const saveUsers = (users) => {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

router.post('/register', async (req, res) => {
    const { name, email, password} = req.body;

    const users = getUsers();

    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: "Email já cadastrado"});
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
        id: uuidv4(),
        name,
        email,
        passwordHash,
        role: 'client'
    };

    users.push(newUser);
    saveUsers(users);

    res.status(201).json({ message: 'Usuario criado com sucesso'});
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const users = getUsers();

    const user = users.find(u => u.email === email);
    if(!user) {
        return res.status(404).json({ message: 'Usuário não encontrado'}); 
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if(!passwordMatch) {
        return res.status(401).json({ message: 'Senha incorreta'});
    }

    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role},
        process.env.JWT_SECRET,
        { expiresIn: '7d'}
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role}});
});

module.exports = router;