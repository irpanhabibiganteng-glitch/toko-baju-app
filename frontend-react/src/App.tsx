import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { getBaju, createBaju, updateBaju, deleteBaju } from './api';
import type { Baju } from './api';

function App() {
  const [listBaju, setListBaju] = useState<Baju[]>([]);
  const [form, setForm] = useState({ nama_baju: '', kategori: '', harga: '', stok: '' });
  const [editId, setEditId] = useState<number | null>(null);
  
  // State untuk menyimpan ID yang dicentang
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchBaju = async () => {
    try {
      const res = await getBaju();
      setListBaju(res.data);
      setSelectedIds([]); // Reset centang setiap kali data diambil
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => { 
    fetchBaju(); 
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateBaju(editId, form);
        setEditId(null);
      } else {
        await createBaju(form);
      }
      setForm({ nama_baju: '', kategori: '', harga: '', stok: '' });
      fetchBaju();
    } catch (error) {
      alert("Gagal menyimpan data. Pastikan backend menyala.");
    }
  };

  const handleEdit = (baju: Baju) => {
    setEditId(baju.id);
    setForm({ 
      nama_baju: baju.nama_baju, 
      kategori: baju.kategori, 
      harga: baju.harga.toString(), 
      stok: baju.stok.toString() 
    });
  };

  // Hapus Satu Data
  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus baju ini?')) return;
    try {
      await deleteBaju(id);
      fetchBaju();
    } catch (error) {
      alert("Gagal menghapus data.");
    }
  };

  // --- FITUR CHECKBOX & HAPUS MASSAL ---
  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(listBaju.map((baju) => baju.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Hapus Banyak Data Sekaligus
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Yakin ingin menghapus ${selectedIds.length} produk yang dipilih?`)) return;
    
    try {
      // Gunakan perulangan for...of agar jika satu gagal, yang lain tetap diproses
      for (const id of selectedIds) {
        await deleteBaju(id);
      }
      setSelectedIds([]);
      fetchBaju();
    } catch (error) {
      console.error("Gagal menghapus massal:", error);
      alert("Terjadi kesalahan saat menghapus. Cek console (F12).");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-['Inter'] text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Manajemen Produk</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola daftar stok dan harga baju Anda di sini.</p>
          </div>
          
          {/* Tombol Hapus Massal (Hanya muncul jika ada yang dicentang) */}
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm animate-pulse"
            >
              Hapus Terpilih ({selectedIds.length})
            </button>
          )}
        </header>
        
        {/* Form Input */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Baju</label>
              <input type="text" value={form.nama_baju} onChange={(e) => setForm({...form, nama_baju: e.target.value})} required className="w-full border border-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              <input type="text" value={form.kategori} onChange={(e) => setForm({...form, kategori: e.target.value})} required className="w-full border border-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Harga (Rp)</label>
              <input type="number" value={form.harga} onChange={(e) => setForm({...form, harga: e.target.value})} required className="w-full border border-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Stok</label>
              <input type="number" value={form.stok} onChange={(e) => setForm({...form, stok: e.target.value})} required className="w-full border border-slate-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" />
            </div>
            <div className="col-span-1">
              <button type="submit" className={`w-full text-white font-medium rounded-md py-2 text-sm transition-colors ${editId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {editId ? 'Simpan Perubahan' : 'Tambah Produk'}
              </button>
            </div>
          </form>
        </div>

        {/* Tabel Data */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {/* Kolom Checkbox Header */}
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={listBaju.length > 0 && selectedIds.length === listBaju.length}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-4 text-sm font-medium text-slate-500">ID</th>
                <th className="p-4 text-sm font-medium text-slate-500">Nama Baju</th>
                <th className="p-4 text-sm font-medium text-slate-500">Kategori</th>
                <th className="p-4 text-sm font-medium text-slate-500">Harga</th>
                <th className="p-4 text-sm font-medium text-slate-500">Stok</th>
                <th className="p-4 text-sm font-medium text-slate-500 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {listBaju.length === 0 && (
                <tr><td colSpan={7} className="text-center p-8 text-slate-400 text-sm">Belum ada data produk.</td></tr>
              )}
              {listBaju.map((baju) => (
                <tr key={baju.id} className={`transition-colors ${selectedIds.includes(baju.id) ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                  {/* Checkbox per baris */}
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(baju.id)}
                      onChange={() => handleSelectOne(baju.id)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="p-4 text-sm text-slate-500">{baju.id}</td>
                  <td className="p-4 text-sm font-medium text-slate-900">{baju.nama_baju}</td>
                  <td className="p-4 text-sm text-slate-600">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-medium">{baju.kategori}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-900">Rp {baju.harga.toLocaleString('id-ID')}</td>
                  <td className="p-4 text-sm text-slate-600">{baju.stok} Pcs</td>
                  <td className="p-4 text-sm text-right space-x-2">
                    <button onClick={() => handleEdit(baju)} className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Edit</button>
                    <button onClick={() => handleDelete(baju.id)} className="text-red-500 hover:text-red-700 font-medium transition-colors">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
}

export default App;