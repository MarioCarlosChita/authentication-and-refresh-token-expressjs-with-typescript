

import { ResultSetHeader, RowDataPacket } from "mysql2";
import { database } from "../config/database";
import { CreateTask } from "../dto/create-task";
import { UpdateTask } from "../dto/update-task";
import { Task } from "../entity/task";
export interface ITaskRepository {
    create(createUser: CreateTask): Promise<boolean>;
    index(): Promise<Array<Task>>;
    update(update: UpdateTask, id: number): Promise<boolean>;
    show(id: number): Promise<Task | null>;
}


export class TaskRepository implements ITaskRepository {


    public async show(id: number): Promise<Task | null> {
        const [rows] = await database.execute<RowDataPacket[]>(`
          SELECT
            * 
          FROM task   
          WHERE id = ?
         ` , [id]);
        return rows[0] as Task;
    }
    public async update(updateTask: UpdateTask, id: number): Promise<boolean> {
        const fields: string[] = [];
        const values: (string | number)[] = [];

        if (updateTask.description !== undefined) {
            fields.push('description = ?');
            values.push(updateTask.description);
        }

        if (updateTask.title !== undefined) {
            fields.push('title = ?');
            values.push(updateTask.title);
        }
        const [result] = await database.execute<ResultSetHeader>(
            `UPDATE task SET ${fields.join(", ")} WHERE id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    public async create(createTask: CreateTask): Promise<boolean> {
        const [result] = await database.execute<ResultSetHeader>(`
          INSERT INTO task (title,description,userId)
          VALUES(?,?,?)
         `, [createTask.title, createTask.description, createTask.userId]);
        return result.affectedRows > 0;
    }

    public async index(): Promise<Task[]> {
        const [tasks] = await database.execute<RowDataPacket[]>(`
          SELECT
            * 
          FROM task
         `);
        return tasks as Array<Task>;

    }
}