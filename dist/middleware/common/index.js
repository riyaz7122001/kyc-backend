"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateToken = void 0;
const database_1 = __importDefault(require("@setup/database"));
const api_1 = require("@utility/api");
const auth_1 = require("@utility/auth");
const sequelize_1 = require("sequelize");
const ValidateToken = (userRole) => async (req, res, next) => {
    let transaction = null;
    try {
        const token = req.cookies?.[`${userRole?.toUpperCase()}_SESSION`];
        if (!token) {
            return (0, api_1.sendResponse)(res, 401, "Missing session token");
        }
        let decodedToken;
        try {
            decodedToken = await (0, auth_1.decodeToken)(token);
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
        // get user here and then validate it
    }
    catch (error) {
        await transaction?.rollback();
        return (0, api_1.sendResponse)(res, 500, error?.message?.toString() || "Internal Server Error");
    }
};
exports.ValidateToken = ValidateToken;
