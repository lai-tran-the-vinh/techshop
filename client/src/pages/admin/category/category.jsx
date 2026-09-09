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
  Image,
  Badge,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  AppstoreOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { callDeleteCategory, callFetchCategories } from '@/services/apis';
import ModalCategory from '@/components/admin/category';

const { Title, Text } = Typography;
const { Search } = Input;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [dataInit, setDataInit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [openModalDelete, setOpenModalDelete] = useState(false);

  useEffect(() => {
    document.title = 'Quản lý danh mục';
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await callFetchCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedRowKeys.map((id) => callDeleteCategory(id)));
      message.success(`Đã xóa ${selectedRowKeys.length} danh mục thành công`);
      setSelectedRowKeys([]);
      setSelectedRows([]);
      setOpenModalDelete(false);
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete categories:', error);
      message.error('Xóa thất bại');
    }
  };

  const reloadTable = async () => {
    setLoading(true);
    try {
      const response = await callFetchCategories();
      setCategories(response.data.data);
      message.success('Categories refreshed successfully');
    } catch (error) {
      console.error('Failed to reload categories:', error);
      message.error('Failed to refresh categories');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      render: (text) => (
        <Image src={text} alt="Category Logo" style={{ width: 80 }} />
      ),
      key: 'logo',
      width: 90,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) =>
        text ? (
          text.length > 100 ? (
            <Tooltip title={text}>{text.substring(0, 100)}...</Tooltip>
          ) : (
            text
          )
        ) : (
          <Text type="secondary" italic>
            No description
          </Text>
        ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
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
            Xác nhận xóa danh mục
          </span>
        </div>
        <div style={{ paddingLeft: 30 }}>
          <p style={{ margin: 0, color: '#666' }}>
            Bạn có chắc chắn muốn xóa danh mục đã chọn không? Hành động này
            không thể hoàn tác.
          </p>
        </div>
      </Modal>

      <div className="mb-12 lg:mb-16">
        <div className="text-[28px] md:text-[32px] font-semibold text-[#111827]! m-0! leading-tight">
          Quản lý danh mục
        </div>
        <div className="text-[14px] md:text-[16px] text-[#6b7280]! mt-2!">
          Danh sách và hệ thống phân loại nhóm hàng hóa, sản phẩm
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
            <Flex gap={8} wrap="wrap" justify="end">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                Thêm danh mục
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

        <Table
          loading={loading}
          rowKey={(record) => record._id}
          rowSelection={rowSelection}
          dataSource={filteredCategories}
          columns={columns}
          bordered
          size="middle"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `Total ${total} categories`,
          }}
          scroll={{ x: 'max-content' }}
        />

        <ModalCategory
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

export default CategoryManagement;
