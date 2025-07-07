// filterConfig.js - Cấu hình bộ lọc cho từng category
export const filterConfigs = {
  // Category điện thoại
  'dien-thoai': {
    filters: [
      {
        key: 'price',
        type: 'priceRange',
        label: 'Mức giá',
        ranges: [
          { label: 'Dưới 2 triệu', value: [0, 2000000] },
          { label: 'Từ 2 - 4 triệu', value: [2000000, 4000000] },
          { label: 'Từ 4 - 7 triệu', value: [4000000, 7000000] },
          { label: 'Từ 7 - 13 triệu', value: [7000000, 13000000] },
          { label: 'Từ 13 - 20 triệu', value: [13000000, 20000000] },
          { label: 'Trên 20 triệu', value: [20000000, 100000000] },
        ],
      },
      {
        key: 'operatingSystem',
        type: 'checkbox',
        label: 'Hệ điều hành',
        options: ['iOS', 'Android'],
      },
      {
        key: 'ram',
        type: 'dynamic', // Lấy từ products
        label: 'Dung lượng RAM',
        extractPath: 'specifications.ram',
      },
      {
        key: 'storage',
        type: 'dynamic',
        label: 'Dung lượng ROM',
        extractPath: 'specifications.storage',
      },
      {
        key: 'connectivity',
        type: 'checkbox',
        label: 'Kết nối',
        options: ['NFC', 'Bluetooth', '5G', 'Wi-Fi 6'],
      },
    ],
  },

  // Category laptop
  laptop: {
    filters: [
      {
        key: 'price',
        type: 'priceRange',
        label: 'Mức giá',
        ranges: [
          { label: 'Dưới 10 triệu', value: [0, 10000000] },
          { label: 'Từ 10 - 15 triệu', value: [10000000, 15000000] },
          { label: 'Từ 15 - 20 triệu', value: [15000000, 20000000] },
          { label: 'Từ 20 - 30 triệu', value: [20000000, 30000000] },
          { label: 'Trên 30 triệu', value: [30000000, 100000000] },
        ],
      },
      {
        key: 'processor',
        type: 'dynamic',
        label: 'Bộ vi xử lý',
        extractPath: 'specifications.processor',
      },
      {
        key: 'ram',
        type: 'checkbox',
        label: 'Dung lượng RAM',
        options: ['8GB', '16GB', '32GB', '64GB'],
      },
      {
        key: 'storage',
        type: 'checkbox',
        label: 'Ổ cứng',
        options: ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD'],
      },
      {
        key: 'screenSize',
        type: 'dynamic',
        label: 'Kích thước màn hình',
        extractPath: 'specifications.screenSize',
      },
      {
        key: 'graphics',
        type: 'dynamic',
        label: 'Card đồ họa',
        extractPath: 'specifications.graphics',
      },
    ],
  },

  // Category tablet
  tablet: {
    filters: [
      {
        key: 'price',
        type: 'priceRange',
        label: 'Mức giá',
        ranges: [
          { label: 'Dưới 5 triệu', value: [0, 5000000] },
          { label: 'Từ 5 - 10 triệu', value: [5000000, 10000000] },
          { label: 'Từ 10 - 15 triệu', value: [10000000, 15000000] },
          { label: 'Trên 15 triệu', value: [15000000, 100000000] },
        ],
      },
      {
        key: 'operatingSystem',
        type: 'checkbox',
        label: 'Hệ điều hành',
        options: ['iPadOS', 'Android', 'Windows'],
      },
      {
        key: 'screenSize',
        type: 'checkbox',
        label: 'Kích thước màn hình',
        options: ['7-8 inch', '9-10 inch', '11-12 inch', 'Trên 12 inch'],
      },
      {
        key: 'storage',
        type: 'dynamic',
        label: 'Dung lượng lưu trữ',
        extractPath: 'specifications.storage',
      },
    ],
  },

  // Category đồng hồ thông minh
  'dong-ho-thong-minh': {
    filters: [
      {
        key: 'price',
        type: 'priceRange',
        label: 'Mức giá',
        ranges: [
          { label: 'Dưới 2 triệu', value: [0, 2000000] },
          { label: 'Từ 2 - 5 triệu', value: [2000000, 5000000] },
          { label: 'Từ 5 - 10 triệu', value: [5000000, 10000000] },
          { label: 'Trên 10 triệu', value: [10000000, 100000000] },
        ],
      },
      {
        key: 'compatibility',
        type: 'checkbox',
        label: 'Tương thích',
        options: ['iOS', 'Android', 'Universal'],
      },
      {
        key: 'features',
        type: 'checkbox',
        label: 'Tính năng',
        options: [
          'GPS',
          'Heart Rate',
          'Water Resistant',
          'Sleep Tracking',
          'Fitness Tracking',
        ],
      },
      {
        key: 'batteryLife',
        type: 'dynamic',
        label: 'Thời lượng pin',
        extractPath: 'specifications.batteryLife',
      },
    ],
  },

  // Category phụ kiện
  'phu-kien': {
    filters: [
      {
        key: 'price',
        type: 'priceRange',
        label: 'Mức giá',
        ranges: [
          { label: 'Dưới 200k', value: [0, 200000] },
          { label: 'Từ 200k - 500k', value: [200000, 500000] },
          { label: 'Từ 500k - 1 triệu', value: [500000, 1000000] },
          { label: 'Trên 1 triệu', value: [1000000, 10000000] },
        ],
      },
      {
        key: 'type',
        type: 'dynamic',
        label: 'Loại phụ kiện',
        extractPath: 'specifications.type',
      },
      {
        key: 'compatibility',
        type: 'dynamic',
        label: 'Tương thích',
        extractPath: 'specifications.compatibility',
      },
    ],
  },
};
export const getFilterConfig = (categorySlug) => {
  return filterConfigs[categorySlug] || filterConfigs['dien-thoai'];
};
