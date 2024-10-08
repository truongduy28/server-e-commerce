import jwt from 'jsonwebtoken'

const verifyToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, "secret", (err: any, user: any) => {
            if (err) {
                return res.status(403).json("Token is not valid!");
            }
            req._id = user._id;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
}

export { verifyToken }