import axios from 'axios';

async function getAllProvinces() {
  try {
    const provinces = await axios.get('/address-kit/2025-07-01/provinces');
    if (!provinces.data || !provinces.data.provinces) {
      throw new Error('Không lấy được danh sách tỉnh.');
    }
    return provinces.data.provinces;
  } catch (error) {
    throw error;
  }
}

export default getAllProvinces;
