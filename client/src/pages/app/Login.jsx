import {
  Modal,
  Form,
  Input,
  Button,
  Divider,
  Typography,
  ConfigProvider,
} from 'antd';

import {
  EyeTwoTone,
  CloseOutlined,
  GoogleOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';

import { useLogin } from '@/hooks/users';
import { useAppContext } from '@contexts';
import { useState, useEffect } from 'react';

function Login() {
  const [form] = Form.useForm();
  const { showLogin, setShowLogin, message } = useAppContext();
  const { handleLogin } = useLogin(message);
  const [user, setUser] = useState({ email: '', password: '' });

  useEffect(() => {
    document.title = 'TechShop | Đăng nhập';
  }, []);

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            controlHeight: 40,
          },
        },
      }}
    >
      <Modal
        centered
        width="50%"
        footer={null}
        open={showLogin}
        title="Đăng nhập"
        closeIcon={<CloseOutlined />}
        onCancel={() => setShowLogin(false)}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={() => handleLogin(user)}
          initialValues={user}
          onValuesChange={(_, allValues) => setUser(allValues)}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email không được để trống' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="Nhập email" className="h-40!" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Mật khẩu không được để trống.' },
            ]}
          >
            <Input.Password
              className="h-40!"
              placeholder="Nhập mật khẩu"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <Typography.Text
              type="secondary"
              className="cursor-pointer! text-primary! font-medium! hover:opacity-80!"
            >
              Quên mật khẩu?
            </Typography.Text>
          </div>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              className="bg-primary!"
            >
              Đăng nhập
            </Button>
          </Form.Item>
          <Divider plain>Hoặc</Divider>
          <Button
            block
            icon={<GoogleOutlined />}
            className="hover:text-primary! hover:border-primary!"
            onClick={() => message.info('Chức năng đang phát triển')}
          >
            Đăng nhập với Google
          </Button>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}

export default Login;
