"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateChangePassword = exports.ValidateEmailToken = exports.ValidatePassword = exports.ValidateEmail = exports.StartTransaction = exports.ValidateToken = void 0;
const helpers_1 = require("@models/helpers");
const auth_1 = require("@models/helpers/auth");
const database_1 = __importDefault(require("@setup/database"));
const api_1 = require("@utility/api");
const auth_2 = require("@utility/auth");
const sequelize_1 = require("sequelize");
const ValidateToken = (userRole) => async (req, res, next) => {
    let transaction = null;
    try {
        const token = req.cookies?.[`${userRole?.toUpperCase()}_SESSION_TOKEN`];
        if (!token) {
            return (0, api_1.sendResponse)(res, 401, "Missing session token");
        }
        let decodedToken;
        try {
            decodedToken = await (0, auth_2.decodeToken)(token);
        }
        catch (error) {
            return (0, api_1.sendResponse)(res, 403, "Invalid Token");
        }
        const claim = decodedToken?.claim;
        if (claim !== userRole) {
            return (0, api_1.sendResponse)(res, 401, "Invalid claim in token");
        }
        transaction = await database_1.default.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
        });
        const user = await (0, helpers_1.getUserById)(decodedToken.id, false, true, transaction);
        if (!user || (user?.roleId !== 1 && userRole === "admin") || (user?.roleId !== 2 && userRole === "citizen")) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 403, "Invalid user");
        }
        if (!user.activationStatus) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 403, "Your account has been disabled, please contact system administrator");
        }
        req.transaction = transaction;
        req.payload = {
            userId: user.id,
            email: user.email,
            passwordHash: user.passwordHash
        };
        next();
    }
    catch (error) {
        await transaction?.rollback();
        return (0, api_1.sendResponse)(res, 500, error?.message?.toString() || "Internal Server Error");
    }
};
exports.ValidateToken = ValidateToken;
const StartTransaction = async (req, res, next) => {
    try {
        const transaction = await database_1.default.transaction({ isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.REPEATABLE_READ });
        req.transaction = transaction;
        next();
    }
    catch (error) {
        (0, api_1.sendResponse)(res, 500, 'Error while beginning transaction');
    }
};
exports.StartTransaction = StartTransaction;
const ValidateEmail = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const email = req.body.email;
        const userDetails = await (0, helpers_1.getUserByEmail)(email, false, transaction);
        if (!userDetails) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, "User not found");
        }
        if (!userDetails.activationStatus) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, "User is disabled");
        }
        req.payload = {
            userId: userDetails.id,
            roleId: userDetails.roleId,
            email: userDetails.email,
            passwordHash: userDetails.passwordHash,
            passwordSetOn: userDetails.passwordSetOn
        };
        next();
    }
    catch (error) {
        await transaction.rollback();
        (0, api_1.sendResponse)(res, 500, "Internal server error");
    }
};
exports.ValidateEmail = ValidateEmail;
const ValidatePassword = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { password } = req.body;
        const { passwordHash, passwordSetOn } = req.payload;
        if (!passwordHash || !passwordSetOn) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 403, "Password not set for user");
        }
        const isValidPassword = await (0, auth_2.validatePassword)(password, passwordHash);
        if (!isValidPassword) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 401, "Invalid password");
        }
        req.payload = {
            ...req.payload
        };
        next();
    }
    catch (error) {
        await transaction.rollback();
        (0, api_1.sendResponse)(res, 500, "Internal server error");
    }
};
exports.ValidatePassword = ValidatePassword;
const ValidateEmailToken = async (req, res, next) => {
    console.log("insdie validate email token");
    const transaction = req.transaction;
    try {
        const { emailToken } = req.body;
        const userDetails = await (0, auth_1.getUserByEmailToken)(emailToken, transaction);
        if (!userDetails) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 401, "Invalid token");
        }
        req.payload = {
            userId: userDetails.userId,
            email: userDetails.user?.email,
            passwordHash: userDetails?.user?.passwordHash,
            passwordSetOn: userDetails.user?.passwordSetOn,
            roleId: userDetails?.user?.roleId
        };
        next();
    }
    catch (error) {
        await transaction.rollback();
        (0, api_1.sendResponse)(res, 500, "Internal server error");
    }
};
exports.ValidateEmailToken = ValidateEmailToken;
const ValidateChangePassword = async (req, res, next) => {
    const transaction = req.transaction;
    try {
        const { password } = req.body;
        const { passwordHash } = req.payload;
        if (!passwordHash) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, "Password not set");
        }
        const isValidPassword = await (0, auth_2.validatePassword)(password, passwordHash);
        if (!isValidPassword) {
            await transaction.rollback();
            return (0, api_1.sendResponse)(res, 400, "Invalid Password");
        }
        next();
    }
    catch (error) {
        await transaction.rollback();
        (0, api_1.sendResponse)(res, 500, "Internal server error");
    }
};
exports.ValidateChangePassword = ValidateChangePassword;
