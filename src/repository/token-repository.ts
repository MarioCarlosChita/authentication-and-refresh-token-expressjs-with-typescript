import { ResultSetHeader, RowDataPacket } from "mysql2";
import { database } from "../config/database";
import { createRevokeToken } from "../dto/create-revoke-token";
import { CreateToken } from "../dto/create-token";
import { Token } from "../entity/token";

export interface ITokenReposiory {
  createToken(createToken: CreateToken): Promise<boolean>;
  revokeUserByToken(createRevokeToken: createRevokeToken): Promise<boolean>;
  findAccessToken(token: string): Promise<Token | null>;
  findRefreshToken(refreshToken: string): Promise<Token | null>;
}

export class TokenRepository implements ITokenReposiory {
  public async findRefreshToken(refreshToken: string): Promise<Token | null> {
    const [result] = await database.execute<RowDataPacket[]>(`
          SELECT
            id,
            accessToken,
            refreshToken,
            userId,
            expiresAt,
            revokedAt,
            createdAt
          FROM personal_access_token
          WHERE refreshToken = ?
      `, [refreshToken]);

    return result[0] as Token;
  }
  public async createToken(createToken: CreateToken): Promise<boolean> {
    const [result] = await database.execute<ResultSetHeader>(`
          INSERT INTO
          personal_access_token (accessToken,refreshToken,userId,expiresAt)
          VALUES(?,?,?,?)
          `, [createToken.accessToken, createToken.refreshToken, createToken.userId, createToken.expiresAt]);

    return result.affectedRows > 0;
  }

  public async revokeUserByToken(createRevokeToken: createRevokeToken): Promise<boolean> {
    const [result] = await database.execute<ResultSetHeader>(`
          UPDATE personal_access_token 
          SET revokedAt = ? 
          WHERE accessToken =?
      `, [createRevokeToken.revokedAt, createRevokeToken.token]);

    return result.affectedRows > 0;
  }

  public async findAccessToken(token: string): Promise<Token | null> {
    const [result] = await database.execute<RowDataPacket[]>(`
          SELECT
            id,
            accessToken,
            refreshToken,
            userId,
            expiresAt,
            revokedAt,
            createdAt
          FROM personal_access_token
          WHERE accessToken = ?
      `, [token]);

    return result[0] as Token;
  }
}

