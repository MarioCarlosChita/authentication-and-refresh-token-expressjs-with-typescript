export interface Token {
    id: number;
    accessToken: string;
    refreshToken: string;
    userId: number;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
}