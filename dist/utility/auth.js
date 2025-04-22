"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.decodeToken = void 0;
const secrets_1 = require("@setup/secrets");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const decodeToken = (token) => {
    if (!token)
        throw new Error('Missing token');
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
