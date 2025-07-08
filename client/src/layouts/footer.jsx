import React from 'react';
import { HeartFilled } from '@ant-design/icons';
import { Row, Col, Typography, Flex, Divider, Layout, Image } from 'antd';

const { Title, Text, Link } = Typography;

const FooterComponent = () => {
  return (
    <Layout.Footer className="py-12! px-0! bg-[#090D14]! flex! justify-center! w-full! mt-20!">
      <div className="w-5/6">
        <Flex vertical gap={6} className="w-full! py-12!">
          <Typography.Text className="text-white! text-lg! font-medium!">
            Về hệ thống TechShop
          </Typography.Text>
          <Typography.Text className="text-[#ffffffb2]!">
            Chúng tôi cam kết mang đến những sản phẩm và dịch vụ chất lượng cao
            nhất cho khách hàng với sự tận tâm và chuyên nghiệp.
          </Typography.Text>
        </Flex>
        <Divider className="border-gray-700! my-8!" />
        <Flex vertical gap={12} className="w-full! py-12!">
          <Flex vertical gap={8} justify="center" className="w-1/4!">
            <Typography.Text className="text-white! uppercase! text-lg! font-medium!">
              Kết nối với TechShop
            </Typography.Text>
            <Flex gap={16} justify="start">
              <Image
                preview={false}
                src="https://cdn2.fptshop.com.vn/svg/facebook_icon_8543190720.svg"
              />
              <Image
                preview={false}
                src="https://cdn2.fptshop.com.vn/svg/zalo_icon_8cbef61812.svg"
              />
              <Image
                preview={false}
                src="https://cdn2.fptshop.com.vn/svg/youtube_icon_b492d61ba5.svg"
              />
              <Image
                preview={false}
                src="https://cdn2.fptshop.com.vn/svg/tiktok_icon_faabbeeb61.svg"
              />
            </Flex>
          </Flex>
          <Flex vertical gap={8} className='mt-8!'>
            <Typography.Text className="text-white! uppercase! text-base! font-medium!">
              Tổng đài miễn phí
            </Typography.Text>
            <Flex vertical>
              <Typography.Text className="text-white! text-base!">
                Tư vấn mua hàng (Miễn phí)
              </Typography.Text>
              <Flex align='center' gap={4}>
                <Typography.Text className='text-white! text-base! font-medium!'>1800.6601</Typography.Text>
                <Typography.Text className='text-white!'>(Nhánh 1)</Typography.Text>
              </Flex>
            </Flex>
            <Flex vertical>
              <Typography.Text className="text-white! text-base!">
                Hỗ trợ kỹ thuật
              </Typography.Text>
              <Flex align='center' gap={4}>
                <Typography.Text className='text-white! text-base! font-medium!'>1800.6601</Typography.Text>
                <Typography.Text className='text-white!'>(Nhánh 2)</Typography.Text>
              </Flex>
            </Flex>
            <Flex vertical>
              <Typography.Text className="text-white! text-base!">
                Góp ý, khiếu nại
              </Typography.Text>
              <Flex align='center' gap={4}>
                <Typography.Text className='text-white! text-base! font-medium!'>1800.6601</Typography.Text>
                <Typography.Text className='text-white!'>(8h00 - 22h00)</Typography.Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </div>
    </Layout.Footer>
  );
};

export default FooterComponent;
