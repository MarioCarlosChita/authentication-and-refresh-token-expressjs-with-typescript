import { json } from 'body-parser';
import cors from "cors";
import express, { NextFunction, Request, Response } from 'express';
import { container } from './container/container';
import { taskRoutes } from './routers/task-router';
import { authRoutes } from './routers/auth-router';
import dotenv from "dotenv";
import { errorMiddleware } from './middleware/error-middleware';
import { userRoutes } from './routers/user-router';

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(json());
app.use(cors());

app.use('/api/v1/task', taskRoutes(container.controller.taskController));
app.use('/api/v1/user', userRoutes(container.controller.userController));
app.use('/api/v1/auth', authRoutes(container.controller.authController));

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/api/v1`);
})


