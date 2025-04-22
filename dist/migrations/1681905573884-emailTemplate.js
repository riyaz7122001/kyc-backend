"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable('emailTemplates', {
            id: {
                type: sequelize_1.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            title: {
                type: (0, sequelize_1.STRING)(50),
                allowNull: false,
                unique: true
            },
            content: {
                type: sequelize_1.TEXT,
                allowNull: false,
            }
        }, {
            tableName: 'emailTemplates',
            timestamps: false
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable({
            tableName: 'emailTemplates'
        });
    }
};
