"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("@setup/database"));
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
const userKycDocs = database_1.default.define("userKycDocs", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: (0, sequelize_2.literal)("gen_random_uuid()")
    },
    kycId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: "kyc",
            key: "id",
        },
        unique: true
    },
    adharCardPic: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    panCardPic: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    adharNumber: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true
    },
    panNumber: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: "userKycDocs",
    timestamps: false
});
exports.default = userKycDocs;
