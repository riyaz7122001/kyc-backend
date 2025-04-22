"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
module.exports = {
    up: async (queryInterface) => {
        await queryInterface.createTable('userOtp', {
            id: {
                type: sequelize_2.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            userId: {
                type: sequelize_1.UUID,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'users'
                    },
                    key: 'id'
                }
            },
            otp: {
                type: (0, sequelize_2.STRING)(6),
                allowNull: false,
            },
            createdOn: {
                type: sequelize_2.DATE,
                allowNull: false,
            }
        }, {
            tableName: 'userOtp',
            timestamps: false
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable({
            tableName: 'userOtp'
        });
    }
};
