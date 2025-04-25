"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokens = exports.userOtp = exports.userPassword = exports.emailTemplate = exports.kyc = exports.userKycDocs = exports.roles = exports.users = void 0;
const users_1 = __importDefault(require("./users"));
exports.users = users_1.default;
const roles_1 = __importDefault(require("./roles"));
exports.roles = roles_1.default;
const userKycDocs_1 = __importDefault(require("./userKycDocs"));
exports.userKycDocs = userKycDocs_1.default;
const kyc_1 = __importDefault(require("./kyc"));
exports.kyc = kyc_1.default;
const emailTemplates_1 = __importDefault(require("./emailTemplates"));
exports.emailTemplate = emailTemplates_1.default;
const userPassword_1 = __importDefault(require("./userPassword"));
exports.userPassword = userPassword_1.default;
const userOtp_1 = __importDefault(require("./userOtp"));
exports.userOtp = userOtp_1.default;
const tokens_1 = __importDefault(require("./tokens"));
exports.tokens = tokens_1.default;
users_1.default.belongsTo(roles_1.default, {
    foreignKey: "roleId",
});
roles_1.default.hasMany(users_1.default, {
    foreignKey: "roleId",
});
kyc_1.default.belongsTo(users_1.default, {
    foreignKey: "userId"
});
users_1.default.hasOne(kyc_1.default, {
    foreignKey: "userId",
});
userKycDocs_1.default.belongsTo(kyc_1.default, {
    foreignKey: "kycId"
});
kyc_1.default.hasMany(userKycDocs_1.default, {
    foreignKey: "kycId"
});
tokens_1.default.belongsTo(users_1.default, {
    foreignKey: "userId"
});
users_1.default.hasMany(tokens_1.default, {
    foreignKey: "userId"
});
