import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { UserController } from "../controller/user-controller";



export function userRoutes(
    userController: UserController
): Router {
    const router = Router();
    router.get('/:id', authMiddleware, userController.show);
    return router;
}