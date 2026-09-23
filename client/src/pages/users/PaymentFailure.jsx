import { Link, Navigate, useLocation } from 'react-router-dom';
import { Flex, Typography, Button } from 'antd';
import { BsFillXCircleFill } from 'react-icons/bs';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/contexts';
import Recomment from '@/services/recommend';
import { PreviewListProducts } from '@components/products';

function PaymentFailure() {
  const { Title, Text } = Typography;
  const location = useLocation();
  const { user } = useAppContext();
  const [recommentProducts, setRecommentProducts] = useState([]);

  // Chặn người dùng tự gõ URL truy cập trực tiếp vào trang
  if (!location.search) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (user) {
          const res = await Recomment.getRecommendationsByUser(user._id);
          setRecommentProducts(res);
        } else {
          const res = await Recomment.getRecommendationsPopular();
          setRecommentProducts(res);
        }
      } catch (error) {
        console.error('Lỗi lấy gợi ý:', error);
      }
    };
    fetchRecommendations();
  }, [user]);

  return (
    <div className="bg-[#f5f5f5]! lg:mt-10! w-full! max-w-[1200px] mx-auto">
      <div className="bg-white rounded-none lg:rounded-xl p-20 lg:p-30! border-y lg:border border-gray-200! flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
        <div className="flex flex-col gap-5 text-center lg:text-left items-center lg:items-start order-2 lg:order-1">
          <Title
            level={1}
            className="font-semibold! mb-0! text-[20px]! lg:text-[32px]!"
          >
            Thanh toán thất bại
          </Title>
          <Text className="text-[#6b7280]! text-[14px] lg:text-base!">
            Rất tiếc vì chưa được phục vụ quý khách, xin hẹn gặp lại!
          </Text>
          <Link to="/" className="mt-2">
            <Button type="primary" className="rounded-full! h-40! w-150!">
              Quay về trang chủ
            </Button>
          </Link>
        </div>
        <div className="order-1 lg:order-2 lg:mr-50 flex justify-center w-full lg:w-auto">
          <BsFillXCircleFill size={150} className="text-primary!" />
        </div>
      </div>

      {recommentProducts.length > 0 && (
        <div className="mt-8 lg:mt-10 w-full mx-auto max-lg:bg-white max-lg:pb-32 lg:px-0">
          <PreviewListProducts
            title="Sản phẩm có thể bạn quan tâm"
            products={recommentProducts}
            viewAll={false}
            className="mt-4 sm:mt-8"
          />
        </div>
      )}
    </div>
  );
}

export default PaymentFailure;
