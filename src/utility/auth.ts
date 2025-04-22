import { JWT_SECRET } from "@setup/secrets";
import { hash } from "bcrypt";
import { JwtPayload, verify } from "jsonwebtoken";

export const decodeToken = (token: string) => {
    if (!token) throw new Error('Missing token');

    return new Promise<JwtPayload>((resolve, reject) => {
        verify(token, JWT_SECRET!, (error, decodedToken) => {
            if (error) reject(error)
            resolve(decodedToken as JwtPayload);
        })
    })
}

export const hashPassword = async (password: string) => {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
}