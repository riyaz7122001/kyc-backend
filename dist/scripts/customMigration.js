"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const createAdmin_1 = require("./createAdmin");
const logger_1 = __importDefault(require("@setup/logger"));
// You can customize these paths if needed
const adminMigrationsFolder = "migrations";
const seedersFolder = "seeders";
// Arguments passed like: `npm run migrate admin`
const args = process.argv.slice(2);
console.log("args", args);
const role = args[0] || "admin";
const runMigration = () => {
    try {
        logger_1.default.debug("Running Admin Migrations...");
        (0, child_process_1.execSync)(`npx sequelize-cli db:migrate --config config/config.js --env production --migrations-path ${adminMigrationsFolder}`, {
            stdio: "inherit",
        });
    }
    catch (err) {
        logger_1.default.error(`Migration Error: ${err}`);
    }
};
const runSeeders = () => {
    try {
        logger_1.default.debug("Running Seeders...");
        (0, child_process_1.execSync)(`npx sequelize-cli db:seed:all --config config/config.js --env production --seeders-path ${seedersFolder}`, {
            stdio: "inherit",
        });
    }
    catch (err) {
        logger_1.default.error(`Migration Error: ${err}`);
    }
};
const run = async () => {
    runMigration();
    runSeeders();
    (0, createAdmin_1.createAdmin)('Riyaz', 'Shaikh', '9652874130', 'riyaz@yopmail.com', 'Admin@1234')
        .then(() => {
        console.log('Admin user created successfully');
        process.exit(0);
    })
        .catch(error => {
        console.error('Error while creating admin');
        console.error(error);
        process.exit(1);
    });
};
run();
