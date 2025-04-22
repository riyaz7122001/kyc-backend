"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roles = exports.users = void 0;
const users_1 = __importDefault(require("./users"));
exports.users = users_1.default;
const roles_1 = __importDefault(require("./roles"));
exports.roles = roles_1.default;
roles_1.default.hasMany(users_1.default, {
    foreignKey: "roleId"
});
users_1.default.belongsTo(roles_1.default, {
    foreignKey: "roleId"
});
