import logger from "@setup/logger";
import { DB_NAME, PORT } from "@setup/secrets";
import app from "@setup/express";
import express from "@setup/express"
import http from "http";
import { errorHandler } from "@middleware/error";
import router from "./routes";

const server = http.createServer(app);

express.use(errorHandler);
express.use(`/api`, router);

server.listen(PORT, () => {
  logger.debug(`Connection established for database ${DB_NAME} running on port ${PORT}`);
});