import jwt from 'jsonwebtoken'
import messages from '../utils/messages.js';
import { ForbiddenException } from '../utils/exceptions.js';


export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: "Token not found" })
    }

    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET);

        req.user = verify;

        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token or expired.' })
    }
}

export function authorizationRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ForbiddenException('Not Authorized');
        }

        next();
    }
}