"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = void 0;
const users_1 = __importDefault(require("@models/users"));
const database_1 = __importDefault(require("@setup/database"));
const auth_1 = require("@utility/auth");
const createAdmin = async (firstName, lastName, phone, email, password) => {
    const transaction = await database_1.default.transaction();
    try {
        const hash = await (0, auth_1.hashPassword)(password);
        await users_1.default.create({
            roleId: 1,
            firstName,
            lastName,
            phone,
            email,
            passwordHash: hash,
            passwordSetOn: new Date(),
            createdOn: new Date(),
            isDeleted: false,
            activationStatus: true
        }, {
            transaction
        });
        await transaction.commit();
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.createAdmin = createAdmin;
