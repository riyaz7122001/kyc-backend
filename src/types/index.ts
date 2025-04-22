import { Request } from "express";
import { Transaction } from "sequelize";

export type ServerResponse = {
    success: boolean;
    message: string;
    data: any[];
    errors: any[];
}

export type Role = "admin" | "citizen";

export type RequestWithPayload<T> = Request & {
    payload?: T;
    transaction?: Transaction;
}

export type WithTransaction = Request & {
    transaction?: Transaction;
}

export type WhereCondition = {
    id: string;
    isDeleted: boolean;
    role?: Role;
}

export type LoginPayload = {
    userId: string;
    email: string;
    roleId: number;
    passwordHash?: string | null;
    passwordSetOn?: Date;
};