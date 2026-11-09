
import { RowDataPacket } from "mysql2";
import { database } from "../config/database";
import { User } from "../entity/user";

export interface IUserRepository {
  show(id: number): Promise<User | null>;
}


export class UserRepository implements IUserRepository {

  public async show(id: number): Promise<User | null> {
    const [result] = await database.execute<RowDataPacket[]>(`
          SELECT
            id,
            name,
            email,
            password,
            createdAt
          FROM user 
          WHERE id = ? 
        `, [id]);
    return result[0] as User
  }
}