import { Router } from "express";
import { TaskController } from "../controller/task-controller";
import { authMiddleware } from "../middleware/auth-middleware";

export function taskRoutes(
    taskController: TaskController
): Router {
    const router = Router();
    router.post("/", authMiddleware, taskController.create);
    router.get("/", authMiddleware, taskController.list);
    router.get("/:id", authMiddleware, taskController.show);
    router.put("/:id", authMiddleware, taskController.update);


    return router;
}