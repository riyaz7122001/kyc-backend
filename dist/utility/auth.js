"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWTToken = exports.generateRefreshToken = exports.validatePassword = exports.hashPassword = exports.decodeToken = void 0;
const secrets_1 = require("@setup/secrets");
const bcrypt_1 = require("bcrypt");
const crypto_1 = require("crypto");
const jsonwebtoken_1 = require("jsonwebtoken");
const decodeToken = (token) => {
    if (!token)
        throw new Error('Missing session token');
    return new Promise((resolve, reject) => {
        (0, jsonwebtoken_1.verify)(token, secrets_1.JWT_SECRET, (error, decodedToken) => {
            if (error)
                reject(error);
            resolve(decodedToken);
        });
    });
};
exports.decodeToken = decodeToken;
const hashPassword = async (password) => {
    const hashedPassword = await (0, bcrypt_1.hash)(password, 10);
    return hashedPassword;
};
exports.hashPassword = hashPassword;
const validatePassword = (password, passwordHash) => {
    return (0, bcrypt_1.compare)(password, passwordHash);
};
exports.validatePassword = validatePassword;
const generateRefreshToken = (size) => {
    return new Promise((resolve, reject) => {
        (0, crypto_1.randomBytes)(size, (err, buffer) => {
            if (err)
                reject(err);
            resolve(buffer.toString("hex"));
        });
    });
};
exports.generateRefreshToken = generateRefreshToken;
const generateJWTToken = (userId, email, userRole, sessionId) => {
    const data = {
        id: userId,
        email,
        claim: userRole,
        sessionId
    };
    return new Promise((resolve, reject) => {
        (0, jsonwebtoken_1.sign)(data, secrets_1.JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
            if (err)
                reject(err);
            if (token)
                resolve(token?.toString());
            reject(`Token generation failed`);
        });
    });
};
exports.generateJWTToken = generateJWTToken;
