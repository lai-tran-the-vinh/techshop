import React from 'react';
import { HeartFilled } from '@ant-design/icons';
import { Row, Col, Typography, Flex, Divider, Layout, Image } from 'antd';

const { Title, Text, Link } = Typography;

const FooterComponent = () => {
  return (
    <Layout.Footer className="py-12! bg-[#090D14]! flex justify-center w-full! mt-20!">
      <div className="w-5/6">
        <Flex vertical className='border w-full! border-white! py-12!'>
          <Typography.Text className='text-white! text-lg! font-bold!'>Về hệ thống TechShop</Typography.Text>
          <Typography.Text className='text-white!'>
            Chúng tôi cam kết mang đến những sản phẩm và dịch vụ chất lượng cao
            nhất cho khách hàng với sự tận tâm và chuyên nghiệp.
          </Typography.Text>
        </Flex>
        <Divider className="border-gray-700 my-8" />

        {/* Copyright */}
        <Row
          justify="space-between"
          align="middle"
          className="text-gray-400 text-sm"
        >
          <Col
            xs={24}
            md={12}
            className="text-center md:text-left mb-4 md:mb-0"
          >
            <Text className="text-gray-400">
              © 2025 YourBrand. Tất cả quyền được bảo lưu.
            </Text>
          </Col>
          <Col xs={24} md={12} className="text-center md:text-right">
            <Text className="text-gray-400">
              Được phát triển với <HeartFilled className="text-red-500 mx-1" />{' '}
              tại Việt Nam
            </Text>
          </Col>
        </Row>
      </div>
    </Layout.Footer>
  );
};

export default FooterComponent;
