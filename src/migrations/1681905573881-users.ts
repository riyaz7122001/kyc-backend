import { UUID, literal } from "sequelize";
import { DATE, BOOLEAN, INTEGER, QueryInterface, QueryInterfaceCreateTableOptions, STRING } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');

        await queryInterface.createTable("users", {
            id: {
                type: UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: literal("gen_random_uuid()"),
            },
            roleId: {
                allowNull: false,
                type: INTEGER,
                references: {
                    model: "roles",
                    key: "id",
                },
            },
            firstName: {
                allowNull: false,
                type: STRING(50),
            },
            lastName: {
                allowNull: false,
                type: STRING(50),
            },
            phone: {
                allowNull: false,
                type: STRING(50),
            },
            address: {
                type: STRING(500),
                allowNull: true,
            },
            createdOn: {
                allowNull: false,
                type: DATE,
            },
            createdBy: {
                allowNull: true,
                type: UUID,
            },
            lastLoggedInOn: {
                type: DATE,
            },
            isDeleted: {
                allowNull: false,
                type: BOOLEAN,
                defaultValue: false,
            },
            deletedOn: {
                type: DATE,
            },
            deletedBy: {
                type: UUID,
            },
            activationStatus: {
                allowNull: false,
                type: BOOLEAN,
                defaultValue: true,
            },
            activationStatusUpdatedOn: {
                type: DATE,
            },
            activationStatusUpdatedBy: {
                type: UUID,
            },
            email: {
                allowNull: false,
                type: STRING(50),
            },
            passwordHash: {
                type: STRING(255),
            },
            passwordSetOn: {
                type: DATE,
                allowNull: true,
            },
        },
            {
                tableName: "users",
                timestamps: false,
            } as QueryInterfaceCreateTableOptions
        );

        await queryInterface.addIndex(
            { tableName: "users" },
            {
                fields: ["email", "roleId"],
                unique: true,
                where: {
                    isDeleted: false,
                },
            }
        );

        await queryInterface.addIndex(
            { tableName: "users" },
            {
                fields: ["phone", "roleId"],
                unique: true,
                where: {
                    isDeleted: false,
                },
            }
        );
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable({
            tableName: "users",
        });
    },
};
