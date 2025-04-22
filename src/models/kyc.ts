import sequelize from "@setup/database";
import { DataTypes, literal, Model } from "sequelize";

export type KycAttributes = {
    id: string;
    userId: string;
    status: string;
    statusUpdatedOn: Date | null;
    statusUpdatedBy: string | null;
}

export type KycInstance = Model<KycAttributes> & KycAttributes;

const kyc = sequelize.define<KycInstance>("kyc", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: literal("gen_random_uuid()")
    },
    userId: {
        type: DataTypes.UUID,
        references: {
            model: "users",
            key: "id",
        },
    },
    status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["pending", "verified", "rejected"]
    },
    statusUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true
    },
    statusUpdatedBy: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    tableName: "kyc",
    timestamps: false
})

export default kyc;