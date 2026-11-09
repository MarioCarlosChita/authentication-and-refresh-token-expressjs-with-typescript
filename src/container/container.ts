import { AuthController } from "../controller/auth-controller";
import { TaskController } from "../controller/task-controller";
import { UserController } from "../controller/user-controller";
import { AuthRepository } from "../repository/auth-repository";

import { TaskRepository } from "../repository/task-repository";
import { TokenRepository } from "../repository/token-repository";
import { UserRepository } from "../repository/user-repository";

// task
const taskRepository: TaskRepository = new TaskRepository();
const taskController: TaskController = new TaskController(taskRepository);

//user
const userRepository: UserRepository = new UserRepository();
const userController: UserController = new UserController(userRepository);

// access token 
const personalAccessTokenRepository: TokenRepository = new TokenRepository();

// auth
const authRepository: AuthRepository = new AuthRepository();
const authController: AuthController = new AuthController(authRepository, personalAccessTokenRepository);


export const container = {
    controller: {
        taskController,
        userController,
        authController
    }
}