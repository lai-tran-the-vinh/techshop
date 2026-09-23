import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Tag,
  Typography,
  Divider,
  Select,
  Flex,
  Tooltip,
  Badge,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShopOutlined,
  SearchOutlined,
  AppstoreOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  callDeleteBranch,
  callFetchBranches,
  callUpdateBranch,
} from '@/services/apis';
import ModalBranch from '@/components/admin/branch';

const { Title } = Typography;
const { TextArea } = Input;

const BranchManagement = () => {
  const [branches, setBranches] = useState([{}]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [dataInit, setDataInit] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Quản lý chi nhánh';
  }, []);

  const FetchBranchs = async () => {
    setLoading(true);
    try {
      const res = await callFetchBranches();
      setBranches(res.data.data);
      setLoading(false);
      message.success('Lấy danh sách chi nhánh thành công!');
    } catch (error) {
      setLoading(false);
      message.error('Lấy danh sách chi nhánh thất bại!');
    }
  };
  useEffect(() => {
    FetchBranchs();
  }, []);

  const handleBulkDelete = async () => {
    try {
      setLoading(true);
      await Promise.all(selectedRowKeys.map((id) => callDeleteBranch(id)));
      setLoading(false);
      message.success(`Đã xóa ${selectedRowKeys.length} chi nhánh thành công`);
      setSelectedRowKeys([]);
      setSelectedRows([]);
      setOpenModalDelete(false);
      reloadTable();
    } catch (error) {
      console.error('Failed to delete :', error);
      message.error('Xóa thất bại');
    }
  };

  const reloadTable = async () => {
    setLoading(true);
    try {
      const response = await callFetchBranches();
      setBranches(response.data.data);
      message.success('refreshed successfully');
    } catch (error) {
      console.error('Failed to reload :', error);
      message.error('Failed to refresh');
    } finally {
      setLoading(false);
    }
  };

  const filteredBranch = branches.filter(
    (branch) =>
      branch.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      branch.address?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns = [
    {
      title: 'Tên chi nhánh',
      dataIndex: 'name',
      key: 'name',
      render: (name) => (
        <Tooltip title={name}>
          <div
            style={{
              maxWidth: 150,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {name}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (address) => (
        <Tooltip title={address}>
          <div
            style={{
              maxWidth: 150,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {address}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => (
        <Tooltip title={phone}>
          <div
            style={{
              maxWidth: 150,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {phone}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Tooltip title={email}>
          <div
            style={{
              maxWidth: 150,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {email}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Quản lý',
      dataIndex: 'manager',
      key: 'manager',
      render: (manager) => (
        <Tooltip title={manager?.name || 'Không có'}>
          <div
            style={{
              maxWidth: 150,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {manager?.name || 'Không có'}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 150,
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
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      setSelectedRowKeys(selectedKeys);
      setSelectedRows(selectedRows);
    },
  };

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-60px)] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 py-6 sm:px-12 sm:py-8 lg:px-16 lg:py-10 max-w-7xl mx-auto">
      <Modal
        title="Xóa danh mục"
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
            Xác nhận xóa chi nhánh này
          </span>
        </div>
        <div style={{ paddingLeft: 30 }}>
          <p style={{ margin: 0, color: '#666' }}>
            Bạn có chắc chắn muốn xóa chi nhánh đã chọn không? Hành động này
            không thể hoàn tác.
          </p>
        </div>
      </Modal>

      <div className="mb-12 lg:mb-16">
        <div className="text-[28px] md:text-[32px] font-semibold text-[#111827]! m-0! leading-tight">
          Quản lý chi nhánh
        </div>
        <div className="text-[14px] md:text-[16px] text-[#6b7280]! mt-2!">
          Danh sách và thông tin liên hệ của các chi nhánh trong hệ thống
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
              placeholder="Tìm kiếm danh mục..."
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
            <Flex
              gap={8}
              wrap="wrap"
              className="justify-start md:justify-end mt-3 md:mt-0"
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                Thêm chi nhánh
              </Button>

              <Button
                type="primary"
                disabled={selectedRowKeys.length !== 1}
                icon={<EditOutlined />}
                onClick={() => {
                  setDataInit(selectedRows[0]);
                  setOpenModal(true);
                }}
              >
                Sửa ({selectedRowKeys.length})
              </Button>

              <Button
                danger
                onClick={() => {
                  setOpenModalDelete(true);
                }}
                disabled={selectedRowKeys.length === 0}
                icon={<DeleteOutlined />}
              >
                Xóa ({selectedRowKeys.length})
              </Button>
            </Flex>
          </Col>
        </Row>

        <Divider />

        <Table
          columns={columns}
          dataSource={filteredBranch}
          bordered
          rowKey={(record) => record._id}
          rowSelection={rowSelection}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            total: branches.length,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} chi nhánh`,
          }}
          scroll={{ x: 'max-content' }}
        />
        <ModalBranch
          openModal={openModal}
          setOpenModal={setOpenModal}
          reloadTable={reloadTable}
          dataInit={dataInit}
          setDataInit={setDataInit}
          visible={openModal}
        />
      </Card>
    </div>
  );
};

export default BranchManagement;
