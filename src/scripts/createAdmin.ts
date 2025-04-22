import users from "@models/users";
import sequelize from "@setup/database";
import { hashPassword } from "@utility/auth";

export const createAdmin = async (firstName: string, lastName: string, phone: string, email: string, password: string) => {
    const transaction = await sequelize.transaction();
    try {
        const hash = await hashPassword(password);
        await users.create({
            roleId: 1,
            firstName,
            lastName,
            phone,
            email,
            passwordHash: hash,
            passwordSetOn: new Date(),
            createdOn: new Date(),
            isDeleted: false,
            activationStatus: true
        }, {
            transaction
        });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
