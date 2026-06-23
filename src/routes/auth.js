import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import messages from '../utils/messages.js';
import {
    ConflictException,
    NotFoundException,
    UnauthorizedException
}

    from '../utils/exceptions.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersPath = path.join(__dirname, '../repositories/data/users.json');

const getUsers = () => {
    const data = fs.readFileSync(usersPath, 'utf-8');
    return JSON.parse(data);
};

const saveUsers = (users) => {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
};

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    const users = getUsers();

    const userExists = users.find(u => u.email === email);
    if (userExists) {
        // email ja cadastrado = 409
        throw new ConflictException(messages.auth.EMAIL_ALREADY_EXISTS);
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

    res.status(201).json({ message: messages.auth.REGISTER_SUCCESS });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const users = getUsers();

    const user = users.find(u => u.email === email);
    if (!user) {
        // não achou usuário = 404
        throw new NotFoundException(messages.auth.USER_NOT_FOUND);
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
        //senha errada = 401
        throw new UnauthorizedException(messages.auth.INVALID_PASSWORD);
    }

    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

export default router;