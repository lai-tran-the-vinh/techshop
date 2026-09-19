import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  Table,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Input,
  message,
  Tooltip,
  Flex,
  Modal,
  Empty,
  Form,
  Select,
  Space,
  Avatar,
  Descriptions,
  Divider,
  Switch,
  Checkbox,
  Badge,
  Spin,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  MailOutlined,
  PlusOutlined,
  DeleteOutlined,
  HomeOutlined,
  UserAddOutlined,
  PhoneOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import {
  callFetchUsers,
  callFetchRoles,
  callFetchBranches,
} from '@/services/apis';

import { useAppContext } from '@/contexts';
import Address from '@/services/address';
import UserService from '@/services/users';

const { Title, Text } = Typography;
const { Option } = Select;

const UserManagement = () => {
  const [form] = Form.useForm();
  const { message } = useAppContext();

  // State management
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUser, setPreviewUser] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    branch: '',
  });

  const addressDropdownRef = useRef(null);
  const [addressStates, setAddressStates] = useState({
    selectedCommune: {},
    provinces: [],
    communes: [],
    showAddressDropdown: {},
    activeAddressKey: null,
    selectedPlace: 'Tỉnh/Thành phố',
  });

  const places = ['Tỉnh/Thành phố', 'Quận/Huyện'];

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchRole = !filters.role || user.role?._id === filters.role;
      const matchStatus =
        !filters.status ||
        (filters.status === 'active' && user.isActive) ||
        (filters.status === 'inactive' && !user.isActive);
      const matchUserType =
        !filters.userType || user.userType === filters.userType;

      const search = searchText.toLowerCase();
      const matchSearch =
        !search ||
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.role?.name?.toLowerCase().includes(search) ||
        user.phone?.toLowerCase().includes(search) ||
        user.branch?.name?.toLowerCase().includes(search);

      return matchRole && matchStatus && matchUserType && matchSearch;
    });
  }, [users, filters, searchText]);

  useEffect(() => {
    document.title = 'Quản lý  người dùng';
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await callFetchUsers();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Không thể tải danh sách người dùng');
    }
  }, [message]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await callFetchRoles();
      setRoles(response.data.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      message.error('Không thể tải danh sách vai trò');
    }
  }, [message]);

  const fetchBranches = useCallback(async () => {
    try {
      const response = await callFetchBranches();
      setBranches(response.data.data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
      message.error('Không thể tải danh sách chi nhánh');
    }
  }, [message]);

  const fetchProvinces = useCallback(async () => {
    try {
      const provincesData = await Address.getAllProvinces();
      setAddressStates((prev) => ({ ...prev, provinces: provincesData }));
    } catch (error) {
      message.error('Không thể tải danh sách tỉnh/thành phố');
    }
  }, [message]);

  const fetchCommunes = useCallback(
    async (provinceCode) => {
      try {
        const communesData = await Address.getCommunes(provinceCode);
        setAddressStates((prev) => ({ ...prev, communes: communesData }));
      } catch (error) {
        message.error('Không thể tải danh sách quận/huyện');
      }
    },
    [message],
  );


  const handleProvinceSelect = useCallback(
    async (provinceData, fieldKey) => {
      const currentAddresses = form.getFieldValue('addresses') || [];
      const newAddressDetail = provinceData.name;

      const updatedAddresses = [...currentAddresses];
      if (updatedAddresses[fieldKey]) {
        updatedAddresses[fieldKey] = {
          ...updatedAddresses[fieldKey],
          addressDetail: newAddressDetail,
        };
        form.setFieldsValue({ addresses: updatedAddresses });
      }

      setAddressStates((prev) => ({
        ...prev,
        selectedProvince: provinceData,
        selectedPlace: 'Quận/Huyện',
        selectedCommune: {},
      }));

      await fetchCommunes(provinceData.code);
    },
    [form, fetchCommunes],
  );

  const handleCommuneSelect = useCallback(
    (communeData, fieldKey) => {
      const currentAddressDetail =
        form.getFieldValue(['addresses', fieldKey, 'addressDetail']) || '';
      const newAddressDetail = currentAddressDetail + ', ' + communeData.name;

      const currentAddresses = form.getFieldValue('addresses') || [];
      const updatedAddresses = [...currentAddresses];
      if (updatedAddresses[fieldKey]) {
        updatedAddresses[fieldKey] = {
          ...updatedAddresses[fieldKey],
          addressDetail: newAddressDetail,
        };
        form.setFieldsValue({ addresses: updatedAddresses });
      }

      setAddressStates((prev) => {
        const newShowAddressDropdown = { ...prev.showAddressDropdown };
        newShowAddressDropdown[fieldKey] = false;

        return {
          ...prev,
          selectedCommune: communeData,
          showAddressDropdown: newShowAddressDropdown,
          activeAddressKey: null,
        };
      });
    },
    [form, addressStates.selectedProvince],
  );

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchUsers(),
          fetchRoles(),
          fetchBranches(),
          fetchProvinces(),
        ]);
      } catch (error) {
        console.error('Failed to initialize data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [fetchUsers, fetchRoles, fetchBranches, fetchProvinces]);

  // Form initialization
  useEffect(() => {
    if (selectedUser) {
      form.setFieldsValue({
        _id: selectedUser._id,
        name: selectedUser.name,
        email: selectedUser.email,
        gender: selectedUser.gender,
        age: selectedUser.age,
        userType: selectedUser.userType,
        phone: selectedUser.phone,
        isActive: selectedUser.isActive,
        addresses:
          selectedUser.addresses?.map((address) => ({
            specificAddress: address.specificAddress,
            addressDetail: address.addressDetail,
            default: address.default,
          })) || [],
      });
    } else {
      form.resetFields();
    }

    // Reset address states
    setAddressStates((prev) => ({
      ...prev,
      showAddressDropdown: {},
      activeAddressKey: null,
      selectedPlace: 'Tỉnh/Thành phố',
      selectedProvince: {},
      selectedDistrict: {},
      districts: [],
    }));
  }, [selectedUser, form]);

  // Event handlers
  const reloadTable = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUsers(), fetchRoles(), fetchBranches()]);
      message.success('Dữ liệu tải lại thành công!');
    } catch (error) {
      console.error('Failed to reload data:', error);
      message.error('Không thể tải lại dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, fetchRoles, fetchBranches, message]);

  const handleCreateUser = useCallback(() => {
    setSelectedUser(null);
    setOpenModal(true);
  }, []);

  const handleSubmit = useCallback(
    async (values) => {
      setSubmitLoading(true);
      try {
        let response;
        if (!selectedUser) {
          response = await UserService.create(values);
          setUsers((prev) => [...prev, response.data.data]);
          message.success('Tạo người dùng thành công');
        } else {
          response = await UserService.update(values);
          setUsers((prev) =>
            prev.map((user) =>
              user._id === selectedUser._id ? response.data.data : user,
            ),
          );
          message.success('Cập nhật người dùng thành công');
        }
        handleCancel();
        await fetchUsers();
      } catch (error) {
        console.error('Failed to save user:', error);
        message.error(
          selectedUser
            ? 'Cập nhật người dùng thất bại'
            : 'Tạo người dùng thất bại',
        );
      } finally {
        setSubmitLoading(false);
      }
    },
    [selectedUser, message, fetchUsers],
  );

  const handleCancel = useCallback(() => {
    form.resetFields();
    setOpenModal(false);
    setSelectedUser(null);
    setAddressStates((prev) => ({
      ...prev,
      showAddressDropdown: {},
      activeAddressKey: null,
      selectedPlace: 'Tỉnh/Thành phố',
      selectedProvince: {},
      selectedCommune: {},
      communes: [],
    }));
  }, [form]);

  // Table columns configuration
  const columns = useMemo(
    () => [
      {
        title: 'Người dùng',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar
              size={40}
              src={record.avatar}
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            >
              {text?.charAt(0)?.toUpperCase()}
            </Avatar>
            <div>
              <div>
                <Text strong style={{ color: '#1890ff' }}>
                  {text}
                </Text>
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                <MailOutlined style={{ marginRight: 4 }} />
                {record.email}
                {record.age && (
                  <span style={{ marginLeft: 8 }}>• {record.age} tuổi</span>
                )}
              </div>
            </div>
          </div>
        ),
        sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
      },
      {
        title: 'Số điện thoại',
        dataIndex: 'phone',
        key: 'phone',
        render: (phone) => phone || '-',
        sorter: (a, b) => (a.phone || '').localeCompare(b.phone || ''),
      },

      {
        title: 'Trạng thái',
        key: 'isActive',
        align: 'center',
        render: (_, record) => (
          <Tooltip title={record.isActive ? 'Hoạt động' : 'Ngưng hoạt động'}>
            <Badge
              status={record.isActive ? 'success' : 'default'}
              text={record.isActive ? 'Hoạt động' : 'Ngưng hoạt động'}
            />
          </Tooltip>
        ),
        filters: [
          { text: 'Hoạt động', value: true },
          { text: 'Ngưng hoạt động', value: false },
        ],
        onFilter: (value, record) => record.isActive === value,
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: (date) => {
          if (!date) return '-';
          return new Date(date).toLocaleDateString('vi-VN');
        },
        sorter: (a, b) =>
          new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
      },
      {
        title: 'Hành động',
        key: 'action',
        align: 'center',
        width: 150,
        render: (_, record) => (
          <Space>
            <Tooltip title="Xem chi tiết">
              <Button
                type="link"
                icon={<EyeOutlined />}
                size="small"
                onClick={() => {
                  setPreviewUser(record);
                  setPreviewVisible(true);
                }}
              />
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <Button
                type="link"
                icon={<EditOutlined />}
                size="small"
                onClick={() => {
                  setSelectedUser(record);
                  setOpenModal(true);
                }}
              >
                Sửa
              </Button>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [],
  );

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-60px)] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-16 md:p-24">
      <div className="mb-12 lg:mb-16">
        <div className="text-[28px] md:text-[32px] font-semibold text-[#111827]! m-0! leading-tight">
          Quản lý người dùng
        </div>
        <div className="text-[14px] md:text-[16px] text-[#6b7280]! mt-2!">
          Quản lý thông tin và phân quyền người dùng trong hệ thống.
        </div>
      </div>

      <Card className="shadow-none!">
        <div className="flex flex-col lg:flex-row gap-10 items-stretch lg:items-center mb-16">
          
          <div className="w-full lg:flex-1">
            <Input
              placeholder="Tìm kiếm tên, email..."
              prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              className="h-40 w-full"
            />
          </div>

          <div className="grid grid-cols-2 lg:flex gap-10 w-full lg:w-auto">
            <div className="col-span-1 w-full lg:w-[180px]">
              <Select
                placeholder="Trạng thái"
                className="w-full h-40"
                value={filters.status || undefined}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value || '' }))
                }
                allowClear
              >
                <Option value="">Tất cả</Option>
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Ngưng hoạt động</Option>
              </Select>
            </div>
            <div className="col-span-1 w-full lg:w-auto">
              <Button
                icon={<ReloadOutlined />}
                onClick={reloadTable}
                loading={loading}
                className="w-full h-40! shadow-none!"
              >
                Làm mới
              </Button>
            </div>
            <div className="col-span-2 lg:col-span-1 w-full lg:w-auto">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateUser}
                className="w-full h-40! shadow-none!"
              >
                Thêm người dùng
              </Button>
            </div>
          </div>
        </div>

        <Table
          scroll={{ x: 1000 }}
          loading={loading}
          rowKey={(record) => record._id}
          dataSource={filteredUsers}
          columns={columns}
          bordered
          size="middle"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người dùng`,
          }}
          locale={{
            emptyText: (
              <Empty
                description="Không tìm thấy người dùng nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      {/* User Detail Preview Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar
              icon={<UserOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            >
              {previewUser?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <span>Chi tiết người dùng</span>
          </div>
        }
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setSelectedUser(previewUser);
              setOpenModal(true);
              setPreviewVisible(false);
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={600}
      >
        {previewUser && (
          <div style={{ padding: '16px 0' }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Tên người dùng">
                <Text strong>{previewUser.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <Text code>{previewUser.email}</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Số điện thoại">
                {previewUser.phone ? (
                  <Text>{previewUser.phone}</Text>
                ) : (
                  <Text type="secondary">Chưa cập nhật</Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Tuổi">
                <Text>{previewUser.age || 'Chưa cập nhật'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                <Text
                  color={
                    previewUser.gender === 'male'
                      ? 'blue'
                      : previewUser.gender === 'female'
                        ? 'pink'
                        : 'default'
                  }
                >
                  {previewUser.gender === 'male'
                    ? 'Nam'
                    : previewUser.gender === 'female'
                      ? 'Nữ'
                      : 'Chưa xác định'}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {previewUser.addresses?.length > 0 ? (
                  <div>
                    {previewUser.addresses.map((addr, index) => (
                      <div key={index} style={{ marginBottom: 4 }}>
                        <Text
                          className={`font-semibold ${addr.default ? 'text-red-500!' : ''}`}
                        >
                          {addr.default ? 'Mặc định: ' : 'Phụ: '}
                        </Text>
                        <Text>
                          {addr.specificAddress}, {addr.addressDetail}
                        </Text>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Text type="secondary">Chưa có địa chỉ</Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Badge
                  color={previewUser.isActive ? 'green' : 'red'}
                  text={previewUser.isActive ? 'Hoạt động' : 'Khóa'}
                />
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Create/Edit User Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <UserAddOutlined style={{ color: '#1890ff' }} />
            <span>
              {selectedUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
            </span>
          </div>
        }
        open={openModal}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitLoading}
            onClick={() => form.submit()}
          >
            {selectedUser ? 'Cập nhật người dùng' : 'Thêm người dùng'}
          </Button>,
        ]}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          initialValues={{
            isActive: true,
            userType: 'GUEST',
            addresses: [],
          }}
        >
          <Divider orientation="left">
            <span style={{ color: '#666', fontWeight: 500 }}>
              Thông tin cơ bản
            </span>
          </Divider>

          <Row gutter={16}>
            <Form.Item name="_id" hidden>
              <Input />
            </Form.Item>
            <Col span={8}>
              <Form.Item
                name="name"
                label="Tên người dùng"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên người dùng!' },
                  { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Nhập tên người dùng"
                  prefix={<UserOutlined style={{ color: '#94A3B8' }} />}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Nhập email"
                  prefix={<MailOutlined style={{ color: '#94A3B8' }} />}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="age" label="Tuổi">
                <Input type="number" size="large" placeholder="Nhập tuổi" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="gender" label="Giới tính">
                <Select size="large" placeholder="Chọn giới tính" allowClear>
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Số điện thoại">
                <Input
                  size="large"
                  placeholder="Nhập số điện thoại"
                  prefix={<PhoneOutlined style={{ color: '#94A3B8' }} />}
                />
              </Form.Item>
            </Col>
          </Row>

          {!selectedUser && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                  ]}
                >
                  <Input.Password size="large" placeholder="Nhập mật khẩu" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('Mật khẩu không khớp!'),
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder="Xác nhận mật khẩu"
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Divider orientation="left">
            <span style={{ color: '#1890ff', fontWeight: 600 }}>Địa chỉ</span>
          </Divider>

          <Form.List name="addresses">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      border: '1px solid #f0f0f0',
                      borderRadius: 8,
                      padding: 16,
                      marginBottom: 16,
                      backgroundColor: '#fafafa',
                    }}
                  >
                    <Row gutter={16} align="middle">
                      <Col span={22}>
                        <Text strong>Địa chỉ #{key + 1}</Text>
                      </Col>
                      <Col span={2} style={{ textAlign: 'right' }}>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          size="small"
                        />
                      </Col>
                    </Row>

                    <Row gutter={16} style={{ marginTop: 12 }}>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'specificAddress']}
                          label="Địa chỉ cụ thể (số nhà, tên đường, thôn, xóm)"
                          rules={[
                            {
                              required: true,
                              message: 'Vui lòng nhập địa chỉ cụ thể!',
                            },
                          ]}
                        >
                          <Input.TextArea
                            placeholder="Ví dụ: số nhà, tên đường, thôn, xóm, ..."
                            autoSize={{ minRows: 1, maxRows: 3 }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'addressDetail']}
                          label="Địa chỉ hành chính"
                          rules={[
                            {
                              required: true,
                              message: 'Vui lòng chọn địa chỉ!',
                            },
                          ]}
                        >
                          <div style={{ position: 'relative' }}>
                            <Input
                              readOnly
                              placeholder="Chọn địa chỉ"
                              value={
                                form.getFieldValue('addresses')?.[key]
                                  ?.addressDetail || ''
                              }
                              onClick={() => {
                                const newShowAddressDropdown = {};
                                newShowAddressDropdown[key] =
                                  !addressStates.showAddressDropdown[key];

                                setAddressStates((prev) => ({
                                  ...prev,
                                  showAddressDropdown: newShowAddressDropdown,
                                  activeAddressKey: newShowAddressDropdown[key]
                                    ? key
                                    : null,
                                  selectedPlace: 'Tỉnh/Thành phố',
                                  selectedProvince: {},
                                  selectedCommune: {},
                                  communes: [],
                                }));
                              }}
                              prefix={
                                <HomeOutlined style={{ color: '#8c8c8c' }} />
                              }
                              style={{
                                borderRadius: 8,
                                padding: '10px 12px',
                                cursor: 'pointer',
                                backgroundColor: '#fff',
                              }}
                            />

                            {addressStates.showAddressDropdown[key] && (
                              <div
                                ref={(element) => {
                                  if (key === addressStates.activeAddressKey) {
                                    addressDropdownRef.current = element;
                                  }
                                }}
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
                                  maxHeight: 300,
                                  overflow: 'hidden',
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
                                      onClick={() =>
                                        setAddressStates((prev) => ({
                                          ...prev,
                                          selectedPlace: place,
                                        }))
                                      }
                                      style={{
                                        width: '50%',
                                        cursor: 'pointer',
                                        padding: '12px 8px',
                                        textAlign: 'center',
                                        fontSize: 14,
                                        borderBottom:
                                          addressStates.selectedPlace === place
                                            ? '2px solid #667eea'
                                            : '2px solid transparent',
                                        color:
                                          addressStates.selectedPlace === place
                                            ? '#667eea'
                                            : '#262626',
                                        fontWeight:
                                          addressStates.selectedPlace === place
                                            ? 500
                                            : 400,
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
                                  {addressStates.selectedPlace ===
                                    'Tỉnh/Thành phố' &&
                                    addressStates.provinces.map(
                                      (province, index) => (
                                        <div
                                          key={index}
                                          onClick={() =>
                                            handleProvinceSelect(province, key)
                                          }
                                          style={{
                                            padding: '8px 12px',
                                            margin: '4px 0',
                                            borderRadius: 6,
                                            fontSize: 14,
                                            backgroundColor:
                                              addressStates.selectedProvince
                                                .name === province.name
                                                ? '#f6f6f6'
                                                : 'transparent',
                                            transition: 'background-color 0.2s',
                                          }}
                                          onMouseEnter={(e) => {
                                            if (
                                              addressStates.selectedProvince
                                                .name !== province.name
                                            ) {
                                              e.target.style.backgroundColor =
                                                '#f9f9f9';
                                            }
                                          }}
                                          onMouseLeave={(e) => {
                                            if (
                                              addressStates.selectedProvince
                                                .name !== province.name
                                            ) {
                                              e.target.style.backgroundColor =
                                                'transparent';
                                            }
                                          }}
                                        >
                                          {province.name}
                                        </div>
                                      ),
                                    )}

                                  {addressStates.selectedPlace ===
                                    'Quận/Huyện' &&
                                    addressStates.communes.map(
                                      (commune, index) => (
                                        <div
                                          key={index}
                                          onClick={() =>
                                            handleCommuneSelect(commune, key)
                                          }
                                          style={{
                                            padding: '8px 12px',
                                            margin: '4px 0',
                                            borderRadius: 6,
                                            fontSize: 14,
                                            backgroundColor:
                                              addressStates.selectedCommune
                                                .name === commune.name
                                                ? '#f6f6f6'
                                                : 'transparent',
                                            transition: 'background-color 0.2s',
                                          }}
                                          onMouseEnter={(e) => {
                                            if (
                                              addressStates.selectedCommune
                                                .name !== commune.name
                                            ) {
                                              e.target.style.backgroundColor =
                                                '#f9f9f9';
                                            }
                                          }}
                                          onMouseLeave={(e) => {
                                            if (
                                              addressStates.selectedCommune
                                                .name !== commune.name
                                            ) {
                                              e.target.style.backgroundColor =
                                                'transparent';
                                            }
                                          }}
                                        >
                                          {commune.name}
                                        </div>
                                      ),
                                    )}
                                </div>
                              </div>
                            )}
                          </div>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          {...restField}
                          name={[name, 'default']}
                          valuePropName="checked"
                          style={{ marginBottom: 0 }}
                        >
                          <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ addressDetail: '', default: false })}
                    block
                    icon={<PlusOutlined />}
                    style={{
                      borderRadius: 8,
                      height: 40,
                      borderStyle: 'dashed',
                      borderColor: '#1890ff',
                      color: '#1890ff',
                    }}
                  >
                    Thêm địa chỉ mới
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider orientation="left">
            <span style={{ color: '#1890ff', fontWeight: 600 }}>
              Phân loại & Trạng thái
            </span>
          </Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="userType" label="Loại người dùng">
                <Select
                  placeholder="Chọn loại người dùng"
                  size="large"
                  style={{ borderRadius: 8 }}
                  allowClear
                >
                  <Option value="GUEST">
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <Text color="default">GUEST</Text>
                      <span>Khách</span>
                    </div>
                  </Option>
                  <Option value="NEW">
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <Text color="green">NEW</Text>
                      <span>Khách hàng mới</span>
                    </div>
                  </Option>
                  <Option value="MEMBER">
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <Text color="blue">MEMBER</Text>
                      <span>Thành viên</span>
                    </div>
                  </Option>
                  <Option value="VIP">
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <Text color="gold">VIP</Text>
                      <span>Khách VIP</span>
                    </div>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Trạng thái hoạt động"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Hoạt động"
                  unCheckedChildren="Tạm khóa"
                  size="default"
                  style={{ backgroundColor: '#52c41a' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
