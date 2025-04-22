"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../setup/database"));
const tokenType = database_1.default.define('tokenTypes', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    type: {
        allowNull: false,
        unique: true,
        type: sequelize_1.DataTypes.STRING(25),
    },
}, {
    tableName: 'tokenTypes',
    timestamps: false,
});
exports.default = tokenType;
