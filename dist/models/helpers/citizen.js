"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardDetails = exports.getUserKycDocs = exports.updateCitizenKycStatus = exports.upsertKycDocsDocuments = exports.getUserKyc = exports.updateKycStatus = exports.getCitizenByEmail = exports.getRoleById = exports.changeCitizenActivation = exports.getCitizenDetails = exports.getCitizenById = exports.deleteCitizen = exports.editCitizen = exports.createCitizen = exports.getCitizenList = void 0;
const index_1 = require("../index");
const sequelize_1 = require("sequelize");
const getCitizenList = async (limit, offset, sortKey, sortDir, search, transaction) => {
    const searchCondition = search ? {
        [sequelize_1.Op.or]: [
            { phone: { [sequelize_1.Op.like]: `%${search}%` } },
            { firstName: { [sequelize_1.Op.iLike]: `%${search}%` } },
            { lastName: { [sequelize_1.Op.iLike]: `%${search}%` } },
            { email: { [sequelize_1.Op.iLike]: `%${search}%` } }
        ]
    } : {};
    const sortColumn = sortKey && {
        'name': 'firstName',
        'phone': 'phone',
        'email': 'email',
        'active': 'activationStatus'
    }[sortKey];
    const sortOrder = sortColumn ? [[sortColumn, sortDir || 'DESC']] : [['createdOn', 'DESC']];
    const list = await index_1.users.findAndCountAll({
        attributes: ['id', 'email', 'activationStatus', 'firstName', 'lastName', 'phone'],
        where: {
            isDeleted: false,
            ...searchCondition,
        },
        include: [{
                model: index_1.kyc,
                attributes: ['status', 'statusUpdatedOn', 'statusUpdatedBy'],
                foreignKey: "userId"
            }],
        limit,
        offset,
        order: sortOrder,
        transaction
    });
    return list;
};
exports.getCitizenList = getCitizenList;
const createCitizen = async (createdBy, email, roleId, passwordHash, firstName, lastName, phone, address, transaction) => {
    const data = await index_1.users.create({
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
};
exports.createCitizen = createCitizen;
const editCitizen = async (userId, email, firstName, lastName, phone, roleId, address, transaction) => {
    await index_1.users.update({
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
};
exports.editCitizen = editCitizen;
const deleteCitizen = async (userId, deletedBy, transaction) => {
    const userKycRecord = await index_1.kyc.findOne({ where: { userId }, transaction });
    if (userKycRecord) {
        await index_1.userKycDocs.destroy({
            where: { kycId: userKycRecord.id },
            transaction
        });
        await index_1.kyc.destroy({
            where: { userId },
            transaction
        });
    }
    await index_1.users.update({
        isDeleted: true,
        deletedOn: new Date(),
        deletedBy
    }, {
        where: { id: userId },
        transaction
    });
};
exports.deleteCitizen = deleteCitizen;
const getCitizenById = async (userId, deleted, transaction) => {
    const data = await index_1.users.findOne({
        where: {
            id: userId,
            isDeleted: deleted
        },
        transaction
    });
    return data;
};
exports.getCitizenById = getCitizenById;
const getCitizenDetails = async (userId, transaction) => {
    const data = await index_1.users.findOne({
        attributes: ['id', 'email', 'activationStatus', 'firstName', 'lastName', 'phone'],
        where: {
            id: userId,
            isDeleted: false
        }, transaction
    });
    return data;
};
exports.getCitizenDetails = getCitizenDetails;
const changeCitizenActivation = async (userId, isActive, updatedBy, transaction) => {
    await index_1.users.update({
        activationStatus: isActive,
        activationStatusUpdatedOn: new Date(),
        activationStatusUpdatedBy: updatedBy
    }, {
        where: { id: userId },
        transaction
    });
};
exports.changeCitizenActivation = changeCitizenActivation;
const getRoleById = async (roleId, transaction) => {
    const role = await index_1.roles.findOne({
        attributes: ['role'],
        where: { id: roleId },
        transaction
    });
    return role;
};
exports.getRoleById = getRoleById;
const getCitizenByEmail = async (email, exceptionId, transaction) => {
    const staff = await index_1.users.findOne({
        attributes: ['id'],
        where: {
            email,
            isDeleted: false,
            ...(exceptionId && { id: { [sequelize_1.Op.ne]: exceptionId } }),
        },
        transaction
    });
    return staff;
};
exports.getCitizenByEmail = getCitizenByEmail;
const updateKycStatus = async (userId, status, statusUpdatedBy, transaction) => {
    await index_1.kyc.create({
        userId,
        status,
        statusUpdatedOn: new Date(),
        statusUpdatedBy: statusUpdatedBy
    }, { transaction });
};
exports.updateKycStatus = updateKycStatus;
const getUserKyc = async (userId, transaction) => {
    const userKycRecord = await index_1.kyc.findOne({
        attributes: ['id', 'status', 'statusUpdatedOn', 'statusUpdatedBy'],
        where: { userId }, transaction
    });
    return userKycRecord;
};
exports.getUserKyc = getUserKyc;
const upsertKycDocsDocuments = async (kycId, adharBase64, panBase64, adharNumber, panNumber, transaction) => {
    const existingRecord = await index_1.userKycDocs.findOne({
        where: { kycId },
        transaction,
    });
    if (existingRecord) {
        const updatedRecord = await existingRecord.update({
            adharCardPic: adharBase64 ?? existingRecord.adharCardPic,
            panCardPic: panBase64 ?? existingRecord.panCardPic,
            adharNumber: adharNumber ?? existingRecord.adharNumber,
            panNumber: panNumber ?? existingRecord.panNumber,
        }, { transaction });
        return { record: updatedRecord, created: false };
    }
    else {
        const newRecord = await index_1.userKycDocs.create({
            kycId,
            adharCardPic: adharBase64,
            panCardPic: panBase64,
            adharNumber,
            panNumber,
        }, { transaction });
        return { record: newRecord, created: true };
    }
};
exports.upsertKycDocsDocuments = upsertKycDocsDocuments;
const updateCitizenKycStatus = async (userId, status, statusUpdatedBy, transaction) => {
    await index_1.kyc.update({
        userId,
        status,
        statusUpdatedOn: new Date(),
        statusUpdatedBy: statusUpdatedBy
    }, {
        where: { userId }, transaction
    });
};
exports.updateCitizenKycStatus = updateCitizenKycStatus;
const getUserKycDocs = async (adharNumber, panNumber, transaction) => {
    const userDocs = await index_1.userKycDocs.findOne({
        where: {
            [sequelize_1.Op.or]: [
                { adharNumber },
                { panNumber }
            ]
        }, transaction
    });
    return userDocs;
};
exports.getUserKycDocs = getUserKycDocs;
const getDashboardDetails = async () => {
    try {
        const totalUsers = await index_1.users.count();
        const kycCounts = await index_1.kyc.findAll({
            attributes: [
                'status',
                [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('status')), 'count']
            ],
            group: ['status']
        });
        // Convert to object for easy access
        const statusCountMap = {
            pending: 0,
            processing: 0,
            verified: 0,
            rejected: 0
        };
        for (const row of kycCounts) {
            const status = row.getDataValue('status');
            const count = parseInt(row.getDataValue('count')); // or: as unknown as string
            if (status && statusCountMap.hasOwnProperty(status)) {
                statusCountMap[status] = count;
            }
        }
        return {
            totalUsers,
            kycStatusCounts: statusCountMap
        };
    }
    catch (error) {
        console.error("Error fetching dashboard details:", error);
        throw error;
    }
    ;
};
exports.getDashboardDetails = getDashboardDetails;
