import { QueryInterfaceCreateTableOptions, STRING } from "sequelize";
import { ENUM } from "sequelize";
import { INTEGER } from "sequelize";
import { QueryInterface } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.createTable("roles", {
            id: {
                type: INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            role: {
                type: ENUM('admin', 'citizen'),
                allowNull: false,
            }
        }, {
            tableName: "roles",
            timestamps: false
        } as QueryInterfaceCreateTableOptions);
    },

    down: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.dropTable({
            tableName: "roles"
        })
    }
}