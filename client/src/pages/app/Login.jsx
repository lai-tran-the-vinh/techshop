import { useState } from 'react';
import { useLogin } from '@hooks/users';
import { Form, Input, Button, Divider, Typography, Space } from 'antd';
import {
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  GoogleOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import { useAppContext } from '@contexts';
import UserService from '@/services/users';
import { useNavigate } from 'react-router-dom';

const { Title, Link, Text } = Typography;

function Login() {
  const [user, setUser] = useState({ email: '', password: '' });
  const { message } = useAppContext();
  const { handleLogin } = useLogin(message);
  const navigate = useNavigate();

  const handleLoginWithGoogle = async () => {
    try {
      window.location.href = `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/google`;
    } catch (error) {
      message.error('Đăng ký bằng google thất bại!');
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Marketing/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 to-orange-500 flex-col justify-center items-center text-white p-12 relative overflow-hidden">
        <div className="absolute top-8 left-8 cursor-pointer flex items-center gap-2 transition-transform hover:-translate-x-1" onClick={() => navigate('/')}>
          <ArrowLeftOutlined className="text-xl" /> <span className="text-lg font-medium">Trở về</span>
        </div>
        <div className="max-w-md z-10">
          <Title level={1} className="text-white! mb-6!">TechShop</Title>
          <Title level={2} className="text-white! mb-6!">Bắt đầu hành trình mua sắm của bạn.</Title>
          <ul className="space-y-4 text-lg">
            <li className="flex items-center gap-3">✨ Truy cập hàng ngàn sản phẩm công nghệ</li>
            <li className="flex items-center gap-3">🚀 Giao hàng siêu tốc 2h</li>
            <li className="flex items-center gap-3">🛡️ Bảo hành chính hãng 12 tháng</li>
            <li className="flex items-center gap-3">💎 Trở thành viên TechShop ngay hôm nay</li>
          </ul>
        </div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-32 -left-32 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative">
        <div className="absolute top-8 left-8 lg:hidden cursor-pointer flex items-center gap-2 transition-transform hover:-translate-x-1" onClick={() => navigate('/')}>
          <ArrowLeftOutlined className="text-xl text-gray-500" /> <span className="text-lg font-medium text-gray-500">Trở về</span>
        </div>
        <div className="mx-auto w-full max-w-md">
          <Space
            size={16}
            direction="vertical"
            className="w-full! text-center! mb-8"
          >
            <div>
              <Title level={2} className="m-0! text-primary!">
                Đăng nhập
              </Title>
            </div>
          </Space>

          <div>
        <Form
          layout="vertical"
          onValuesChange={(_, allValues) => {
            setUser(allValues);
          }}
          onFinish={() => handleLogin(user)}
          autoComplete="off"
        >
          <Form.Item
            label={
              <span className="text-[15px]! font-medium! text-[#262626]!">
                Email
              </span>
            }
            name="email"
            rules={[
              {
                required: true,
                message: 'Email không được để trống.',
              },
              {
                type: 'email',
                message: 'Email không đúng định dạng.',
              },
            ]}
          >
            <Input
              placeholder="Nhập email của bạn"
              className="rounded-lg! h-[44px]! px-[14px]! border border-[#e0e0e0]! text-[14px]! placeholder:text-[14px]! hover:border-[#e53935]! focus-within:border-[#e53935]! focus-within:shadow-[0_0_0_2px_rgba(229,57,53,0.1)]! transition-all!"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-[15px]! font-medium! text-[#262626]!">
                Mật khẩu
              </span>
            }
            name="password"
            rules={[
              {
                required: true,
                message: 'Mật khẩu không được để trống.',
              },
              {
                min: 8,
                message: 'Mật khẩu phải có ít nhất 6 ký tự.',
              },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu của bạn"
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone twoToneColor="#8c8c8c" />
                ) : (
                  <EyeInvisibleOutlined style={{ color: '#8c8c8c' }} />
                )
              }
              className="rounded-lg! h-[44px]! px-[14px]! border border-[#e0e0e0]! text-[14px]! placeholder:text-[14px]! hover:border-[#e53935]! focus-within:border-[#e53935]! focus-within:shadow-[0_0_0_2px_rgba(229,57,53,0.1)]! transition-all!"
            />
          </Form.Item>

          <div className="text-right! mb-10!">
            <Link
              className="text-sm! font-medium! text-[#e53935]!"
              onClick={() => navigate('/forgot-password')}
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Form.Item>
            <Button
              block
              htmlType="submit"
              className="h-44! rounded-lg! test-base! font-semibold! bg-[#e53935]! text-white! border-none!"
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Divider plain className="my-10! mx-0! border-[#e0e0e0]!">
            <span className="text-[#8c8c8c]! text-sm! bg-white! px-4!">
              Hoặc tiếp tục với
            </span>
          </Divider>

          <Button
            icon={<img src="/google-icon.svg" alt="Google" className="w-[18px] h-[18px]" />}
            block
            className="h-44! rounded-lg! text-base! font-semibold! border border-[#e0e0e0]! bg-white! flex! items-center! justify-center!"
            onClick={() => handleLoginWithGoogle()}
          >
            Đăng nhập với Google
          </Button>
        </Form>
      </div>

      <div className="text-center! py-16! px-0! bg-white! border-t border-t-[#f0f0f0]!">
        <Text className="text-[#8c8c8c]! text-sm!">Chưa có tài khoản?</Text>
        <Button
          type="link"
          className="text-[#e53935]! font-semibold!"
          onClick={() => navigate('/signup')}
        >
          Đăng ký
        </Button>
      </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
