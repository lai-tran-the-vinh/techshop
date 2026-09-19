import axios from 'axios';

async function getCommunes(code) {
  const communes = await axios.get(`/address-kit/2025-07-01/provinces/${code}/communes`);

  if (!communes.data || !communes.data.communes) {
    throw new Error('Không tìm thấy danh sách đơn vị hành chính.');
  }

  return communes.data.communes;
}

export default getCommunes;
