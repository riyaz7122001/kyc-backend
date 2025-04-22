import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../setup/database';

export interface UserPasswordAttributes {
    id: number;
    userId: string;
    passwordHash: string;
    createdOn: Date;
}

interface UserPasswordCreationAttributes
    extends Optional<UserPasswordAttributes, 'id'> { }

interface UserPasswordInstance
    extends Model<UserPasswordAttributes, UserPasswordCreationAttributes>,
    UserPasswordAttributes { }

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