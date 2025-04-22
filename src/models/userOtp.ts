import sequelize from '@setup/database';
import { DataTypes, Model, Optional } from 'sequelize';

export type UserOtpAttributes = {
    id: number;
    userId: string;
    otp: string;
    createdOn: Date;
}

export type UserOtpCreationAttributes = Optional<UserOtpAttributes, 'id'>;

export type UserOtpInstance = Model<UserOtpAttributes, UserOtpCreationAttributes> & UserOtpAttributes;

const userOtp = sequelize.define<UserOtpInstance>('userOtp', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING(6),
        allowNull: false,
    },
    createdOn: {
        type: DataTypes.DATE,
        allowNull: false,
    }
},
    {
        tableName: 'userOtp',
        timestamps: false,
    }
);

export default userOtp;
