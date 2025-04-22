import { UUID } from 'sequelize';
import { DATE, INTEGER, QueryInterface, QueryInterfaceCreateTableOptions, STRING } from 'sequelize';

module.exports = {
    up: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.createTable('userPassword', {
            id: {
                type: INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            userId: {
                type: UUID,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'users'
                    },
                    key: 'id'
                }
            },
            passwordHash: {
                type: STRING(255),
                allowNull: false,
            },
            createdOn: {
                type: DATE,
                allowNull: false,
            }
        }, {
            tableName: 'userPassword',
            timestamps: false
        } as QueryInterfaceCreateTableOptions)
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable({
            tableName: 'userPassword'
        });
    }
};