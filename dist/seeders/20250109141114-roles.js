"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    async up(queryInterface) {
        return queryInterface.bulkInsert({ tableName: "roles" }, [
            {
                role: "admin",
            },
            {
                role: "citizen",
            },
        ]);
    },
    async down(queryInterface) {
        return queryInterface.bulkDelete({ tableName: "roles" }, {});
    },
};
