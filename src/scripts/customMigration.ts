import { execSync } from "child_process";
import { createAdmin } from "./createAdmin";
import logger from "@setup/logger";

const adminMigrationsFolder = "migrations";
const seedersFolder = "seeders";

// Arguments passed like: `npm run migrate admin`
const args = process.argv.slice(2);
console.log("args", args);

const runMigration = () => {
    try {
        logger.debug("Running Admin Migrations...");
        execSync(`npx sequelize-cli db:migrate --config config/config.js --env production --migrations-path ${adminMigrationsFolder}`);
    } catch (err) {
        logger.error(`Migration Error: ${err}`);
    }
};

const runSeeders = () => {
    try {
        logger.debug("Running Seeders...");
        execSync(`npx sequelize-cli db:seed:all --config config/config.js --env production --seeders-path ${seedersFolder}`);
    } catch (err) {
        logger.error(`Migration Error: ${err}`);
    }
};

const run = async () => {
    runMigration();
    runSeeders();

    createAdmin('Riyaz', 'Shaikh', '9652874130', 'riyaz@yopmail.com', 'Admin@1234')
        .then(() => {
            console.log('Admin user created successfully');
            process.exit(0);
        })
        .catch(error => {
            console.error('Error while creating admin');
            console.error(error);
            process.exit(1);
        })
};

run();
