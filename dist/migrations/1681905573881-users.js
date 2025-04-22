"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
        await queryInterface.createTable("users", {
            id: {
                type: sequelize_1.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: (0, sequelize_1.literal)("gen_random_uuid()"),
            },
            roleId: {
                allowNull: false,
                type: sequelize_2.INTEGER,
                references: {
                    model: "roles",
                    key: "id",
                },
            },
            firstName: {
                allowNull: false,
                type: (0, sequelize_2.STRING)(50),
            },
            lastName: {
                allowNull: false,
                type: (0, sequelize_2.STRING)(50),
            },
            phone: {
                allowNull: false,
                type: (0, sequelize_2.STRING)(50),
            },
            address: {
                type: (0, sequelize_2.STRING)(500),
                allowNull: true,
            },
            createdOn: {
                allowNull: false,
                type: sequelize_2.DATE,
            },
            createdBy: {
                allowNull: true,
                type: sequelize_1.UUID,
            },
            lastLoggedInOn: {
                type: sequelize_2.DATE,
            },
            isDeleted: {
                allowNull: false,
                type: sequelize_2.BOOLEAN,
                defaultValue: false,
            },
            deletedOn: {
                type: sequelize_2.DATE,
            },
            deletedBy: {
                type: sequelize_1.UUID,
            },
            activationStatus: {
                allowNull: false,
                type: sequelize_2.BOOLEAN,
                defaultValue: true,
            },
            activationStatusUpdatedOn: {
                type: sequelize_2.DATE,
            },
            activationStatusUpdatedBy: {
                type: sequelize_1.UUID,
            },
            email: {
                allowNull: false,
                type: (0, sequelize_2.STRING)(50),
            },
            passwordHash: {
                type: (0, sequelize_2.STRING)(255),
            },
            passwordSetOn: {
                type: sequelize_2.DATE,
                allowNull: true,
            },
        }, {
            tableName: "users",
            timestamps: false,
        });
        await queryInterface.addIndex({ tableName: "users" }, {
            fields: ["email", "roleId"],
            unique: true,
            where: {
                isDeleted: false,
            },
        });
        await queryInterface.addIndex({ tableName: "users" }, {
            fields: ["phone", "roleId"],
            unique: true,
            where: {
                isDeleted: false,
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable({
            tableName: "users",
        });
    },
};
