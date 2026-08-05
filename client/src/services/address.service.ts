import axios from 'axios';

class AddressServices {
  static async getAllProvinces() {
    try {
      const provinces = await axios.get('https://provinces.open-api.vn/api/p/');
      if (!provinces.data || provinces.data.length === 0) {
        throw new Error('Không lấy được danh sách tỉnh.');
      }
      return provinces.data;
    } catch (error) {
      throw error;
    }
  }

  static async getDistricts(code: number | string) {
    const districts = await axios.get('https://provinces.open-api.vn/api/d/');

    if (!districts.data) {
      throw new Error('Không tìm thấy danh sách huyện.');
    }

    const result = districts.data.filter(
      (district: any) => district.province_code === Number(code),
    );

    return result;
  }

  static async getWards(code: number | string) {
    const wards = await axios.get('https://provinces.open-api.vn/api/w/');

    if (!wards.data) {
      throw new Error('Không tìm thấy danh sách xã.');
    }

    const result = wards.data.filter((ward: any) => ward.district_code === Number(code));

    return result;
  }
}

export default AddressServices;
