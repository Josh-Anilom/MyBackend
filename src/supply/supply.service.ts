import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class SupplyService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  
  async create(data: {
    supply_name: string;
    country: string;
    region: string;
    city: string;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO supply (supply_name, country, region, city) VALUES (?, ?, ?, ?)',
      [data.supply_name, data.country, data.region, data.city],
    );
    return { supply_id: result.insertId, ...data };
  }

  
  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT supply_id, supply_name, country, region, city FROM supply WHERE supply_id = ?',
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Supply with ID ${id} not found`);
    }
    return rows[0];
  }

  
  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM supply',
    );
    return rows;
  }

  
  async update(
    id: number,
    partial: {
      supply_name?: string;
      country?: string;
      region?: string;
      city?: string;
    },
  ) {
    
    await this.findById(id);

    const fields: string[] = [];
    const values: any[] = [];

    if (partial.supply_name !== undefined) {
      fields.push('supply_name = ?');
      values.push(partial.supply_name);
    }
    if (partial.country !== undefined) {
      fields.push('country = ?');
      values.push(partial.country);
    }
    if (partial.region !== undefined) {
      fields.push('region = ?');
      values.push(partial.region);
    }
    if (partial.city !== undefined) {
      fields.push('city = ?');
      values.push(partial.city);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE supply SET ${fields.join(', ')} WHERE supply_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  
  async delete(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM supply WHERE supply_id = ?',
      [id],
    );
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Supply with ID ${id} not found`);
    }
    return { success: true };
  }
}