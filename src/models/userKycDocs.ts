import sequelize from "@setup/database";
import { Model, DataTypes } from "sequelize";
import { literal } from "sequelize";

export type UserKycDocsAttributes = {
    id: string;
    kycId: string;
    adharCardPic: string;
    panCardPic: Date | null;
    adharNumber: string | null;
    panNumber: string | null;
}

export type UserKycDocsInstance = Model<UserKycDocsAttributes> & UserKycDocsAttributes;

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
    },
    adharCardPic: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    panCardPic: {
        type: DataTypes.TEXT,
        allowNull: true
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