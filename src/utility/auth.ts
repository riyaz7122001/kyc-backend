import { JWT_SECRET } from "@setup/secrets";
import { Role } from "@type/index";
import { compare, hash } from "bcrypt";
import { randomBytes } from "crypto";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { Transaction } from "sequelize";

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

export const validatePassword = (password: string, passwordHash: string): Promise<boolean> => {
    return compare(password, passwordHash);
}

export const generateRefreshToken = (size: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        randomBytes(size, (err, buffer) => {
            if (err) reject(err);

            resolve(buffer.toString("hex"));
        });
    });
}

export const generateJWTToken = (userId: string, email: string, userRole: Role, sessionId: string | null) => {
    const data = {
        id: userId,
        email,
        claim: userRole,
        sessionId
    }

    return new Promise((resolve, reject) => {
        sign(data, JWT_SECRET!, { expiresIn: "1d" }, (err, token) => {
            if (err) reject(err);
            if (token) resolve(token?.toString());

            reject(`Token generation failed`);
        })
    })
}