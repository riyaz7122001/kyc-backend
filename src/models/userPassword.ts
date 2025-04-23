import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../setup/database';

export type UserPasswordAttributes = {
    id: number;
    userId: string;
    passwordHash: string;
    createdOn: Date;
}

type UserPasswordCreationAttributes = Optional<UserPasswordAttributes, 'id'>;

type UserPasswordInstance = Model<UserPasswordAttributes, UserPasswordCreationAttributes> & UserPasswordAttributes

const userPassword = sequelize.define<UserPasswordInstance>('userPassword', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    createdOn: {
        type: DataTypes.DATE,
        allowNull: false,
    },
},
    {
        tableName: 'userPassword',
        timestamps: false,
    }
);

export default userPassword;