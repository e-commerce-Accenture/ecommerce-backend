import "dotenv/config";
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET;
const EXP = process.env.JWT_EXPIRATION;

export function generateToken(user) {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    return jwt.sign(payload, SECRET, {expiresIn: EXP})
}