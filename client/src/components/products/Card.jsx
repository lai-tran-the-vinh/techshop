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
  Flex,
  Tooltip,
} from 'antd';
import { callFetchStats } from '@/services/apis';
import { useEffect, useState } from 'react';
import { formatCurrency } from '@/helpers';

function CardProduct({ product = {}, className, loading = false }) {
  const [stats, setStats] = useState({});

  const fetchStats = async () => {
    try {
      const res = await callFetchStats(product._id);
      setStats(res.data.data.data);
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
    <Link to={`/product/${product._id}`}>
      <Card
        styles={{ body: { padding: '12px', flex: 1, display: 'flex', flexDirection: 'column' } }}
        cover={
          <div className="flex items-center justify-center pt-4 sm:pt-6">
            <Image
              preview={false}
              alt="Product Image"
              className="object-contain! aspect-square! mx-auto! w-[80%]! sm:w-[70%]! border-none! transition-all! duration-300! ease-in-out! group-hover:scale-110!"
              src={
                product?.variants?.[0]?.color?.[0]?.images?.[0] ||
                'https://cdn.tgdd.vn/Products/Images/42/329138/iphone-16-plus-hong-thumb-1-600x600.jpg'
              }
            />
          </div>
        }
        className={`group ${className} rounded-xl! h-full! overflow-hidden! border-none! hover:shadow-md! flex flex-col`}
      >
        <Tooltip title={product?.name}>
          <Typography.Text className="text-xs sm:text-base! line-clamp-2 sm:line-clamp-1! font-medium!">
            {product.name || 'Sản phẩm mới'}
          </Typography.Text>
        </Tooltip>
        <div className="mt-3 sm:mt-6">
          <div className="flex flex-col items-start gap-1 sm:gap-4">
            <Flex gap={2} sm:gap={8} align="center" className="flex-nowrap">
              <Typography.Text
                delete
                type="secondary"
                className="text-[10px] sm:text-sm! font-inter! truncate"
              >
                {`${formatCurrency(product?.variants?.[0]?.price)}đ` || ''}
              </Typography.Text>
              <Typography.Text className="font-medium! text-primary! text-[10px] sm:text-sm! whitespace-nowrap">
                -{product.discount}%
              </Typography.Text>
            </Flex>
            <Typography.Text className="text-sm sm:text-base! font-bold! font-inter!">
              {`${formatCurrency(product?.variants?.[0]?.price - product?.variants?.[0]?.price * (product?.discount / 100))}đ` ||
                'Liên hệ'}
            </Typography.Text>
            <div className="flex items-center gap-1 sm:gap-8">
              <Typography.Text className="text-xs sm:text-sm! mb-0 sm:mb-10 font-inter! text-[#059669]!">
                Giảm{' '}
                {`${formatCurrency(product?.variants?.[0]?.price - (product?.variants?.[0]?.price - product?.variants?.[0]?.price * (product?.discount / 100)))}đ`}
              </Typography.Text>
            </div>
          </div>
        </div>
        <div className="flex flex-nowrap items-center gap-1 sm:gap-8 mt-auto pt-2">
          <Rate
            disabled
            value={stats?.averageRating ? stats?.averageRating : 5}
            className="text-[10px]! sm:text-base! [&_.ant-rate-star]:text-[10px]! sm:[&_.ant-rate-star]:text-base! [&_.ant-rate-star]:mr-[2px]! sm:[&_.ant-rate-star]:mr-2!"
          />
          <Typography.Text type="secondary" className="text-[10px] sm:text-sm!">
            ({stats?.totalComments})
          </Typography.Text>
        </div>
      </Card>
    </Link>
  );
}

export default CardProduct;
