import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersPath = path.join(__dirname, '../repositories/data/users.json');


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const users = getUsers();

    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

export default router;