"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("@setup/database"));
const sequelize_1 = require("sequelize");
const kyc = database_1.default.define("kyc", {
    id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: (0, sequelize_1.literal)("gen_random_uuid()")
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: "users",
            key: "id",
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        allowNull: false,
        values: ["pending", "verified", "rejected"]
    },
    statusUpdatedOn: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    statusUpdatedBy: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true
    }
}, {
    tableName: "kyc",
    timestamps: false
});
exports.default = kyc;
