"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../setup/database"));
const roles = database_1.default.define("roles", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    role: {
        allowNull: false,
        type: sequelize_1.DataTypes.ENUM,
        values: ["admin", "user"],
    },
}, {
    tableName: "roles",
    timestamps: false,
});
exports.default = roles;
