import { UUID, TEXT, STRING } from "sequelize";
import { literal, QueryInterfaceCreateTableOptions, QueryInterface } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.sequelize.query(
            "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
        );

        await queryInterface.createTable("userKycDocs", {
            id: {
                type: UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: literal("gen_random_uuid()")
            },
            kycId: {
                type: UUID,
                allowNull: false,
                references: {
                    model: "kyc",
                    key: "id",
                },
            },
            adharCardPic: {
                type: TEXT,
                allowNull: true
            },
            panCardPic: {
                type: TEXT,
                allowNull: true
            },
            adharNumber: {
                type: STRING(50),
                allowNull: true
            },
            panNumber: {
                type: STRING(50),
                allowNull: true
            }
        }, {
            tableName: "userKycDocs",
            timestamps: false
        } as QueryInterfaceCreateTableOptions);
    },

    down: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.dropTable({
            tableName: "userKycDocs"
        })
    }
}