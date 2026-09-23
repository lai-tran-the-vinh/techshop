import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  Input,
  Button,
  Divider,
  Typography,
  Select,
  Row,
  Col,
  Space,
  Steps,
  InputNumber,
} from 'antd';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import Users from '@services/users';
import Address from '@services/address';
import { useAppContext } from '@contexts';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

const { Title, Link, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

function Signup() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [otp, setOtp] = useState('');
  const addressDropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [addressValue, setAddressValue] = useState('');
  const [selectedProvince, setSelectedProvince] = useState({});
  const [selectedCommune, setSelectedCommune] = useState({});
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState('Tỉnh/Thành phố');

  const places = ['Tỉnh/Thành phố', 'Quận/Huyện'];
  const { message } = useAppContext();

  useEffect(() => {
    document.title = 'TechShop | Đăng ký';
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const provincesData = await Address.getAllProvinces();
      setProvinces(provincesData);
    } catch (error) {
      message.error('Không thể tải danh sách tỉnh/thành phố');
    }
  };

  const fetchCommunes = async (provinceCode) => {
    try {
      const communesData = await Address.getCommunes(provinceCode);
      setCommunes(communesData);
    } catch (error) {
      message.error('Không thể tải danh sách quận/huyện');
    }
  };

  const handleSignup = async (user) => {
    setLoading(true);
    message.loading('Đang gửi mã OTP đến email của bạn');
    try {
      const userData = {
        age: user.age,
        name: user.name,
        phone: user.phone,
        email: user.email,
        gender: user.gender,
        password: user.password,
        // role: ['user'], // Default role
        address: addressValue
          ? [
              {
                addressDetail: addressValue,
                default: true,
              },
            ]
          : [],
      };
      const userServices = new Users();
      const response = await userServices.signup(userData);
      if (response.status === 201) {
        message.destroy();
        setCurrentStep(1);
      }
    } catch (error) {
      message.error('Đăng ký thất bại. Vui lòng thử lại!');
      console.error('Lỗi:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    message.info('Tính năng đăng ký với Google đang được phát triển');
  };
  const handleProvinceSelect = async (province, event) => {
    const newAddress = event.target.textContent;
    setAddressValue(newAddress);
    setSelectedProvince(province);
    setSelectedPlace('Quận/Huyện');
    setSelectedCommune({});

    await fetchCommunes(province.code);
  };

  const handleCommuneSelect = async (commune, event) => {
    const communeName = event.target.textContent;
    const newAddress = communeName + ', ' + selectedProvince.name;

    setAddressValue(newAddress);
    setSelectedCommune(commune);
    setShowAddressDropdown(false);
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Marketing/Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-white border-r border-gray-200 flex-col justify-center items-start text-gray-800 p-48 xl:p-96 relative overflow-hidden">
        <div className="absolute top-32 left-32 cursor-pointer flex items-center gap-8 transition-transform hover:-translate-x-4 text-gray-600 hover:text-gray-900 z-20" onClick={() => navigate('/')}>
          <BsArrowLeft className="text-2xl" /> <span className="text-lg font-medium">Trở về</span>
        </div>
        <div className="z-10 w-full max-w-3xl mx-auto flex flex-row items-center justify-between gap-32">
          <h1 className="text-[40px] xl:text-[60px] font-black text-black leading-[1.05] tracking-tighter [-webkit-text-stroke:1px_black] shrink-0">
            Trải<br />
            nghiệm<br />
            mua sắm<br />
            <span className="text-[#e53935] [-webkit-text-stroke:1px_#e53935]">tuyệt</span><br />
            <span className="text-[#e53935] [-webkit-text-stroke:1px_#e53935]">vời.</span>
          </h1>
          <div className="flex-1 flex justify-center">
            {/* Thay src bằng file SVG của bạn */}
            <img src="/sign-up.svg" alt="Illustration" className="w-full max-w-[350px] object-contain" />
          </div>
        </div>
        <div className="absolute -bottom-[128px] -right-[128px] w-[384px] h-[384px] bg-[#e53935] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-[128px] -left-[128px] w-[288px] h-[288px] bg-[#e53935] opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col bg-white relative max-h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden shrink-0 sticky top-0 left-0 w-full h-[60px] bg-gradient-primary-to-secondary flex items-center justify-between px-16 sm:px-24 shadow-md z-50">
          <div className="cursor-pointer flex items-center text-white" onClick={() => navigate('/')}>
            <BsArrowLeft className="text-2xl" />
          </div>
          <div className="text-white text-2xl font-bold">
            TechShop
          </div>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col pt-16 lg:pt-48 pb-48 px-24 sm:px-48 md:px-64 lg:px-96 xl:px-120">
          <div className="mx-auto w-full max-w-2xl my-auto mt-8 lg:mt-auto">
      <Steps
        className="pt-16 pb-32 md:py-48"
        current={currentStep}
        items={[{ title: 'Đăng ký' }, { title: 'Nhập OTP' }]}
      />
      {currentStep === 0 ? (
        <>
          <Title level={2} className="text-primary! text-center! mt-16 hidden! lg:block! mb-16">
            Tạo tài khoản mới
          </Title>
          <div className="pb-48">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSignup}
              onValuesChange={(_, values) => {
                setUser(values);
              }}
              autoComplete="off"
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    className="mb-12!"
                    label={
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: '#262626',
                        }}
                      >
                        Họ và tên
                      </span>
                    }
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: 'Họ và tên không được để trống',
                      },
                      { min: 8, message: 'Họ và tên phải có ít nhất 2 ký tự' },
                    ]}
                  >
                    <Input
                      placeholder="Nhập họ và tên"
                      className="rounded-lg! h-[48px]! md:h-[44px]! px-[14px]! border border-[#e0e0e0]! text-[14px]! placeholder:text-[14px]! hover:border-[#e53935]! focus-within:border-[#e53935]! focus-within:shadow-[0_0_0_2px_rgba(229,57,53,0.1)]! transition-all!"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    className="mb-12!"
                    label={
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: '#262626',
                        }}
                      >
                        Email
                      </span>
                    }
                    name="email"
                    rules={[
                      { required: true, message: 'Email không được để trống' },
                      { type: 'email', message: 'Email không đúng định dạng' },
                    ]}
                  >
                    <Input
                      placeholder="Nhập email"
                      className="rounded-lg! h-[48px]! md:h-[44px]! px-[14px]! border border-[#e0e0e0]! text-[14px]! placeholder:text-[14px]! hover:border-[#e53935]! focus-within:border-[#e53935]! focus-within:shadow-[0_0_0_2px_rgba(229,57,53,0.1)]! transition-all!"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                className="mb-12!"
                label={
                  <span
                    style={{ fontSize: 14, fontWeight: 500, color: '#262626' }}
                  >
                    Mật khẩu
                  </span>
                }
                name="password"
                rules={[
                  { required: true, message: 'Mật khẩu không được để trống' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                ]}
              >
                <Input.Password
                  placeholder="Nhập mật khẩu"
                  iconRender={(visible) =>
                    visible ? (
                      <EyeTwoTone twoToneColor={'#8c8c8c'} />
                    ) : (
                      <EyeInvisibleOutlined style={{ color: '#8c8c8c' }} />
                    )
                  }
                  className="rounded-lg! h-[48px]! md:h-[44px]! px-[14px]! border border-[#e0e0e0]! text-[14px]! placeholder:text-[14px]! hover:border-[#e53935]! focus-within:border-[#e53935]! focus-within:shadow-[0_0_0_2px_rgba(229,57,53,0.1)]! transition-all!"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Form.Item
                    className="mb-12!"
                    label={
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: '#262626',
                        }}
                      >
                        Số điện thoại
                      </span>
                    }
                    name="phone"
                    rules={[
                      {
                        pattern: /^[0-9]{10,11}$/,
                        message: 'Số điện thoại không hợp lệ',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập SĐT"
                      className="rounded-lg! h-[48px]! md:h-[44px]! px-[14px]! border border-[#e0e0e0]! text-[14px]! placeholder:text-[14px]! hover:border-[#e53935]! focus-within:border-[#e53935]! focus-within:shadow-[0_0_0_2px_rgba(229,57,53,0.1)]! transition-all!"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    className="mb-12!"
                    label={
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: '#262626',
                        }}
                      >
                        Giới tính
                      </span>
                    }
                    name="gender"
                  >
                    <Select
                      placeholder="Chọn giới tính"
                      className="h-[48px]! md:h-[44px]! [&_.ant-select-selector]:h-full! [&_.ant-select-selector]:items-center [&_.ant-select-selector]:rounded-lg! [&_.ant-select-selection-item]:text-[14px]! [&_.ant-select-selection-placeholder]:text-[14px]!"
                      style={{ borderRadius: 8 }}
                    >
                      <Option value="male">Nam</Option>
                      <Option value="female">Nữ</Option>
                      <Option value="other">Khác</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    className="mb-12!"
                    label={
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: '#262626',
                        }}
                      >
                        Tuổi
                      </span>
                    }
                    name="age"
                    rules={[
                      {
                        type: 'number',
                        min: 13,
                        max: 100,
                        message: 'Tuổi phải từ 13-100',
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Nhập tuổi"
                      className="h-[48px]! md:h-[44px]! w-full! rounded-lg! [&_input]:text-[14px]! [&_input]:placeholder:text-[14px]! [&_.ant-input-number-input-wrap]:flex [&_.ant-input-number-input-wrap]:items-center [&_.ant-input-number-input-wrap]:h-full [&_input]:h-full"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item className="mb-16!">
                    <div style={{ position: 'relative' }}>
                      <label
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: '#262626',
                          display: 'block',
                          marginBottom: 8,
                        }}
                      >
                        Địa chỉ (mặc định)
                      </label>
                      <Input
                        readOnly
                        value={addressValue}
                        placeholder="Chọn địa chỉ"
                        onClick={() =>
                          setShowAddressDropdown(!showAddressDropdown)
                        }
                        className="rounded-lg! h-[48px]! md:h-[44px]! px-[14px]! border border-[#e0e0e0]! text-[14px]! placeholder:text-[14px]! hover:border-[#e53935]! focus-within:border-[#e53935]! focus-within:shadow-[0_0_0_2px_rgba(229,57,53,0.1)]! transition-all! cursor-pointer! bg-white!"
                      />

                      {showAddressDropdown && (
                        <div
                          ref={addressDropdownRef}
                          style={{
                            backgroundColor: 'white',
                            position: 'absolute',
                            zIndex: 1000,
                            top: '100%',
                            marginTop: 8,
                            left: 0,
                            right: 0,
                            borderRadius: 8,
                            border: '1px solid #d9d9d9',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              borderBottom: '1px solid #f0f0f0',
                            }}
                          >
                            {places.map((place, index) => (
                              <div
                                key={index}
                                onClick={() => setSelectedPlace(place)}
                                style={{
                                  width: '50%',
                                  cursor: 'pointer',
                                  padding: '12px 8px',
                                  textAlign: 'center',
                                  fontSize: 14,
                                  borderBottom:
                                    selectedPlace === place
                                      ? '2px solid #667eea'
                                      : '2px solid transparent',
                                  color:
                                    selectedPlace === place
                                      ? '#667eea'
                                      : '#262626',
                                  fontWeight:
                                    selectedPlace === place ? 500 : 400,
                                }}
                              >
                                {place}
                              </div>
                            ))}
                          </div>

                          <div
                            style={{
                              overflowY: 'auto',
                              maxHeight: 200,
                              padding: 8,
                              cursor: 'pointer',
                            }}
                          >
                            {selectedPlace === 'Tỉnh/Thành phố' &&
                              provinces.map((province, index) => (
                                <div
                                  key={index}
                                  onClick={(event) =>
                                    handleProvinceSelect(province, event)
                                  }
                                  style={{
                                    padding: '8px 12px',
                                    margin: '4px 0',
                                    borderRadius: 6,
                                    fontSize: 14,
                                    backgroundColor:
                                      selectedProvince.name === province.name
                                        ? '#f6f6f6'
                                        : 'transparent',
                                    ':hover': { backgroundColor: '#f6f6f6' },
                                  }}
                                >
                                  {province.name}
                                </div>
                              ))}

                            {selectedPlace === 'Quận/Huyện' &&
                              communes.map((commune, index) => (
                                <div
                                  key={index}
                                  onClick={(event) =>
                                    handleCommuneSelect(commune, event)
                                  }
                                  style={{
                                    padding: '8px 12px',
                                    margin: '4px 0',
                                    borderRadius: 6,
                                    fontSize: 14,
                                    backgroundColor:
                                      selectedCommune.name === commune.name
                                        ? '#f6f6f6'
                                        : 'transparent',
                                  }}
                                >
                                  {commune.name}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item className="mb-12!">
                <Button
                  htmlType="submit"
                  loading={loading}
                  block
                  className="h-[48px]! md:h-[44px]!"
                  style={{
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    backgroundColor: '#e53935',
                    color: '#fff',
                    border: 'none',
                  }}
                >
                  Đăng ký
                </Button>
              </Form.Item>

              <Divider plain style={{ margin: '16px 0' }}>
                <span style={{ color: '#8c8c8c', fontSize: 14 }}>
                  Hoặc tiếp tục với
                </span>
              </Divider>

              <Button
                icon={<img src="/google-icon.svg" alt="Google" className="w-[18px] h-[18px]" />}
                onClick={handleGoogleSignup}
                block
                className="h-[48px]! md:h-[44px]!"
                style={{
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                }}
              >
                Đăng ký với Google
              </Button>
            </Form>
          </div>
        </>
      ) : (
        <>
          <Title level={2} className="text-primary! text-center!">
            Xác nhận mã OTP
          </Title>
          <div className="relative mb-16!">
            <Input
              value={otp}
              className="h-[48px]! md:h-[44px]! px-[14px]! rounded-lg! text-[14px]! placeholder:text-[14px]! border-[#e0e0e0]! hover:border-[#e53935]! focus-within:border-[#e53935]! focus-within:shadow-[0_0_0_2px_rgba(229,57,53,0.1)]! transition-all!"
              placeholder="Nhập mã OTP đã gửi đến email của bạn"
              onChange={(event) => {
                setOtp(event.target.value);
              }}
            />
            <Button
              onClick={async () => {
                try {
                  message.loading('Đang gửi lại mã OTP.');
                  const userServices = new Users();
                  const response = await userServices.resendOtp(user.email);
                  if (response.status === 201) {
                    message.destroy();
                    message.success('Mã OTP đã được gửi lại thành công!');
                  }
                } catch (error) {
                  message.error('Gửi lại mã OTP thất bại. Vui lòng thử lại!');
                  console.error('Lỗi gửi lại mã OTP:', error);
                  return;
                }
              }}
              className="absolute! right-8! border-none! font-medium! shadow-none! top-1/2! -translate-y-[50%]!"
            >
              Gửi lại mã
            </Button>
          </div>
          <Button
            type="primary"
            disabled={!otp}
            className="h-[48px]! md:h-[44px]! w-full! mb-16!"
            onClick={async () => {
              try {
                message.loading('Đang xác nhận mã OTP.');
                const userServices = new Users();
                const response = await userServices.verifyOtp({
                  email: user.email,
                  otp: otp,
                });
                if (response.status === 201) {
                  message.destroy();
                  message.success('Đăng ký thành công!');
                  navigate('/login');
                }
              } catch (error) {
                message.error('Xác nhận OTP thất bại. Vui lòng thử lại!');
                console.error('Lỗi xác nhận OTP:', error.message);
                return;
              }
            }}
          >
            Xác nhận
          </Button>
        </>
      )}
      <div className="text-center pt-8 pb-12 px-4 border-t border-t-[#f0f0f0]">
        <Text style={{ color: '#8c8c8c', fontSize: 14 }}>
          Đã có tài khoản?{' '}
          <Link
            onClick={() => navigate('/login')}
            className="font-semibold! text-primary!"
          >
            Đăng nhập ngay
          </Link>
        </Text>
      </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
