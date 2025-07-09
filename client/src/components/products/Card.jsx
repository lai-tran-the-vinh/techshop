import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  Badge,
  Button,
  Space,
  Typography,
  Divider,
  Image,
  Rate,
} from 'antd';
import { callFetchStats } from '@/services/apis';
import { useEffect, useState } from 'react';

function CardProduct({ product = {}, className, loading = false }) {
  const [stats, setStats] = useState({});
  function formatCurrency(amount, locale = 'vi-VN', currency = 'VND') {
    return new Intl.NumberFormat(locale, {
      style: 'decimal', // hoặc 'currency' nếu bạn muốn hiển thị ký hiệu tiền tệ
      // currency: currency, // Chỉ dùng nếu style là 'currency'
      minimumFractionDigits: 0, // Đảm bảo không có số lẻ sau dấu phẩy
      maximumFractionDigits: 0, // Đảm bảo không có số lẻ sau dấu phẩy
    }).format(amount);
  }

  const fetchStats = async () => {
    try {
      const res = await callFetchStats(product._id);
      setStats(res.data.data.data);
      console.log('stats', res.data.data.data.averageRating);
    } catch (error) {
      console.error('Đã có lỗi xảy ra:', error);
    }
  };
  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <Link to={`/product/${product._id}`} className="w-full! ">
      <Card
        cover={
          <div className="overflow-hidden">
            <Image
              preview={false}
              alt="Product Image"
              className="object-fill! aspect-square! mx-auto! mt-20! w-[70%]! border-none! transition-all! duration-300! ease-in-out! group-hover:scale-110!"
              src={
                product?.variants?.[0]?.images?.[0] ||
                'https://cdn.tgdd.vn/Products/Images/42/329138/iphone-16-plus-hong-thumb-1-600x600.jpg'
              }
            />
          </div>
        }
        className={`group ${className} rounded-lg! overflow-hidden! border-none! hover:shadow-sm!`}
      >
        <Divider className="my-0! mb-10!" />
        <Typography.Title
          level={4}
          className="line-clamp-1! mb-10! font-roboto!  leading-1.4! "
        >
          {product.name || 'Sản phẩm mới'}
        </Typography.Title>
        <div className="flex items-center mb-3">
          <Rate
            disabled
            value={stats?.averageRating ? stats?.averageRating : 5}
            className="text-sm!"
          />
          <Typography.Text type="secondary">
            ({stats?.totalComments})
          </Typography.Text>
        </div>
        <div className="mb-10">
          <div className="flex flex-col items-start gap-1">
            <Typography.Text
              delete
              type="secondary"
              className="text-sm! font-roboto!"
            >
              {`${formatCurrency(product?.variants?.[0]?.price)}đ` || ''}
            </Typography.Text>
            <Typography.Text className="text-xl! font-bold! font-roboto! text-[#d32f2f]!">
              {`${formatCurrency(product?.variants?.[0]?.price - product?.variants?.[0]?.price * (product?.discount / 100))}đ` ||
                'Liên hệ'}
            </Typography.Text>
            <div className="flex items-center gap-8">
              <Typography.Text className="text-xs! mb-10 font-roboto! text-[#52c41a]!">
                Giảm{' '}
                {`${formatCurrency(product?.variants?.[0]?.price - (product?.variants?.[0]?.price - product?.variants?.[0]?.price * (product?.discount / 100)))}đ`}
              </Typography.Text>
            </div>
          </div>
        </div>
        {/* 
          <div className="mb-10">
            <Space direction="vertical" size={4}>
              <div className="flex items-center gap-8">
                <Typography.Text className="text-xs! mb-10 font-roboto! text-[#52c41a]!">
                  Miễn phí vận chuyển
                </Typography.Text>
              </div>
              <div className="flex items-center gap-8">
                <Typography.Text className="text-xs! font-roboto! text-[#1890ff]!">
                  Trả góp 0% qua thẻ tín dụng
                </Typography.Text>
              </div>
            </Space>
          </div> */}
      </Card>
    </Link>
  );
}

export default CardProduct;
