import { Request, Response } from "express";
import { CreateTask } from "../dto/create-task";
import { TaskRepository } from "../repository/task-repository";
import { UpdateTask } from "../dto/update-task";
import { createTaskSchema, updateTaskSchema } from "../validator/task-validator";


export class TaskController {

    constructor(private readonly taskRepository: TaskRepository) { }

    public show = async (
        req: Request,
        res: Response
    ) => {
        try {
            const id = Number(req.params.id);
            const result = await this.taskRepository.show(id);
            if (result == null) {
                res.status(404).json({
                    status: 404,
                    message: 'Task not found'
                })
            } else {
                res.status(200).json({
                    task: result,
                    status: 200,
                    message: 'success'
                });
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

    public update = async (
        req: Request,
        res: Response
    ) => {
        try {
            const id = Number(req.params.id);
            const { error, value } = updateTaskSchema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                res.status(400).json({
                    message: "Validation error",
                    errors: error.details.map((detail) => detail.message),
                });
            }
            const updateTask: UpdateTask = {
                title: value.title,
                description: value.description,
            }
            const result = await this.taskRepository.update(updateTask, id);
            return res.status(200).json({
                message: 'Task updated',
                status: 200
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


    public list = async (
        req: Request,
        res: Response
    ) => {
        try {
            const tasks = await this.taskRepository.index();
            return res.status(200).json({
                tasks: tasks,
                message: 'success',
                status: 200
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

    public create = async (
        req: Request,
        res: Response
    ) => {

        const { error, value } = createTaskSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.details.map((detail) => detail.message),
            });
        }
        try {
            const createTask: CreateTask = {
                title: value.title,
                description: value.description,
                userId: value.userId,
            };
            await this.taskRepository.create(createTask);
            return res.status(201).json({
                data: createTask,
                message: 'Task Created',
                status: 201,
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

