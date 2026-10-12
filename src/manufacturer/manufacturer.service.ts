import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class ManufacturerService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();


  async create(data: {
    manufacturer_name: string;
    code_id: string;
    country: string;
    region: string;
    city: string;
    supply_id?: number;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO manufacturer (manufacturer_name, code_id, country, region, city, supply_id) VALUES (?, ?, ?, ?, ?, ?)',
      [
        data.manufacturer_name,
        data.code_id,
        data.country,
        data.region,
        data.city,
        data.supply_id ?? null,
      ],
    );
    return { manufacturer_id: result.insertId, ...data };
  }


  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT manufacturer_id, manufacturer_name, code_id, country, region, city, supply_id, created_at, updated_at FROM manufacturer WHERE manufacturer_id = ?',
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Manufacturer with ID ${id} not found`);
    }
    return rows[0];
  }


  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM manufacturer',
    );
    return rows;
  }

 
  async update(
    id: number,
    partial: {
      manufacturer_name?: string;
      code_id?: string;
      country?: string;
      region?: string;
      city?: string;
      supply_id?: number;
    },
  ) {

    await this.findById(id);

    const fields: string[] = [];
    const values: any[] = [];

    if (partial.manufacturer_name !== undefined) {
      fields.push('manufacturer_name = ?');
      values.push(partial.manufacturer_name);
    }
    if (partial.code_id !== undefined) {
      fields.push('code_id = ?');
      values.push(partial.code_id);
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
    if (partial.supply_id !== undefined) {
      fields.push('supply_id = ?');
      values.push(partial.supply_id);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE manufacturer SET ${fields.join(', ')} WHERE manufacturer_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  // Delete a manufacturer
  async delete(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM manufacturer WHERE manufacturer_id = ?',
      [id],
    );
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Manufacturer with ID ${id} not found`);
    }
    return { success: true };
  }
}