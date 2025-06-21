import React, { useState, useEffect } from 'react';
import { useLogin } from '@hooks/users';
import { Modal, Form, Input, Button, Divider, Typography, Space } from 'antd';
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  CloseOutlined,
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useAppContext } from '@contexts';

const { Title, Link, Text } = Typography;

function Login() {
  const [form] = Form.useForm();
  const [user, setUser] = useState({ email: '', password: '' });
  const { setShowLogin, setShowSignup, message } = useAppContext();
  const { handleLogin } = useLogin(message);

  return (
    <Modal
      open={true}
      onCancel={() => setShowLogin(false)}
      footer={null}
      width={600}
      centered
      closeIcon={
        <CloseOutlined
          style={{
            fontSize: 18,
            color: '#8c8c8c',
            transition: 'all 0.3s ease',
          }}
        />
      }
    >
      <Space
        direction="vertical"
        size={16}
        style={{ width: '100%', padding: '40px 0 0 0', textAlign: 'center' }}
      >
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 600 }}>
            Đăng Nhập
          </Title>
        </div>
      </Space>

      <div style={{ padding: '40px 40px 30px' }}>
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(_, allValues) => {
            setUser(allValues);
          }}
          onFinish={() => handleLogin(user)}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            label={
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#262626',
                }}
              >
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
              prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
              placeholder="Nhập email của bạn"
              style={{
                borderRadius: 12,
                padding: '12px 16px',
                border: '2px solid #f0f0f0',
                fontSize: 15,
                transition: 'all 0.3s ease',
              }}
            />
          </Form.Item>

          <Form.Item
            label={
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#262626',
                }}
              >
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
                min: 6,
                message: 'Mật khẩu phải có ít nhất 6 ký tự.',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#8c8c8c' }} />}
              placeholder="Nhập mật khẩu của bạn"
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone twoToneColor="#667eea" />
                ) : (
                  <EyeInvisibleOutlined style={{ color: '#8c8c8c' }} />
                )
              }
              style={{
                borderRadius: 12,
                padding: '12px 16px',
                border: '2px solid #f0f0f0',
                fontSize: 15,
                transition: 'all 0.3s ease',
              }}
            />
          </Form.Item>

          <div style={{ textAlign: 'right', marginBottom: 32 }}>
            <Link
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#667eea',
                transition: 'all 0.3s ease',
              }}
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Form.Item>
            <Button
              type="link"
              htmlType="submit"
              block
              style={{
                height: 50,
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                border: '2px solid #f0f0f0',
                backgroundColor: 'white',
                color: '#262626',
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <Divider
            plain
            style={{
              margin: '24px 0',
              borderColor: '#e8e8e8',
            }}
          >
            <span
              style={{
                color: '#8c8c8c',
                fontSize: 14,
                backgroundColor: '#fafafa',
                padding: '0 16px',
              }}
            >
              Hoặc tiếp tục với
            </span>
          </Divider>

          <Button
            icon={<GoogleOutlined style={{ fontSize: 18 }} />}
            block
            style={{
              height: 50,
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 500,
              border: '2px solid #f0f0f0',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            Đăng nhập với Google
          </Button>
        </Form>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          padding: '20px 40px 30px',
          backgroundColor: 'white',
          borderTop: '1px solid #f0f0f0',
        }}
      >
        <Text style={{ color: '#8c8c8c', fontSize: 14 }}>
          Chưa có tài khoản?{' '}
          <Button
            type="link"
            onClick={() => {
              setShowLogin(false), setShowSignup(true);
            }}
          >
            Đăng ký
          </Button>
        </Text>
      </div>
    </Modal>
  );
}

export default Login;
