import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createUser(username: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO users (Username, password) VALUES (?, ?)',
      [username, hashed],
    );
    return { user_id: result.insertId, username };
  }

  async findByUsername(username: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT user_id, Username, password, refresh_token, created_at, updated_at FROM users WHERE Username = ?',
      [username],
    );
    return rows[0];
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT user_id, Username, created_at, updated_at FROM users WHERE user_id = ?',
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT user_id, Username, created_at, updated_at FROM users',
    );
    return rows;
  }

  async updateUser(id: number, partial: { username?: string; password?: string }) {
    await this.findById(id);

    const fields: string[] = [];
    const values: any[] = [];
    if (partial.username) {
      fields.push('Username = ?');
      values.push(partial.username);
    }
    if (partial.password) {
      const hashed = await bcrypt.hash(partial.password, 10);
      fields.push('password = ?');
      values.push(hashed);
    }
    if (fields.length === 0) return await this.findById(id);
    
    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  async deleteUser(id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM users WHERE user_id = ?', [id]);
    if (res.affectedRows === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { success: true };
  }

  async setRefreshToken(id: number, refreshToken: string | null) {
    await this.pool().execute('UPDATE users SET refresh_token = ? WHERE user_id = ?', [refreshToken, id]);
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT user_id, Username FROM users WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}