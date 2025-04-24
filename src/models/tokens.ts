import sequelize from "@setup/database";
import { DataTypes, Model, Optional } from "sequelize";

export interface TokenAttributes {
    id: number;
    userId: string;
    token: string;
    createdOn: Date;
    user?: {
        id: string;
        email: string;
        passwordHash: string;
        passwordSetOn: Date;
        roleId: number;
    }
}

type TokenCreationAttributes = Optional<TokenAttributes, "id">;

export type TokenInstance = Model<TokenCreationAttributes> & TokenCreationAttributes;

const tokens = sequelize.define<TokenInstance>(
    "tokens",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "id"
            }
        },
        token: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        createdOn: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    },
    {
        tableName: "tokens",
        timestamps: false,
    }
);

export default tokens;
