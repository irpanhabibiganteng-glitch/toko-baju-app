import axios from 'axios';

const API_URL = 'http://localhost:3000/api/baju'; 

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