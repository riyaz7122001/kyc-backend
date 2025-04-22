import { INTEGER, QueryInterface, QueryInterfaceCreateTableOptions, TEXT, STRING } from 'sequelize';

module.exports = {
    up: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.createTable('emailTemplates', {
            id: {
                type: INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            title: {
                type: STRING(50),
                allowNull: false,
                unique: true
            },
            content: {
                type: TEXT,
                allowNull: false,
            }
        }, {
            tableName: 'emailTemplates',
            timestamps: false
        } as QueryInterfaceCreateTableOptions)
    },


    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable({
            tableName: 'emailTemplates'
        });
    }
};