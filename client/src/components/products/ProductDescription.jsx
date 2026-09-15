import { useRef, useState, useEffect } from 'react';
import { Typography, Button } from 'antd';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

function ProductDescription({ className, product = {}, loading = false }) {
  const descriptionRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    if (descriptionRef.current && product.description) {
      // Kiểm tra nội dung có dài hơn 200px không
      setIsOverflow(descriptionRef.current.scrollHeight > 200);
    }
  }, [product.description]);

  return (
    <div className={`bg-white 0 p-6 ${className || ''}`}>
      <div className="flex items-center mb-6">
        <Typography.Title
          level={3}
          className="mb-0 text-gray-800 font-semibold"
          style={{ margin: 0 }}
        >
          {loading ? (
            <div className="w-64">
              <Skeleton height={32} />
            </div>
          ) : (
            'Mô tả sản phẩm'
          )}
        </Typography.Title>
      </div>

      {/* Content */}
      <div className="relative">
        {loading ? (
          <div className="space-y-3">
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} width="80%" />
          </div>
        ) : product.description ? (
          <>
            <div className="relative">
              <div
                ref={descriptionRef}
                dangerouslySetInnerHTML={{ __html: product.description }}
                className={`
                  text-gray-700  
                  transition-all duration-500 ease-in-out
                  ${expanded ? '' : 'overflow-hidden'}
                `}
                style={{
                  maxHeight: expanded ? 'none' : '200px',
                }}
              />

              {/* Gradient overlay khi collapsed */}
              {isOverflow && !expanded && (
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
              )}
            </div>

            {isOverflow && (
              <div className={`flex justify-center ${expanded ? 'mt-6' : '-mt-6 relative z-10'}`}>
                <Button
                  onClick={() => setExpanded(!expanded)}
                  className="
                    bg-white! border! border-gray-300! text-gray-700!
                    hover:border-primary! hover:text-primary! hover:bg-white!
                    font-medium! px-10! py-2! h-[40px]!
                    rounded-full! transition-colors! duration-300!
                    flex! items-center! justify-center! gap-2!
                  "
                >
                  {expanded ? (
                    <>
                      Thu gọn
                      <UpOutlined className="text-[12px]" />
                    </>
                  ) : (
                    <>
                      Xem thêm
                      <DownOutlined className="text-[12px]" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 flex flex-col items-center justify-center">
            <img src="/describe.svg" alt="No description" className="w-180 h-180 mb-4 object-contain opacity-80" />
            <p className="text-black font-medium">Sản phẩm chưa có mô tả</p>
            <p className="text-black text-sm mt-1">
              Thông tin mô tả sẽ được cập nhật sớm
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export default ProductDescription;
