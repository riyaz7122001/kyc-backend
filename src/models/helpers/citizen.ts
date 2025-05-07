import { users, roles, kyc, userKycDocs } from '../index';
import { col, fn, Op, Order, Transaction } from "sequelize";

export const getCitizenList = async (limit: number, offset: number, sortKey: string | null, sortDir: 'ASC' | 'DESC' | null, search: string | null, transaction: Transaction) => {
    const searchCondition = search ? {
        [Op.or]: [
            { phone: { [Op.like]: `%${search}%` } },
            { firstName: { [Op.iLike]: `%${search}%` } },
            { lastName: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
        ]
    } : {};

    const sortColumn = sortKey && {
        'name': 'firstName',
        'phone': 'phone',
        'email': 'email',
        'active': 'activationStatus'

    }[sortKey];
    const sortOrder = sortColumn ? [[sortColumn, sortDir || 'DESC']] : [['createdOn', 'DESC']];

    const list = await users.findAndCountAll({
        attributes: ['id', 'email', 'activationStatus', 'firstName', 'lastName', 'phone'],
        where: {
            isDeleted: false,
            ...searchCondition,
        },
        include: [{
            model: kyc,
            attributes: ['status', 'statusUpdatedOn', 'statusUpdatedBy'],
            foreignKey: "userId"
        }],
        limit,
        offset,
        order: sortOrder as Order,
        transaction
    });

    return list;
}

export const createCitizen = async (createdBy: string | null, email: string, roleId: number, passwordHash: string | null, firstName: string, lastName: string, phone: string, address: string | null, transaction: Transaction) => {
    const data = await users.create({
        firstName,
        lastName,
        phone,
        email,
        roleId,
        createdOn: new Date(),
        createdBy,
        isDeleted: false,
        ...(address && {
            address
        }),
        ...(passwordHash && {
            passwordHash,
            passwordSetOn: new Date()
        })
    }, { transaction });

    return data;
}

export const editCitizen = async (userId: string, email: string, firstName: string, lastName: string, phone: string, roleId: number, address: string | null, transaction: Transaction) => {
    await users.update({
        email,
        firstName,
        lastName,
        phone,
        roleId,
        ...(address && {
            address
        }),
    }, {
        where: { id: userId },
        transaction
    });
}

export const deleteCitizen = async (userId: string, deletedBy: string, transaction: Transaction) => {
    const userKycRecord = await kyc.findOne({ where: { userId }, transaction });

    if (userKycRecord) {
        await userKycDocs.destroy({
            where: { kycId: userKycRecord.id },
            transaction
        });

        await kyc.destroy({
            where: { userId },
            transaction
        });
    }

    await users.update({
        isDeleted: true,
        deletedOn: new Date(),
        deletedBy
    }, {
        where: { id: userId },
        transaction
    });
};


export const getCitizenById = async (userId: string, deleted: boolean, transaction: Transaction) => {
    const data = await users.findOne({
        where: {
            id: userId,
            isDeleted: deleted
        },
        transaction
    })
    return data;
}

export const getCitizenDetails = async (userId: string, transaction: Transaction) => {
    const data = await users.findOne({
        attributes: ['id', 'email', 'activationStatus', 'firstName', 'lastName', 'phone'],
        where: {
            id: userId,
            isDeleted: false
        }, transaction

    })
    return data;
}

export const changeCitizenActivation = async (userId: string, isActive: boolean, updatedBy: string, transaction: Transaction) => {
    await users.update({
        activationStatus: isActive,
        activationStatusUpdatedOn: new Date(),
        activationStatusUpdatedBy: updatedBy
    }, {
        where: { id: userId },
        transaction
    });
}

export const getRoleById = async (roleId: number, transaction: Transaction) => {
    const role = await roles.findOne({
        attributes: ['role'],
        where: { id: roleId },
        transaction
    });
    return role;
}

export const getCitizenByEmail = async (email: string, exceptionId: string | null, transaction: Transaction) => {
    const staff = await users.findOne({
        attributes: ['id'],
        where: {
            email,
            isDeleted: false,
            ...(exceptionId && { id: { [Op.ne]: exceptionId } }),
        },
        transaction
    });

    return staff;
}

export const updateKycStatus = async (userId: string, status: "pending" | "processing" | "verified" | "rejected", statusUpdatedBy: string, transaction: Transaction) => {
    await kyc.create({
        userId,
        status,
        statusUpdatedOn: new Date(),
        statusUpdatedBy: statusUpdatedBy
    }, { transaction });
}

export const getUserKyc = async (userId: string, transaction: Transaction) => {
    const userKycRecord = await kyc.findOne({
        attributes: ['id', 'status', 'statusUpdatedOn', 'statusUpdatedBy'],
        where: { userId }, transaction
    });

    return userKycRecord;
}

export const upsertKycDocsDocuments = async (
    kycId: string,
    adharBase64: string | null,
    panBase64: string | null,
    adharNumber: string | null,
    panNumber: string | null,
    transaction: Transaction
) => {
    const existingRecord = await userKycDocs.findOne({
        where: { kycId },
        transaction,
    });

    if (existingRecord) {
        const updatedRecord = await existingRecord.update(
            {
                adharCardPic: adharBase64 ?? existingRecord.adharCardPic,
                panCardPic: panBase64 ?? existingRecord.panCardPic,
                adharNumber: adharNumber ?? existingRecord.adharNumber,
                panNumber: panNumber ?? existingRecord.panNumber,
            },
            { transaction }
        );
        return { record: updatedRecord, created: false };
    } else {
        const newRecord = await userKycDocs.create(
            {
                kycId,
                adharCardPic: adharBase64,
                panCardPic: panBase64,
                adharNumber,
                panNumber,
            },
            { transaction }
        );
        return { record: newRecord, created: true };
    }
};

export const updateCitizenKycStatus = async (userId: string, status: "pending" | "processing" | "verified" | "rejected", statusUpdatedBy: string, transaction: Transaction) => {
    await kyc.update({
        userId,
        status,
        statusUpdatedOn: new Date(),
        statusUpdatedBy: statusUpdatedBy
    }, {
        where: { userId }, transaction
    });
}

export const getUserKycDocs = async (adharNumber: string, panNumber: string, transaction: Transaction) => {
    const userDocs = await userKycDocs.findOne({
        where: {
            [Op.or]: [
                { adharNumber },
                { panNumber }
            ]
        }, transaction
    });

    return userDocs;
}

export const getDashboardDetails = async () => {
    try {
        const totalUsers = await users.count({
            where: {
                isDeleted: false
            }
        });

        const kycCounts = await kyc.findAll({
            attributes: [
                'status',
                [fn('COUNT', col('status')), 'count']
            ],
            group: ['status']
        });

        // Convert to object for easy access
        const statusCountMap: Record<string, number> = {
            pending: 0,
            processing: 0,
            verified: 0,
            rejected: 0
        };

        for (const row of kycCounts) {
            const status = row.getDataValue('status') as string;
            const count = parseInt(row.getDataValue('count' as any)); // or: as unknown as string

            if (status && statusCountMap.hasOwnProperty(status)) {
                statusCountMap[status] = count;
            }
        }

        return {
            totalUsers,
            kycStatusCounts: statusCountMap
        };
    } catch (error) {
        console.error("Error fetching dashboard details:", error);
        throw error;
    };
}