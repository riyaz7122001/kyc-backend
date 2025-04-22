import sequelize from "@setup/database";
import { DataTypes, Model, Optional, literal } from "sequelize";

export type UserAttributes = {
    id: string;
    roleId: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string | null;
    passwordHash: string | null;
    passwordSetOn: Date | null;
    createdOn: Date;
    createdBy: string | null;
    lastLoggedInOn: Date | null;
    isDeleted: boolean;
    deletedOn: Date | null;
    deletedBy: string | null;
    activationStatus: boolean | null;
    activationStatusUpdatedOn: Date | null;
    activationStatusUpdatedBy: string | null;
};

export type UserCreationAttributes = Optional<UserAttributes, "id">;

export type UserInstance = Model<UserAttributes, UserCreationAttributes> & UserAttributes;

const users = sequelize.define<UserInstance>("users", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: literal("gen_random_uuid()"),
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "roles",
            key: "id",
        },
    },
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    createdOn: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    lastLoggedInOn: {
        type: DataTypes.DATE,
        allowNull: true
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    deletedOn: {
        type: DataTypes.DATE,
        allowNull: true
    },
    deletedBy: {
        type: DataTypes.UUID,
        allowNull: true
    },
    activationStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    activationStatusUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true
    },
    activationStatusUpdatedBy: {
        type: DataTypes.UUID,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    passwordSetOn: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: "users",
    timestamps: false
})

export default users;
