export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM baju ORDER BY id ASC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nama_baju, kategori, harga, stok } = await request.json();
    if (!nama_baju) return NextResponse.json({ error: 'Nama baju wajib diisi' }, { status: 400 });

    // --- KODE RESET ID OTOMATIS DIMULAI DI SINI ---
    const [rows]: any = await pool.query('SELECT COUNT(*) as count FROM baju');
    if (rows[0].count === 0) {
      await pool.query('ALTER TABLE baju AUTO_INCREMENT = 1');
    }
    // --- KODE RESET ID OTOMATIS SELESAI ---
    
    const [result]: any = await pool.query(
      'INSERT INTO baju (nama_baju, kategori, harga, stok) VALUES (?, ?, ?, ?)',
      [nama_baju, kategori, parseInt(harga), parseInt(stok)]
    );
    return NextResponse.json({ id: result.insertId, nama_baju, kategori, harga, stok }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambah data' }, { status: 500 });
  }
}