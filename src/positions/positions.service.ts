import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class PositionsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async create(data: { position_code: string; position_name: string }) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO positions (position_code, position_name) VALUES (?, ?)',
      [data.position_code, data.position_name],
    );
    return { id: result.insertId, ...data };
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, position_code, position_name, created_at FROM positions WHERE id = ?',
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM positions',
    );
    return rows;
  }

  async update(
    id: number,
    partial: { position_code?: string; position_name?: string },
  ) {
    await this.findById(id);

    const fields: string[] = [];
    const values: any[] = [];

    if (partial.position_code !== undefined) {
      fields.push('position_code = ?');
      values.push(partial.position_code);
    }
    if (partial.position_name !== undefined) {
      fields.push('position_name = ?');
      values.push(partial.position_name);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE positions SET ${fields.join(', ')} WHERE id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  async delete(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM positions WHERE id = ?',
      [id],
    );
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return { success: true };
  }
}