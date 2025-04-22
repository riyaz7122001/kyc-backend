export type ProtectedPayload = {
    userId: string;
    email: string;
    passwordHash?: string | null;
};