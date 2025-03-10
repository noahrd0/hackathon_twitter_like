import { verifyToken } from '../config/jwt.js';

export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied token not found.' });
    }

    try {
        const decoded = verifyToken(token);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide.' });
    }
};