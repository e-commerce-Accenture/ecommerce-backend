import jwt from 'jsonwebtoken'
import messages from '../utils/messages.js';


export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401)
            .json({ message: messages.auth.TOKEN_MISSING });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403)
                .json({ message: messages.auth.TOKEN_INVALID });

        }
        req.user = user;
        next();
    })
}

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403)
            .json({ message: messages.auth.FORBIDDEN });

    }
    next();
}