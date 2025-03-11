import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export const jwtConfig = {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h',
};

export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
    });
};

export const verifyToken = (token) => {
    return jwt.verify(token, jwtConfig.secret);
};

export const decodeToken = (token) => {
    const decodedToken = jwt.decode(token);
    console.log(decodedToken);
    return decodedToken;
};
