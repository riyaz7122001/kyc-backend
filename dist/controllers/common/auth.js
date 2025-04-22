"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetPassword = exports.ResetPassword = exports.ForgotPassword = exports.Login = void 0;
const api_1 = require("@utility/api");
const Login = (req, res, next) => {
    try {
    }
    catch (error) {
        (0, api_1.sendResponse)(res, 400, "Something went wrong");
    }
};
exports.Login = Login;
const ForgotPassword = (req, res, next) => {
    try {
    }
    catch (error) {
        (0, api_1.sendResponse)(res, 400, "Something went wrong");
    }
};
exports.ForgotPassword = ForgotPassword;
const ResetPassword = (req, res, next) => {
    try {
    }
    catch (error) {
        (0, api_1.sendResponse)(res, 400, "Something went wrong");
    }
};
exports.ResetPassword = ResetPassword;
const SetPassword = (req, res, next) => {
    try {
    }
    catch (error) {
        (0, api_1.sendResponse)(res, 400, "Something went wrong");
    }
};
exports.SetPassword = SetPassword;
