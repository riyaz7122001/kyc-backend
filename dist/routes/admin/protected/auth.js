"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("@controllers/admin/auth");
const auth_2 = require("@controllers/common/auth");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/logout", (0, auth_2.Logout)("admin"));
router.get(`/profile`, auth_1.GetUserProfile);
exports.default = router;
