"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../setup/database"));
const user = database_1.default.define("users", {
    id: {
        allowNull: false,
        primaryKey: true,
        type: sequelize_1.DataTypes.UUID,
        defaultValue: (0, sequelize_1.literal)("gen_random_uuid()"),
    },
    roleId: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "roles",
            key: "id",
        },
    },
    firstName: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(50),
    },
    lastName: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(50),
    },
    phone: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(50),
    },
    address: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    createdOn: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
    },
    createdBy: {
        allowNull: true,
        type: sequelize_1.DataTypes.UUID,
    },
    lastLoggedInOn: {
        type: sequelize_1.DataTypes.DATE,
    },
    isDeleted: {
        allowNull: false,
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    deletedOn: {
        type: sequelize_1.DataTypes.DATE,
    },
    deletedBy: {
        type: sequelize_1.DataTypes.UUID,
    },
    activationStatus: {
        allowNull: false,
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    activationStatusUpdatedOn: {
        type: sequelize_1.DataTypes.DATE,
    },
    activationStatusUpdatedBy: {
        type: sequelize_1.DataTypes.UUID,
    },
    email: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(50),
    },
    passwordHash: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    passwordSetOn: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    sessionId: {
        type: sequelize_1.DataTypes.STRING(100),
    },
}, {
    tableName: "users",
    timestamps: false,
});
exports.default = user;
