import { ResultSetHeader, RowDataPacket } from "mysql2";
import { database } from "../config/database";
import { CreateUser } from "../dto/create-user";
import { User } from "../entity/user";


export interface IAuthRepository {
  createUser(createUser: CreateUser): Promise<boolean>;
  findUserByEmail(email: string): Promise<User | null>;
}

export class AuthRepository implements IAuthRepository {
  public async findUserByEmail(email: string): Promise<User | null> {
    const [result] = await database.execute<RowDataPacket[]>(`
          SELECT
            id,
            name,
            email,
            password,
            createdAt 
          FROM user 
          WHERE email = ? 
         `, [email]);
    return result[0] as User;
  }
  public async createUser(createUser: CreateUser): Promise<boolean> {
    const [result] = await database.execute<ResultSetHeader>(`
          INSERT INTO
          user (name,email,password)
          VALUES(?,?,?)
         `, [createUser.name, createUser.email, createUser.password]);
    return result.affectedRows > 0;
  }

}

