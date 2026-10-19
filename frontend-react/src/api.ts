import axios from 'axios';

const API_URL = 'https://toko-baju-app-nwfd.vercel.app/api/baju';

export interface Baju {
  id: number;
  nama_baju: string;
  kategori: string;
  harga: number;
  stok: number;
}

export const getBaju = () => axios.get<Baju[]>(API_URL);
export const createBaju = (data: any) => axios.post(API_URL, data);
export const updateBaju = (id: number, data: any) => axios.put(`${API_URL}/${id}`, data);
export const deleteBaju = (id: number) => axios.delete(`${API_URL}/${id}`);