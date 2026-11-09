import { NextFunction, Request, Response } from "express";
import { JwtService } from "../services/jwt-service";
import { TokenRepository } from "../repository/token-repository";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "unauthorized",
            status: 401,
        });
    }

    const token = header.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "unauthorized",
            status: 401,
        });
    }

    const isTokenValid = JwtService.isAcessTokenValid(token);
    if (!isTokenValid) {
        return res.status(401).json({
            message: "unauthorized",
            status: 401,
        });
    }

    const tokenRepository: TokenRepository = new TokenRepository();
    const acessTokenResult = await tokenRepository.findAccessToken(token);

    if (acessTokenResult?.revokedAt) {
        return res.status(401).json({
            message: "unauthorized",
            status: 401,
        });
    }

    next();
}