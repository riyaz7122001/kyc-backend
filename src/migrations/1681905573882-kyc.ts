import { UUID, ENUM, DATE } from "sequelize";
import { literal, QueryInterface, QueryInterfaceCreateTableOptions } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.sequelize.query(
            "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
        );

        await queryInterface.createTable("kyc", {
            id: {
                type: UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: literal("gen_random_uuid()")
            },
            userId: {
                type: UUID,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            status: {
                type: ENUM("pending", "verified", "rejected"),
                allowNull: false,
                defaultValue: "pending"
            },
            statusUpdatedOn: {
                type: DATE,
                allowNull: true
            },
            statusUpdatedBy: {
                type: UUID,
                allowNull: true
            }
        }, {
            tableName: "kyc",
            timestamps: false
        } as QueryInterfaceCreateTableOptions)
    },

    down: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.dropTable({
            tableName: "kyc"
        })
    }
}