"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("@setup/database"));
const sequelize_1 = require("sequelize");
const tokens = database_1.default.define("tokens", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },
    token: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    createdOn: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: "tokens",
    timestamps: false,
});
exports.default = tokens;
