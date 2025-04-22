"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@setup/logger"));
const secrets_1 = require("@setup/secrets");
const express_1 = __importDefault(require("@setup/express"));
const express_2 = __importDefault(require("@setup/express"));
const http_1 = __importDefault(require("http"));
const error_1 = require("@middleware/error");
const routes_1 = __importDefault(require("./routes"));
const server = http_1.default.createServer(express_1.default);
express_2.default.use(error_1.errorHandler);
express_2.default.use(`/api/v1`, routes_1.default);
server.listen(secrets_1.PORT, () => {
    logger_1.default.debug(`Connection established for database ${secrets_1.DB_NAME} running on port ${secrets_1.PORT}`);
});
