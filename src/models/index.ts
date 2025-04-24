import users from "./users";
import roles from "./roles";
import userKycDocs from "./userKycDocs";
import kyc from "./kyc";
import emailTemplate from "./emailTemplates";
import userPassword from "./userPassword";
import userOtp from "./userOtp";
import tokens from "./tokens";

users.belongsTo(roles, {
    foreignKey: "roleId",
});
roles.hasMany(users, {
    foreignKey: "roleId",
});
kyc.belongsTo(users, {
    foreignKey: "userId"
});
users.hasOne(kyc, {
    foreignKey: "userId"
});
userKycDocs.belongsTo(kyc, {
    foreignKey: "kycId"
});
kyc.hasMany(userKycDocs, {
    foreignKey: "kycId"
});
tokens.belongsTo(users, {
    foreignKey: "userId"
});
users.hasMany(tokens, {
    foreignKey: "userId"
})

export {
    users,
    roles,
    userKycDocs,
    kyc,
    emailTemplate,
    userPassword,
    userOtp,
    tokens
}