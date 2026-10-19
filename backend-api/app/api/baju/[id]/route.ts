import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// PUT: Update data
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { nama_baju, kategori, harga, stok } = await request.json();
    const [result]: any = await pool.query(
      'UPDATE baju SET nama_baju = ?, kategori = ?, harga = ?, stok = ? WHERE id = ?',
      [nama_baju, kategori, parseInt(harga), parseInt(stok), id]
    );
    if (result.affectedRows === 0) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
    return NextResponse.json({ id, nama_baju, kategori, harga, stok });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update' }, { status: 500 });
  }
}

// DELETE: Hapus data (Bisa satu per satu)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Pastikan tipe data ID adalah angka
    const [result]: any = await pool.query('DELETE FROM baju WHERE id = ?', [Number(id)]);
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Data tidak ditemukan di database' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Berhasil dihapus' });
  } catch (error) {
    console.error("Error saat menghapus:", error);
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 });
  }
}