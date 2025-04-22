import sequelize from "@setup/database";
import { DataTypes, Model } from "sequelize";

export interface RoleAttributes {
    id: number;
    role: string;
}

export type RoleInstance = Model<RoleAttributes> & RoleAttributes;

const roles = sequelize.define<RoleInstance>(
    "roles",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        role: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ["admin", "citizen"],
        },
    },
    {
        tableName: "roles",
        timestamps: false,
    }
);

export default roles;
