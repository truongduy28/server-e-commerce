import jwt from 'jsonwebtoken'
import { Types } from 'mongoose';

interface TokenPayload {
    _id: Types.ObjectId;
    email: string;
    role: number;
}
export const getToken = (payload: TokenPayload) => {
    return jwt.sign(payload, "secret", { expiresIn: "1d" })
}