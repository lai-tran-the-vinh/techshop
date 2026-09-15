import React, { useEffect, useState } from 'react';
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
  Tag,
  Flex,
  Modal,
  Empty,
  Form,
  Space,
  Popconfirm,
  Select,
  Switch,
  Badge,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SafetyOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import {
  callFetchPermission,
  callDeletePermission,
  callUpdatePermission,
  callCreatePermission,
} from '@/services/apis';

import { useAppContext } from '@/contexts';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const PermissionsManagement = () => {
  const [form] = Form.useForm();
  const [permissions, setPermissions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [dataInit, setDataInit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [filters, setFilters] = useState({
    module: undefined,
    action: undefined,
    status: undefined,
  });
  const { message } = useAppContext();

  useEffect(() => {
    document.title = 'Quản lý quyền hạn';
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await callFetchPermission();
      setPermissions(response.data.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedRowKeys.map((id) => callDeletePermission(id)));
      message.success(`Đã xóa ${selectedRowKeys.length} permission thành công`);
      setSelectedRowKeys([]);
      setSelectedRows([]);
      setOpenModalDelete(false);
      fetchPermissions();
    } catch (error) {
      console.error('Failed to delete permissions:', error);
    }
  };

  const reloadTable = async () => {
    setLoading(true);
    try {
      const response = await callFetchPermission();
      setPermissions(response.data.data);
    } catch (error) {
      console.error('Failed to reload permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllFilters = () => {
    setSearchText('');
    setFilters({
      module: undefined,
      action: undefined,
      status: undefined,
    });
  };

  const hasActiveFilters = () => {
    return searchText || filters.module || filters.action || filters.status;
  };

  useEffect(() => {
    if (dataInit?._id) {
      form.setFieldsValue({
        _id: dataInit._id,
        name: dataInit.name,
        action: dataInit.action,
        module: dataInit.module,
        description: dataInit.description,
        isActive: dataInit.isActive,
      });
    } else {
      form.resetFields();
    }
  }, [dataInit]);

  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch = searchText
      ? permission.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        permission.description
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        permission.module?.toLowerCase().includes(searchText.toLowerCase()) ||
        permission.action?.toLowerCase().includes(searchText.toLowerCase())
      : true;

    const matchesModule = filters.module
      ? permission.module?.toLowerCase() === filters.module.toLowerCase()
      : true;

    const matchesAction = filters.action
      ? permission.action?.toLowerCase() === filters.action.toLowerCase()
      : true;

    const matchesStatus =
      filters.status !== undefined
        ? permission.isActive === filters.status
        : true;

    return matchesSearch && matchesModule && matchesAction && matchesStatus;
  });

  const columns = [
    {
      title: 'Tên Permission',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <code
          style={{
            backgroundColor: '#f6f8fa',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          {text}
        </code>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      render: (text) => (
        <Tag
          color={
            text === 'create'
              ? 'green'
              : text === 'update'
                ? 'blue'
                : text === 'delete'
                  ? 'red'
                  : text === 'read'
                    ? 'purple'
                    : 'default'
          }
        >
          {text}
        </Tag>
      ),
      sorter: (a, b) => a.action.localeCompare(b.action),
    },
    {
      title: 'Mô-đun',
      dataIndex: 'module',
      key: 'module',
      render: (text) => (
        <code
          style={{
            backgroundColor: '#f6f8fa',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          {text}
        </code>
      ),
      sorter: (a, b) => a.module.localeCompare(b.module),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <div
          style={{
            maxWidth: 400,
            overflow: 'auto',
            textOverflow: 'ellipsis',
          }}
        >
          {text ? (
            text.length > 100 ? (
              <Tooltip title={text}>{text.substring(0, 100)}...</Tooltip>
            ) : (
              text
            )
          ) : (
            <Text type="secondary" italic>
              No description
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) =>
        date
          ? new Date(date).toLocaleDateString('vi-VN')
          : new Date().toLocaleDateString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      key: 'isActive',
      align: 'center',
      render: (isActive) => (
        <Tooltip title={isActive ? 'Hoạt động' : 'Ngưng hoạt động'}>
          <Badge
            status={isActive ? 'success' : 'default'}
            text={isActive ? 'Hoạt động' : 'Ngưng hoạt động'}
          />
        </Tooltip>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          size="small"
          style={{ padding: 0 }}
          onClick={() => {
            setSelectedPermission(record);
            setPreviewVisible(true);
          }}
        />
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      setSelectedRowKeys(selectedKeys);
      setSelectedRows(selectedRows);
    },
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (dataInit) {
        await callUpdatePermission({
          _id: dataInit._id,
          name: values.name,
          action: values.action,
          module: values.module,
          description: values.description,
          isActive: values.isActive,
        });
        message.success('Cập nhật permission thành công');
      } else {
        await callCreatePermission({
          name: values.name,
          description: values.description,
          action: values.action,
          module: values.module,
          isActive: values.isActive ?? true,
        });
      }

      handleCancel();
      reloadTable();
    } catch (error) {
      console.error('Failed to save permission:', error);
      message.error('Lưu quyền thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setOpenModal(false);
    setDataInit(null);
  };

  const moduleOptions = [
    { label: 'Sản phẩm', value: 'product' },
    { label: 'Danh mục', value: 'category' },
    { label: 'Đơn hàng', value: 'order' },
    { label: 'Người dùng', value: 'user' },
    { label: 'Vai trò', value: 'role' },
    { label: 'Quyền', value: 'permission' },
    { label: 'Kho', value: 'inventory' },
    { label: 'Banner', value: 'banner' },
    { label: 'Thanh toán', value: 'payment' },
    { label: 'Khuyến mãi', value: 'promotion' },
    { label: 'Chi nhánh', value: 'branch' },
    { label: 'Thương hiệu', value: 'brand' },
    { label: 'Chuyển kho', value: 'transfer' },
    { label: 'Quyền lợi', value: 'benefit' },
    { label: 'Chuyển động hàng hóa', value: 'stockmovement' },
  ];

  const actionOptions = [
    { label: 'Xem', value: 'read' },
    { label: 'Tạo', value: 'create' },
    { label: 'Cập Nhật', value: 'update' },
    { label: 'Xóa', value: 'delete' },
  ];

  const statusOptions = [
    { label: 'Hoạt động', value: true },
    { label: 'Ngưng hoạt động', value: false },
  ];

  return (
    <div className="min-h-screen px-8 py-6 sm:px-12 sm:py-8 lg:px-16 lg:py-10 max-w-7xl mx-auto">
      <Modal
        title="Xóa quyền"
        open={openModalDelete}
        onCancel={() => setOpenModalDelete(false)}
        onOk={handleBulkDelete}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        style={{ top: 20, zIndex: 9999 }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}
        >
          <ExclamationCircleOutlined
            style={{ color: '#ff4d4f', fontSize: 22, marginRight: 8 }}
          />
          <span style={{ fontSize: 16, fontWeight: 500 }}>
            Xác nhận xóa quyền
          </span>
        </div>
        <div style={{ paddingLeft: 30 }}>
          <p style={{ margin: 0, color: '#666' }}>
            Bạn có chắc chắn muốn xóa quyền đã chọn không?
          </p>
        </div>
      </Modal>

      <div className="mb-12 lg:mb-16">
        <div className="text-[28px] md:text-[32px] font-semibold text-[#111827]! m-0! leading-tight">
          Quản lý quyền hạn
        </div>
        <div className="text-[14px] md:text-[16px] text-[#6b7280]! mt-2!">
          Quản lý các quyền hạn trong hệ thống.
          {hasActiveFilters() ? (
            <>
              {' '}Hiển thị: <strong>{filteredPermissions.length}</strong> /{' '}
              <strong>{permissions.length}</strong> quyền
            </>
          ) : (
            <>
              {' '}Tổng cộng: <strong>{permissions.length}</strong> quyền
            </>
          )}
        </div>
      </div>

      <Card>

        <Row
          justify="space-between"
          align="middle"
          gutter={[16, 16]}
          style={{ marginBottom: 16 }}
        >
          <Col xs={24} md={10} lg={8}>
            <Input
              placeholder="Tìm kiếm quyền, mô tả..."
              prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{
                borderRadius: 8,
                border: `1px solid #CBD5E1`,
              }}
            />
          </Col>
          <Col xs={24} md={14} lg={16}>
            <Flex gap={8} wrap="wrap" className="justify-start md:justify-end mt-3 md:mt-0">
              <Select
                showSearch
                placeholder="Mô đun"
                value={filters.module}
                onChange={(value) => setFilters({ ...filters, module: value })}
                allowClear
                style={{ width: 130 }}
                suffixIcon={<FilterOutlined />}
              >
                {moduleOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
              <Select
                placeholder="Thao tác"
                value={filters.action}
                onChange={(value) => setFilters({ ...filters, action: value })}
                allowClear
                style={{ width: 130 }}
                suffixIcon={<FilterOutlined />}
              >
                {actionOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
              <Select
                placeholder="Trạng thái"
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
                allowClear
                style={{ width: 130 }}
                suffixIcon={<FilterOutlined />}
              >
                {statusOptions.map((option) => (
                  <Select.Option key={String(option.value)} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
              {hasActiveFilters() && (
                <Button
                  icon={<ClearOutlined />}
                  onClick={clearAllFilters}
                  className="shadow-none"
                >
                  Xóa bộ lọc
                </Button>
              )}
            </Flex>
          </Col>
        </Row>

        <Row justify="end" align="middle" style={{ marginBottom: 16 }}>
          <Col xs={24}>
            <Flex gap={8} wrap="wrap" className="justify-start md:justify-end mt-3 md:mt-0">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="shadow-none"
                onClick={() => {
                  setDataInit(null);
                  setOpenModal(true);
                }}
              >
                Tạo quyền mới
              </Button>
              <Button
                type="primary"
                disabled={selectedRowKeys.length !== 1}
                icon={<EditOutlined />}
                className="shadow-none"
                onClick={() => {
                  setDataInit(selectedRows[0]);
                  setOpenModal(true);
                }}
              >
                Sửa ({selectedRowKeys.length})
              </Button>

              <Button
                danger
                className="shadow-none"
                onClick={() => setOpenModalDelete(true)}
                disabled={selectedRowKeys.length === 0}
                icon={<DeleteOutlined />}
              >
                Xóa ({selectedRowKeys.length})
              </Button>

              <Button
                icon={<ReloadOutlined />}
                className="shadow-none"
                onClick={reloadTable}
                loading={loading}
              >
                Làm mới
              </Button>
            </Flex>
          </Col>
        </Row>

          <Table
          loading={loading}
          rowKey={(record) => record._id}
          rowSelection={rowSelection}
          dataSource={filteredPermissions}
          columns={columns}
          bordered
          size="middle"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: (
              <Empty
                description={
                  hasActiveFilters()
                    ? 'Không tìm thấy permission nào phù hợp với bộ lọc'
                    : 'Không tìm thấy permission nào'
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      <Modal
        title={selectedPermission?.name}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="back" onClick={() => setPreviewVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setDataInit(selectedPermission);
              setOpenModal(true);
              setPreviewVisible(false);
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={600}
      >
        {selectedPermission && (
          <div>
            <div style={{ width: '100%' }}>
              <Title level={5}>Tên Quyền</Title>
              <code
                style={{
                  backgroundColor: '#f6f8fa',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'block',
                  marginBottom: 16,
                }}
              >
                {selectedPermission.name}
              </code>
            </div>
            <div style={{ width: '100%' }}>
              <Title level={5}>Thao tác</Title>
              <Tag
                color={
                  selectedPermission.action === 'create'
                    ? 'green'
                    : selectedPermission.action === 'update'
                      ? 'blue'
                      : selectedPermission.action === 'delete'
                        ? 'red'
                        : selectedPermission.action === 'read'
                          ? 'purple'
                          : 'default'
                }
                style={{ fontSize: '14px', padding: '4px 12px' }}
              >
                {selectedPermission.action}
              </Tag>
            </div>
            <div style={{ width: '100%', marginTop: 16 }}>
              <Title level={5}>Module</Title>
              <code
                style={{
                  backgroundColor: '#f6f8fa',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'block',
                  marginBottom: 16,
                }}
              >
                {selectedPermission.module}
              </code>
            </div>
            <div style={{ width: '100%' }}>
              <Title level={5}>Trạng thái</Title>
              <Tag
                color={selectedPermission.isActive ? 'green' : 'red'}
                style={{ fontSize: '14px', padding: '4px 12px' }}
              >
                {selectedPermission.isActive ? 'Hoạt động' : 'Ngưng hoạt động'}
              </Tag>
            </div>
            <div style={{ width: '100%', marginTop: 16 }}>
              <Title level={5}>Mô tả</Title>
              <Paragraph>
                {selectedPermission.description || 'Không có mô tả.'}
              </Paragraph>
            </div>
            <div style={{ width: '100%' }}>
              <Title level={5}>Ngày tạo</Title>
              <Text>
                {selectedPermission.createdAt
                  ? new Date(selectedPermission.createdAt).toLocaleDateString(
                      'vi-VN',
                    )
                  : new Date().toLocaleDateString('vi-VN')}
              </Text>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={dataInit ? 'Cập nhật quyền' : 'Tạo quyền mới'}
        open={openModal}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
          >
            {dataInit ? 'Cập nhật' : 'Tạo mới'}
          </Button>,
        ]}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          initialValues={{ isActive: true }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tên Quyền"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên quyền!',
                  },
                ]}
              >
                <Input placeholder="Nhập tên quyền" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Thao tác"
                name="action"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn thao tác!',
                  },
                ]}
              >
                <Select placeholder="Chọn thao tác">
                  {actionOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Mô-đun"
                name="module"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn mô-đun!',
                  },
                ]}
              >
                <Select showSearch placeholder="Chọn mô-đun">
                  {moduleOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Trạng thái"
                name="isActive"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Hoạt động"
                  unCheckedChildren="Ngưng hoạt động"
                  defaultChecked={true}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mô tả!',
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Mô tả chức năng của permission"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionsManagement;
