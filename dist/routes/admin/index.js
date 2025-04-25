"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protected_1 = __importDefault(require("./protected"));
const auth_1 = __importDefault(require("./auth"));
const common_1 = require("@middleware/common");
const router = (0, express_1.Router)();
router.use(`/protected`, (0, common_1.ValidateToken)("admin"), protected_1.default);
router.use(`/auth`, common_1.StartTransaction, auth_1.default);
exports.default = router;
