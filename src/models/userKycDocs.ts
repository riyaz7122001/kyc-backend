import sequelize from "@setup/database";
import { Model, DataTypes, Optional } from "sequelize";
import { literal } from "sequelize";

export type UserKycDocsAttributes = {
    id: string;
    kycId: string;
    adharCardPic: string | null;
    panCardPic: string | null;
    adharNumber: string | null;
    panNumber: string | null;
}

type UserKycDocsCreationAttributes = Optional<UserKycDocsAttributes, "id">;
export type UserKycDocsInstance = Model<UserKycDocsCreationAttributes> & UserKycDocsCreationAttributes;

const userKycDocs = sequelize.define<UserKycDocsInstance>("userKycDocs", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: literal("gen_random_uuid()")
    },
    kycId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "kyc",
            key: "id",
        },
        unique: true
    },
    adharCardPic: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    panCardPic: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },
    adharNumber: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    panNumber: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: "userKycDocs",
    timestamps: false
});

export default userKycDocs;