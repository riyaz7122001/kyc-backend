"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = require("@utility/api");
const secrets_1 = require("./secrets");
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(api_1.requestLogger);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: [secrets_1.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173", "http://localhost:4173"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));
exports.default = app;
