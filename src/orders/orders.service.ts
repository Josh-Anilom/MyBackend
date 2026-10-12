import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class OrdersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async create(data: {
    user_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO orders (user_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
      [data.user_id, data.product_id, data.quantity, data.unit_price],
    );
    return { order_id: result.insertId, ...data };
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_id, user_id, product_id, quantity, unit_price, created_at, updated_at FROM orders WHERE order_id = ?',
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM orders',
    );
    return rows;
  }

  async update(
    id: number,
    partial: {
      user_id?: number;
      product_id?: number;
      quantity?: number;
      unit_price?: number;
    },
  ) {
   
    await this.findById(id);

    const fields: string[] = [];
    const values: any[] = [];

    if (partial.user_id !== undefined) {
      fields.push('user_id = ?');
      values.push(partial.user_id);
    }
    if (partial.product_id !== undefined) {
      fields.push('product_id = ?');
      values.push(partial.product_id);
    }
    if (partial.quantity !== undefined) {
      fields.push('quantity = ?');
      values.push(partial.quantity);
    }
    if (partial.unit_price !== undefined) {
      fields.push('unit_price = ?');
      values.push(partial.unit_price);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE orders SET ${fields.join(', ')} WHERE order_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  async delete(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM orders WHERE order_id = ?',
      [id],
    );
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return { success: true };
  }
}