import { UUID } from 'sequelize';
import { DATE, INTEGER, QueryInterface, QueryInterfaceCreateTableOptions, STRING } from 'sequelize';

module.exports = {
    up: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.createTable('tokens', {
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
            token: {
                type: STRING(255),
                allowNull: false,
            },
            createdOn: {
                type: DATE,
                allowNull: false,
            }
        }, {
            tableName: 'tokens',
            timestamps: false
        } as QueryInterfaceCreateTableOptions)
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable({
            tableName: 'tokens'
        });
    }
};