import { Request, Response } from "express";
import { AuthRepository } from "../repository/auth-repository";
import { createUserSchema } from "../validator/user-validator";
import { PasswordService } from "../services/password-service";
import { CreateUser } from "../dto/create-user";
import { credentialSchema } from "../validator/credential-validator";
import { JwtService } from "../services/jwt-service";
import { CreateToken } from "../dto/create-token";
import { TokenRepository } from "../repository/token-repository";
import { createRevokeToken } from "../dto/create-revoke-token";
import { refreshTokenSchema } from "../validator/refresh-token.validator";


export class AuthController {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly tokenRepository: TokenRepository
    ) { }

    public login = async (
        req: Request,
        res: Response
    ) => {
        try {
            const { error, value } = credentialSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }

            const user = await this.authRepository.findUserByEmail(value.email);
            if (!user) {
                return res.status(400).json({
                    message: 'Invalid credential',
                    status: 400,
                })
            }

            const verifyPassword = await PasswordService.comparePassword(value.password, user.password);

            if (!verifyPassword) {
                return res.status(400).json({
                    message: 'Invalid credential',
                    status: 400,
                });
            }

            const accessToken = JwtService.generateAccessToken({ id: user.id });
            const refreshToken = JwtService.generateRefreshToken({ id: user.id });

            const userData = {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            }

            const personalAccessToken: CreateToken = {
                accessToken: accessToken,
                refreshToken: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000)
            };

            await this.tokenRepository.createToken(personalAccessToken);

            return res.status(200).json(
                {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    user: userData,
                    status: 200,
                }
            );

        } catch (error) {
            return res.status(500).json(
                {
                    message: 'Internal server error',
                    status: 500
                }

            );
        }
    }
    public register = async (
        req: Request,
        res: Response
    ) => {
        try {
            const { error, value } = createUserSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                res.status(400).json({
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }

            const findUserByEmail = await this.authRepository.findUserByEmail(
                value.email
            );

            if (findUserByEmail) {
                return res.status(400).json({
                    message: 'This user already exist!',
                    status: 400,
                })
            } else {
                const createUser: CreateUser = {
                    name: value.name,
                    email: value.email,
                    password: await PasswordService.encryptpass(value.password)
                };

                await this.authRepository.createUser(createUser);
                return res.status(200).json(
                    {
                        user: {
                            name: createUser.name,
                            email: createUser.email,
                            createdAt: new Date()
                        },
                        message: 'User created'
                    }
                )
            }

        } catch (error) {
            return res.status(500).json(
                {
                    message: 'Internal server error',
                    status: 500
                }

            );
        }
    }

    public logout = async (
        req: Request,
        res: Response
    ) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const revokeToken: createRevokeToken = {
                token: token!,
                revokedAt: new Date()
            }
            await this.tokenRepository.revokeUserByToken(revokeToken);

            return res.status(200).json({
                message: "Logout Successfully",
                status: 200
            }
            );

        } catch (error) {
            return res.status(500).json(
                {
                    message: 'Internal server error',
                    status: 500
                }

            );
        }
    }

    public refreshToken = async (
        req: Request,
        res: Response
    ) => {
        try {
            const { error, value } = refreshTokenSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                res.status(400).json({
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }

            const isRefreshTokenValid = await JwtService.isRefreshTokenValid(value.refreshToken);

            if (!isRefreshTokenValid) {
                return res.status(401).json(
                    {
                        message: "unauthorized",
                        status: 401,
                    }
                );
            }

            const refreshTokenData = await this.tokenRepository.findRefreshToken(value.refreshToken);

            if (refreshTokenData?.revokedAt) {
                return res.status(401).json(
                    {
                        message: "unauthorized",
                        status: 401,
                    }
                );
            }

            const newAccessToken = JwtService.generateAccessToken({ id: refreshTokenData?.userId });

            const personalAccessToken: CreateToken = {
                accessToken: newAccessToken,
                refreshToken: value.refreshToken,
                userId: refreshTokenData!.userId,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000)
            };

            await this.tokenRepository.createToken(personalAccessToken);

            return res.status(200).json({
                accessToken: newAccessToken,
                status: 200,
            });

        } catch (error) {
            return res.status(500).json(
                {
                    message: 'Internal server error',
                    status: 500
                }

            );
        }
    }
}