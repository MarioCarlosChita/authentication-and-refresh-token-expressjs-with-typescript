
export interface CreateToken {
    accessToken: string;
    refreshToken: string;
    userId: number;
    expiresAt: Date;
}
