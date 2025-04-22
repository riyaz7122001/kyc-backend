"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../setup/database"));
;
const passwordCriteria = database_1.default.define('passwordCriteria', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    minChars: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    maxChars: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    allowedSpecialChars: {
        type: sequelize_1.DataTypes.STRING(50),
    },
    containsUpperCase: {
        allowNull: false,
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    containsLowerCase: {
        allowNull: false,
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    isAlphaNumeric: {
        allowNull: false,
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    resetPasswordDays: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    isResetPasswordDays: {
        allowNull: true,
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    previousPasswordReuseCount: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    isPreviousPasswordReuseCount: {
        allowNull: true,
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    idleTimeForLogout: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    isIdleTimeForLogout: {
        allowNull: true,
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    monthsInactivityBeforeExpiring: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
    },
    isMonthsInactivityBeforeExpiring: {
        allowNull: true,
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    is2faEnabled: {
        allowNull: false,
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    updatedOn: {
        type: sequelize_1.DataTypes.DATE,
    },
    updatedBy: {
        type: sequelize_1.DataTypes.UUID,
    },
}, {
    tableName: 'passwordCriteria',
    timestamps: false,
});
exports.default = passwordCriteria;
