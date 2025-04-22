"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("@setup/database"));
const sequelize_1 = require("sequelize");
const users = database_1.default.define("users", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: (0, sequelize_1.literal)("gen_random_uuid()"),
    },
    roleId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "roles",
            key: "id",
        },
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    createdOn: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    createdBy: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
    },
    lastLoggedInOn: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    isDeleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    deletedOn: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    deletedBy: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true
    },
    activationStatus: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    activationStatusUpdatedOn: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    activationStatusUpdatedBy: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    passwordHash: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    passwordSetOn: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: "users",
    timestamps: false
});
exports.default = users;
