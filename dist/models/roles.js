"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("@setup/database"));
const sequelize_1 = require("sequelize");
const roles = database_1.default.define("roles", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM,
        allowNull: false,
        values: ["admin", "citizen"],
    },
}, {
    tableName: "roles",
    timestamps: false,
});
exports.default = roles;
