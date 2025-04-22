"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const secrets_1 = require("./secrets");
const logger_1 = __importDefault(require("./logger"));
const sequelize = new sequelize_1.Sequelize(secrets_1.DB_NAME, secrets_1.DB_USER, secrets_1.DB_PASSWORD, {
    host: secrets_1.DB_HOST,
    port: Number(secrets_1.DB_PORT),
    dialect: "postgres",
    logging: logger_1.default.access,
    pool: {
        max: Number(secrets_1.DB_MAX_CONNECTIONS_POOL),
        min: Number(secrets_1.DB_MIN_CONNECTIONS_POOL),
        acquire: Number(secrets_1.DB_ACCQUIRE_TIME),
        idle: Number(secrets_1.DB_IDLE_TIME)
    },
    retry: {
        max: Number(secrets_1.DB_MAX_CONNECTIONS_RETRY),
        timeout: Number(secrets_1.DB_TIMEOUT_CONNECTIONS_RETRY)
    },
    dialectOptions: {
        keepAlive: true
    }
});
sequelize.authenticate()
    .then(() => logger_1.default.debug(`${process.pid}: Connection to database ${secrets_1.DB_NAME} has been established successfully`))
    .catch(error => logger_1.default.error(`${process.pid}: Unable to connect to database: ${secrets_1.DB_NAME} - ${error}`));
exports.default = sequelize;
