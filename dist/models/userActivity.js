"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../setup/database"));
const userActivity = database_1.default.define('userActivity', {
    id: {
        primaryKey: true,
        defaultValue: (0, sequelize_1.literal)('gen_random_uuid()'),
        type: sequelize_1.DataTypes.UUID,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: {
                tableName: 'users'
            },
            key: 'id'
        }
    },
    lastActivityOn: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    tableName: 'userActivity',
    timestamps: false,
});
exports.default = userActivity;
