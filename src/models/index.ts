import users from "./users";
import roles from "./roles";

roles.hasMany(users, {
    foreignKey: "roleId"
});
users.belongsTo(roles, {
    foreignKey: "roleId"
})

export {
    users,
    roles
}