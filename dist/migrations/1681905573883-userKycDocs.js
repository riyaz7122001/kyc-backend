"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.sequelize.query("CREATE EXTENSION IF NOT EXISTS pgcrypto;");
        await queryInterface.createTable("userKycDocs", {
            id: {
                type: sequelize_1.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: (0, sequelize_2.literal)("gen_random_uuid()")
            },
            kycId: {
                type: sequelize_1.UUID,
                allowNull: false,
                references: {
                    model: "kyc",
                    key: "id",
                },
            },
            adharCardPic: {
                type: sequelize_1.TEXT,
                allowNull: true
            },
            panCardPic: {
                type: sequelize_1.TEXT,
                allowNull: true
            },
            adharNumber: {
                type: (0, sequelize_1.STRING)(50),
                allowNull: true
            },
            panNumber: {
                type: (0, sequelize_1.STRING)(50),
                allowNull: true
            }
        }, {
            tableName: "userKycDocs",
            timestamps: false
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable({
            tableName: "userKycDocs"
        });
    }
};
