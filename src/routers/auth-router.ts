import { Router } from "express";
import { AuthController } from "../controller/auth-controller";
import { authMiddleware } from "../middleware/auth-middleware";


export function authRoutes(
    authController: AuthController
): Router {
    const router = Router();
    router.post("/register", authController.register);
    router.post("/login", authController.login);
    router.post('/logout', authMiddleware, authController.logout);
    router.post('/refreshToken', authController.refreshToken);
    return router;
}