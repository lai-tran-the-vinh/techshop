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
import { BsArrowLeft } from 'react-icons/bs';

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
      <div className="hidden lg:flex lg:w-[50%] bg-white border-r border-gray-200 flex-col justify-center items-start text-gray-800 p-48 xl:p-96 relative overflow-hidden">
        <div className="absolute top-32 left-32 cursor-pointer flex items-center gap-8 transition-transform hover:-translate-x-4 text-gray-600 hover:text-gray-900 z-20" onClick={() => navigate('/')}>
          <BsArrowLeft className="text-2xl" /> <span className="text-lg font-medium">Trở về</span>
        </div>
        <div className="z-10 w-full max-w-3xl mx-auto flex flex-row items-center justify-between gap-32">
          <h1 className="text-[40px] xl:text-[60px] font-black text-black leading-[1.05] tracking-tighter [-webkit-text-stroke:1px_black] shrink-0">
            Khám<br />
            phá<br />
            công nghệ<br />
            bạn <span className="text-[#e53935] [-webkit-text-stroke:1px_#e53935]">yêu</span><br />
            <span className="text-[#e53935] [-webkit-text-stroke:1px_#e53935]">thích.</span>
          </h1>
          <div className="flex-1 flex justify-center">
            {/* Thay src bằng file SVG của bạn */}
            <img src="/login.svg" alt="Illustration" className="w-full max-w-[350px] object-contain" />
          </div>
        </div>
        <div className="absolute -bottom-[128px] -right-[128px] w-[384px] h-[384px] bg-[#e53935] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-[128px] -left-[128px] w-[288px] h-[288px] bg-[#e53935] opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col bg-white relative max-h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden shrink-0 sticky top-0 left-0 w-full h-46 bg-gradient-primary-to-secondary flex items-center justify-between px-16 sm:px-24 shadow-md z-50">
          <div className="cursor-pointer flex items-center text-white" onClick={() => navigate('/')}>
            <BsArrowLeft className="text-2xl" />
          </div>
          <div className="text-white text-2xl font-bold">
            TechShop
          </div>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col justify-center pt-16 lg:pt-48 pb-48 px-24 sm:px-48 md:px-64 lg:px-96 xl:px-120">
          <div className="mx-auto w-full max-w-md my-auto mt-16 lg:mt-auto">
            <Space
              size={16}
              direction="vertical"
              className="w-full! text-center! mb-32! hidden! lg:block!"
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

                <div className="text-right! mb-24!">
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
                    className="h-[44px]! rounded-lg! font-semibold! bg-[#e53935]! text-white! border-none!"
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>

                <Divider plain className="my-32! mx-0! border-[#e0e0e0]!">
                  <span className="text-[#8c8c8c]! text-sm! bg-white! px-4!">
                    Hoặc tiếp tục với
                  </span>
                </Divider>

                <Button
                  icon={<img src="/google-icon.svg" alt="Google" className="w-[18px] h-[18px]" />}
                  block
                  className="h-[44px]! rounded-lg! text-base! font-semibold! border border-[#e0e0e0]! bg-white! flex! items-center! justify-center!"
                  onClick={() => handleLoginWithGoogle()}
                >
                  Đăng nhập với Google
                </Button>
              </Form>
            </div>

            <div className="text-center! py-32! px-0! bg-white! border-t border-t-[#f0f0f0]!">
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
    </div>
  );
}

export default Login;
