import { Sequelize } from "sequelize";
import {
    DB_ACCQUIRE_TIME, DB_HOST, DB_IDLE_TIME, DB_MAX_CONNECTIONS_POOL, DB_MAX_CONNECTIONS_RETRY, DB_MIN_CONNECTIONS_POOL, DB_NAME,
    DB_USER, DB_PASSWORD, DB_PORT, DB_TIMEOUT_CONNECTIONS_RETRY
} from "./secrets";
import logger from "./logger";

const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD!, {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: "postgres",
    logging: logger.access,
    pool: {
        max: Number(DB_MAX_CONNECTIONS_POOL),
        min: Number(DB_MIN_CONNECTIONS_POOL),
        acquire: Number(DB_ACCQUIRE_TIME),
        idle: Number(DB_IDLE_TIME)
    },
    retry: {
        max: Number(DB_MAX_CONNECTIONS_RETRY),
        timeout: Number(DB_TIMEOUT_CONNECTIONS_RETRY)
    },
    dialectOptions: {
        keepAlive: true
    }
});

sequelize.authenticate()
    .then(() => logger.debug(`${process.pid}: Connection to database ${DB_NAME} has been established successfully`))
    .catch(error => logger.error(`${process.pid}: Unable to connect to database: ${DB_NAME} - ${error}`));

export default sequelize;