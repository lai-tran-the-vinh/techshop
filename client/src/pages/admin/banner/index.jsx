import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
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
  Flex,
  Image,
  Tooltip,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  AppstoreOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

import ModalBanner from '@/components/admin/banner/modalBanner';
import { callDeleteBanners, callFetchBanners } from '@/services/apis';
import dayjs from 'dayjs';

const { Title } = Typography;
export const BannerPosition = {
  HOME_MAIN: 'HOME_MAIN',
  HOME_PROMO: 'HOME_PROMO',
  HOME_FEATURE: 'HOME_FEATURE',
  HORIZONTAL_BANNER: 'HORIZONTAL_BANNER',
  CATEGORY_TOP: 'CATEGORY_TOP',
  CATEGORY_SIDEBAR: 'CATEGORY_SIDEBAR',
  PRODUCT_DETAIL_TOP: 'PRODUCT_DETAIL_TOP',
  PRODUCT_DETAIL_BOTTOM: 'PRODUCT_DETAIL_BOTTOM',
  CART_PAGE: 'CART_PAGE',
  CHECKOUT_PAGE: 'CHECKOUT_PAGE',
  FOOTER_BANNER: 'FOOTER_BANNER',
  SIDEBAR_BANNER: 'SIDEBAR_BANNER',
};

export const BannerPositionLabels = {
  [BannerPosition.HOME_MAIN]: 'Trang chủ - Banner chính (1200 x 600px)',
  [BannerPosition.HOME_PROMO]: 'Trang chủ - Khuyến mãi (600 x 400px)',
  [BannerPosition.HOME_FEATURE]: 'Trang chủ - Nổi bật',
  [BannerPosition.HORIZONTAL_BANNER]: 'Trang chủ - Banner ngang (1200 x 300px)',
  [BannerPosition.CATEGORY_TOP]: 'Danh mục - Đầu trang',
  [BannerPosition.CATEGORY_SIDEBAR]: 'Danh mục - Cột bên',
  [BannerPosition.PRODUCT_DETAIL_TOP]: 'Chi tiết SP - Đầu trang',
  [BannerPosition.PRODUCT_DETAIL_BOTTOM]: 'Chi tiết SP - Cuối trang',
  [BannerPosition.CART_PAGE]: 'Trang Giỏ hàng',
  [BannerPosition.CHECKOUT_PAGE]: 'Trang Thanh toán',
  [BannerPosition.FOOTER_BANNER]: 'Banner cuối trang (Footer)',
  [BannerPosition.SIDEBAR_BANNER]: 'Banner cột bên (Chung)',
};

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [dataInit, setDataInit] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await callFetchBanners();
      setBanners(res.data.data);
    } catch (err) {
      message.error('Lỗi khi tải banner');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Quản lý banner';
  }, []);

  useEffect(() => {
    fetchBanners();
  }, []);

  const filteredData = banners.filter((item) =>
    item.title?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleBulkDelete = async () => {
    try {
      setLoading(true);
      await Promise.all(selectedRowKeys.map((id) => callDeleteBanners(id)));
      setLoading(false);
      message.success(`Đã xóa ${selectedRowKeys.length} banner thành công`);
      setSelectedRowKeys([]);
      setSelectedRows([]);
      setOpenModalDelete(false);
      reloadTable();
    } catch (error) {
      console.error('Failed to delete :', error);
      message.error('Xóa thất bại');
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'image',
      width: 120,
      render: (imageUrl) => (
        <Image
          width={80}
          height={40}
          src={imageUrl}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          preview={{ mask: <EyeOutlined /> }}
        />
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
      render: (position) => BannerPositionLabels[position] || position,
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
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => (a.priority || 0) - (b.priority || 0),
      render: (priority) => priority || 1,
    },
    {
      title: 'Thời gian',
      key: 'duration',
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <div>
            Từ:{' '}
            {record.startDate
              ? dayjs(record.startDate).format('DD/MM/YYYY')
              : '--'}
          </div>
          <div>
            Đến:{' '}
            {record.endDate ? dayjs(record.endDate).format('DD/MM/YYYY') : '--'}
          </div>
        </div>
      ),
    },
    {
      title: 'Thống kê',
      key: 'stats',
      render: (_, record) => {
        const clicks = record.clicks || 0;
        const impressions = record.impressions || 0;

        return (
          <div style={{ fontSize: '12px' }}>
            <div>
              Clicks: <strong>{clicks}</strong>
            </div>
            <div>
              Views: <strong>{impressions}</strong>
            </div>
          </div>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, rows) => {
      setSelectedRowKeys(keys);
      setSelectedRows(rows);
    },
  };

  return (
    <div>
      <Modal
        title="Xác nhận xóa"
        open={openModalDelete}
        onOk={handleBulkDelete}
        onCancel={() => setOpenModalDelete(false)}
        okButtonProps={{ danger: true }}
        okText="Xóa"
        cancelText="Hủy"
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ExclamationCircleOutlined style={{ color: 'red', marginRight: 8 }} />
          <span>Bạn có chắc muốn xóa {selectedRowKeys.length} banner?</span>
        </div>
      </Modal>

      <div className="mb-12 lg:mb-16">
        <div className="text-[28px] md:text-[32px] font-semibold text-[#111827]! m-0! leading-tight">
          Quản lý Banner
        </div>
        <div className="text-[14px] md:text-[16px] text-[#6b7280]! mt-2!">
          Quản lý các banner hiển thị trên website.
          {searchText ? (
            <>
              {' '}
              Hiển thị: <strong>{filteredData.length}</strong> /{' '}
              <strong>{banners.length}</strong> banner
            </>
          ) : (
            <>
              {' '}
              Tổng cộng: <strong>{banners.length}</strong> banner
            </>
          )}
        </div>
      </div>

      <Card
        style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
      >
        <Row
          justify="space-between"
          align="middle"
          gutter={[16, 16]}
          style={{ marginBottom: 16 }}
        >
          <Col xs={24} md={10} lg={8}>
            <Input
              placeholder="Tìm kiếm banner..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ borderRadius: 8 }}
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
                  setDataInit(null);
                }}
              >
                Thêm banner
              </Button>

              <Button
                icon={<EditOutlined />}
                disabled={selectedRowKeys.length !== 1}
                onClick={() => {
                  setDataInit(selectedRows[0]);
                  setOpenModal(true);
                }}
              >
                Sửa ({selectedRowKeys.length})
              </Button>

              <Button
                danger
                icon={<DeleteOutlined />}
                disabled={selectedRowKeys.length === 0}
                onClick={() => setOpenModalDelete(true)}
              >
                Xóa ({selectedRowKeys.length})
              </Button>
            </Flex>
          </Col>
        </Row>

        <Divider />

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          rowSelection={rowSelection}
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            total: filteredData.length,
            showTotal: (total) => `Tổng cộng ${total} banner`,
          }}
        />
      </Card>

      <ModalBanner
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={fetchBanners}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </div>
  );
};

export default BannerManagement;
