"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.sequelize.query("CREATE EXTENSION IF NOT EXISTS pgcrypto;");
        await queryInterface.createTable("kyc", {
            id: {
                type: sequelize_1.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: (0, sequelize_2.literal)("gen_random_uuid()")
            },
            userId: {
                type: sequelize_1.UUID,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            status: {
                type: (0, sequelize_1.ENUM)("pending", "verified", "rejected"),
                allowNull: false,
            },
            statusUpdatedOn: {
                type: sequelize_1.DATE,
                allowNull: true
            },
            statusUpdatedBy: {
                type: sequelize_1.UUID,
                allowNull: true
            }
        }, {
            tableName: "kyc",
            timestamps: false
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable({
            tableName: "kyc"
        });
    }
};
