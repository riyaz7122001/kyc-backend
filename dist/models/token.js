"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../setup/database"));
const token = database_1.default.define('tokens', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    token: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(255),
    },
    userId: {
        allowNull: false,
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    typeId: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'tokenTypes',
            key: 'id',
        },
    },
    createdOn: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
    }
}, {
    tableName: 'tokens',
    timestamps: false,
});
exports.default = token;
