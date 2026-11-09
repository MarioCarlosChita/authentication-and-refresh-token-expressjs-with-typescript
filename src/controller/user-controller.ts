import { Request, Response } from "express";
import { UserRepository } from "../repository/user-repository";

export class UserController {

    constructor(private userRepository: UserRepository) { }

    public show = async (
        req: Request,
        res: Response
    ) => {
        try {
            const userId = Number(req.params.id);
            const user = await this.userRepository.show(userId);

            if (!user) {
                return res.status(404).json({
                    message: 'user not found',
                    status: 404,
                });
            }

            return res.status(200).json({
                user: {
                    name: user.name,
                    email: user.email,
                    createAt: user.createdAt,
                },
                message: 'success',
                status: 200,
            })
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