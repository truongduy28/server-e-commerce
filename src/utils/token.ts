import jwt from 'jsonwebtoken'

interface TokenPayload {
    _id: string;
    email: string;
    role: number;
}
export const getToken = (payload: TokenPayload) => {
    return jwt.sign(payload, "secret", { expiresIn: "1d" })
}