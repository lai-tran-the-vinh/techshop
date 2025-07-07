import React from 'react';
import { Row, Col, Typography, Space, Divider, Layout } from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  HeartFilled,
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const FooterComponent = () => {
  return (
    <Layout.Footer className=" py-12! w-full! bg-white! mt-20!">
      <div className="w-full mx-auto">
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <div className="mb-6">
              <Title level={1} className="text-white mb-4">
                TechShop
              </Title>
              <Text className="text-gray-300 text-sm leading-relaxed">
                Chúng tôi cam kết mang đến những sản phẩm và dịch vụ chất lượng
                cao nhất cho khách hàng với sự tận tâm và chuyên nghiệp.
              </Text>
            </div>
          </Col>

          {/* Sản phẩm */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} className="text-white mb-4">
              Sản phẩm
            </Title>
            <Space direction="vertical" size="small" className="w-full">
              <Link
                href="#"
                className="text-gray-300 hover:text-white text-sm block"
              >
                Trang chủ
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white text-sm block"
              >
                Sản phẩm
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white text-sm block"
              >
                Dịch vụ
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white text-sm block"
              >
                Giải pháp
              </Link>
            </Space>
          </Col>

          {/* Hỗ trợ */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} className="text-white mb-4">
              Hỗ trợ
            </Title>
            <Space direction="vertical" size="small" className="w-full">
              <Link
                href="#"
                className="text-gray-300 hover:text-white text-sm block"
              >
                Trung tâm hỗ trợ
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white text-sm block"
              >
                Liên hệ
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white text-sm block"
              >
                Chính sách bảo mật
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white text-sm block"
              >
                Điều khoản sử dụng
              </Link>
            </Space>
          </Col>

          {/* Thông tin liên hệ */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} className="text-white mb-4">
              Liên hệ
            </Title>
            <Space direction="vertical" size="small" className="w-full">
              <div className="flex items-center text-gray-300 text-sm">
                <EnvironmentOutlined className="mr-2" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <PhoneOutlined className="mr-2" />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <MailOutlined className="mr-2" />
                <span>info@yourbrand.com</span>
              </div>
            </Space>

            {/* Mạng xã hội */}
            <div className="mt-6">
              <Title level={5} className="text-white mb-3">
                Theo dõi chúng tôi
              </Title>
              <Space size="middle">
                <Link
                  href="#"
                  className="text-gray-300 hover:text-blue-400 text-xl"
                >
                  <FacebookOutlined />
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-blue-400 text-xl"
                >
                  <TwitterOutlined />
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-pink-400 text-xl"
                >
                  <InstagramOutlined />
                </Link>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-blue-600 text-xl"
                >
                  <LinkedinOutlined />
                </Link>
              </Space>
            </div>
          </Col>
        </Row>

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
