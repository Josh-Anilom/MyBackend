import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class ProductService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();


  async create(data: {
    product_name: string;
    product_category: string;
    product_price: number;
    stock_quantity: number;
    manufacturer_id?: number;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO product (product_name, product_category, product_price, stock_quantity, manufacturer_id) VALUES (?, ?, ?, ?, ?)',
      [
        data.product_name,
        data.product_category,
        data.product_price,
        data.stock_quantity,
        data.manufacturer_id ?? null,
      ],
    );
    return { product_id: result.insertId, ...data };
  }

  
  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT product_id, product_name, product_category, product_price, stock_quantity, manufacturer_id, created_at, updated_at FROM product WHERE product_id = ?',
      [id],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return rows[0];
  }

  
  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT * FROM product',
    );
    return rows;
  }

  
  async update(
    id: number,
    partial: {
      product_name?: string;
      product_category?: string;
      product_price?: number;
      stock_quantity?: number;
      manufacturer_id?: number;
    },
  ) {

    await this.findById(id);

    const fields: string[] = [];
    const values: any[] = [];

    if (partial.product_name !== undefined) {
      fields.push('product_name = ?');
      values.push(partial.product_name);
    }
    if (partial.product_category !== undefined) {
      fields.push('product_category = ?');
      values.push(partial.product_category);
    }
    if (partial.product_price !== undefined) {
      fields.push('product_price = ?');
      values.push(partial.product_price);
    }
    if (partial.stock_quantity !== undefined) {
      fields.push('stock_quantity = ?');
      values.push(partial.stock_quantity);
    }
    if (partial.manufacturer_id !== undefined) {
      fields.push('manufacturer_id = ?');
      values.push(partial.manufacturer_id);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE product SET ${fields.join(', ')} WHERE product_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  async delete(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM product WHERE product_id = ?',
      [id],
    );
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return { success: true };
  }
}