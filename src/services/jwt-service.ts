
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export class JwtService {

    static generateAccessToken(payload: any): string {
        const accessToken = jwt.sign(payload,
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "15m" }
        );
        return accessToken;
    }

    static isAcessTokenValid(token: string): boolean {
        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
            return true;
        } catch {
            return false;
        }
    }

    static generateRefreshToken(payload: any): string {
        const refreshToken = jwt.sign(payload,
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: "7d" }
        );
        return refreshToken;
    }

    static isRefreshTokenValid(refreshToken: string): boolean {
        try {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
            return true;
        } catch {
            return false;
        }

    }



}