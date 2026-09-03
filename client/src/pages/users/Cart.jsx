import {
  Tag,
  Row,
  Col,
  Card,
  Flex,
  Spin,
  Image,
  Table,
  Empty,
  Modal,
  Button,
  Divider,
  Tooltip,
  Typography,
  InputNumber,
  Space,
} from 'antd';
import { Link } from 'react-router-dom';
import CartServices from '@services/carts';
import { useAppContext } from '@/contexts';
import React, { useEffect, useState } from 'react';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import Recomment from '@/services/recommend';
import { PreviewListProducts } from '@components/products';

function Cart() {
  const { Title, Text } = Typography;
  const [open, setOpen] = useState(false);
  const { message, user } = useAppContext();
  const [modalText, setModalText] = useState();
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteType, setDeleteType] = useState('item');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [recommentProducts, setRecommentProducts] = useState([]);

  const getCart = async () => {
    try {
      const response = await CartServices.get();
      if (response.status === 200) {
        setCartData(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      message.error('Không thể lấy giỏ hàng!');
      console.error('Lỗi khi lấy giỏ hàng:', error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Giỏ hàng';
    
    const fetchRecommendations = async () => {
      try {
        if (user) {
          const res = await Recomment.getRecommendationsByUser(user._id);
          setRecommentProducts(res);
        } else {
          const res = await Recomment.getRecommendationsPopular();
          setRecommentProducts(res);
        }
      } catch (error) {
        console.error('Lỗi lấy gợi ý:', error);
      }
    };
    fetchRecommendations();
  }, [user]);

  // Fixed: Update quantity function
  const updateQuantity = async (productId, variantId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const updatedCartData = {
        ...cartData,
        items: cartData.items.map((item) =>
          item.product._id === productId && item.variant._id === variantId
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      };

      setCartData(updatedCartData);
      const response = await CartServices.update(
        cartData._id,
        updatedCartData.items,
      );

      if (response.status === 200) {
        await getCart();
      } else {
        // Revert on failure
        await getCart();
        message.error('Cập nhật số lượng thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
      // Revert on error
      await getCart();
      message.error('Không thể cập nhật số lượng sản phẩm');
    }
  };

  const handleRemoveItems = async (productId, variantId) => {
    try {
      setConfirmLoading(true);
      const cartServices = new CartServices();
      const response = await cartServices.deleteOne(productId, variantId);
      if (response.status === 200) {
        await getCart();
        message.destroy();
        message.success('Xóa sản phẩm khỏi giỏ hàng thành công');
        setOpen(false);
        setConfirmLoading(false);
        return;
      }
      throw new Error('Xóa sản phẩm khỏi giỏ hàng thất bại');
    } catch (error) {
      message.error('Xóa sản phẩm khỏi giỏ hàng thất bại');
      console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
      setConfirmLoading(false);
    }
  };

  const handleRemoveAllItems = async (userId) => {
    try {
      setConfirmLoading(true);
      const cartServices = new CartServices();
      const response = await cartServices.delete(userId);
      if (response.status === 200) {
        await getCart();
        setSelectedRowKeys([]);
        message.destroy();
        message.success('Xóa tất cả sản phẩm khỏi giỏ hàng thành công');
        setOpen(false);
        setConfirmLoading(false);
        return;
      }
      throw new Error('Xóa tất cả sản phẩm khỏi giỏ hàng thất bại');
    } catch (error) {
      message.destroy();
      message.error('Xóa tất cả sản phẩm khỏi giỏ hàng thất bại');
      console.error('Lỗi khi xóa tất cả sản phẩm khỏi giỏ hàng:', error);
      setConfirmLoading(false);
    }
  };

  const showModal = () => {
    setOpen(true);
    if (deleteType === 'item')
      setModalText('Bạn có chắc chắn muốn xóa sản phẩm này không?');

    if (deleteType === 'all')
      setModalText(
        'Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng không?',
      );
  };

  const handleOk = () => {
    if (deleteType === 'item')
      handleRemoveItems(deleteItem.product._id, deleteItem.variant._id);

    if (deleteType === 'all') {
      handleRemoveAllItems(user._id);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // Fixed: Access cartData.items
  const cartItems = cartData?.items || [];

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0,
  );
  const shippingFee = 0;

  const calculateDiscountedPrice = (item) => {
    const originalPrice = item?.variant?.price * item.quantity;
    const discountAmount =
      originalPrice * ((item.product?.discount || 0) / 100);
    return originalPrice - discountAmount;
  };

  const variantItem = cartItems.map((item) => {
    const selectedColor = item.variant?.color?.find(
      (color) => color.colorName === item.color,
    );
    return {
      ...item,
      color: selectedColor,
    };
  });

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: '35%',
      render: (_, item) => {
        return (
          <div className="flex items-center  gap-3 ">
            <div className=" bg-gray-100 my-2.5 rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src={item?.color?.images?.[0] || '/placeholder-image.jpg'}
                alt={item?.variant?.name}
                width={64}
                height={64}
                className="object-cover"
                fallback="/placeholder-image.jpg"
              />
            </div>
            <div className="flex-1">
              <Link to={`/product/${item.product._id}`}>
                <Space direction="vertical" className="p-0! ">
                  <Text className="text-gray-900 font-medium line-clamp-1 text-base hover:text-blue-600 hover:underline cursor-pointer">
                    {item?.product?.name}
                  </Text>
                  <Text type="secondary" className="text-gray-500 text-sm mt-1">
                    {item?.variant?.name}
                  </Text>
                </Space>
              </Link>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      width: '20%',
      render: (_, item) => (
        <div className="text-center">
          <Text className="text-gray-900 font-medium text-base">
            {`${item?.variant?.price?.toLocaleString()}₫`}
          </Text>
        </div>
      ),
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      align: 'center',
      width: '25%',
      render: (_, item) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="small"
            icon={<MinusOutlined />}
            onClick={() =>
              updateQuantity(
                item.product._id,
                item.variant._id,
                item.quantity - 1,
              )
            }
            disabled={item.quantity <= 1}
            className="flex items-center justify-center w-8 h-8"
          />
          <InputNumber
            min={1}
            value={item.quantity}
            onChange={(value) =>
              updateQuantity(item.product._id, item.variant._id, value)
            }
            className="w-16 text-center"
            controls={false}
          />
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() =>
              updateQuantity(
                item.product._id,
                item.variant._id,
                item.quantity + 1,
              )
            }
            className="flex items-center justify-center w-8 h-8"
          />
        </div>
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      align: 'center',
      width: '15%',
      render: (_, item) => {
        const discountedPrice = calculateDiscountedPrice(item);
        const originalPrice = item?.variant?.price * item.quantity;

        return (
          <div className="text-center">
            <Text className="text-gray-900 font-semibold text-base">
              {`${discountedPrice?.toLocaleString()}₫`}
            </Text>
            {(item.product?.discount || 0) > 0 && (
              <div className="text-xs text-gray-500 line-through mt-1">
                {`${originalPrice?.toLocaleString()}₫`}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Xóa',
      key: 'action',
      align: 'center',
      width: '5%',
      render: (_, item) => (
        <Tooltip title="Xóa sản phẩm">
          <Button
            icon={<DeleteOutlined />}
            danger
            type="text"
            onClick={() => {
              setDeleteType('item');
              showModal();
              setDeleteItem(item);
            }}
            className="hover:bg-red-50"
          />
        </Tooltip>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex justify-center items-center">
        <div className="text-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-lg:p-0 lg:px-6 lg:py-8 lg:mt-24 w-full">
      <Modal
        centered
        open={open}
        okText="Xóa"
        title={
          <div className="flex items-center gap-2">
            <DeleteOutlined className="text-red-500" />
            <span>Xác nhận xóa</span>
          </div>
        }
        cancelText="Hủy"
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        okButtonProps={{ danger: true }}
      >
        <p className="text-gray-700 py-4">{modalText}</p>
      </Modal>

      {/* Fixed: Check cartItems length instead of cartData */}
      {cartItems.length === 0 || !cartData ? (
        <div className="bg-white lg:rounded-xl max-lg:-mt-[60px] max-lg:pt-[100px] max-lg:pb-16 p-8 lg:p-20 flex flex-col lg:flex-row items-center justify-center lg:gap-[200px] gap-1 text-center lg:text-left w-full max-w-[1200px] mx-auto lg:my-8 relative z-0">
          {/* Mobile: Image first (order-1), Desktop: Image second (order-2) */}
          <div className="w-[300px] lg:w-[450px] order-1 lg:order-2">
            <Image
              className="w-full h-auto"
              preview={false}
              src="https://fptshop.com.vn/img/empty_cart.png?w=1920&q=75"
            />
          </div>
          
          <div className="flex flex-col gap-6 lg:gap-6 items-center lg:items-start order-2 lg:order-1 px-2 mt-2 lg:mt-0">
            <Title level={5} className="font-semibold! mb-0! text-[16px]! text-gray-800! lg:text-3xl!">
              Chưa có sản phẩm nào trong giỏ hàng
            </Title>
            <Text className="text-[#6b7280]! text-[13px]! lg:text-base!">
              Cùng mua sắm hàng ngàn sản phẩm tại TechShop nhé!
            </Text>
            <Link to="/" className="mt-4 lg:mt-4">
              <Button type="primary" className="rounded-full! h-[40px]! px-12! lg:h-[48px]! lg:px-14! bg-[#cb1c22]! hover:bg-[#a1161b]! border-none! text-[14px]! font-medium!">
                Mua hàng
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <Row gutter={[10, 10]} className="w-full! max-lg:px-2 max-lg:pt-4">
          <Col xs={24} lg={17}>
            <Card className="shadow-none! max-lg:px-0! max-lg:py-2!">
              <div className="flex justify-between items-center mb-6">
                <Flex
                  align="center"
                  justify="space-between"
                  className="w-full! max-lg:flex-col max-lg:items-start max-lg:gap-4"
                >
                  <Flex className="lg:mb-10!" align="center" gap={8}>
                    <Title
                      level={3}
                      className="text-gray-900! flex! items-center! mb-0! gap-3!"
                    >
                      <div>
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="black"
                        >
                          <path
                            d="M2.5 4.25C2.5 3.83579 2.83579 3.5 3.25 3.5H3.80826C4.75873 3.5 5.32782 4.13899 5.65325 4.73299C5.87016 5.12894 6.02708 5.58818 6.14982 6.00395C6.18306 6.00134 6.21674 6 6.2508 6H18.7481C19.5783 6 20.1778 6.79442 19.9502 7.5928L18.1224 14.0019C17.7856 15.1832 16.7062 15.9978 15.4779 15.9978H9.52977C8.29128 15.9978 7.2056 15.1699 6.87783 13.9756L6.11734 11.2045L4.85874 6.95578L4.8567 6.94834C4.701 6.38051 4.55487 5.85005 4.33773 5.4537C4.12686 5.0688 3.95877 5 3.80826 5H3.25C2.83579 5 2.5 4.66421 2.5 4.25ZM9 21C10.1046 21 11 20.1046 11 19C11 17.8954 10.1046 17 9 17C7.89543 17 7 17.8954 7 19C7 20.1046 7.89543 21 9 21ZM16 21C17.1046 21 18 20.1046 18 19C18 17.8954 17.1046 17 16 17C14.8954 17 14 17.8954 14 19C14 20.1046 14.8954 21 16 21Z"
                            fill="inherit"
                          ></path>
                        </svg>
                      </div>
                      Giỏ hàng của bạn
                    </Title>
                    <Text className="text-gray-600! mt-4! flex! items-center!">
                      {cartItems.length > 0
                        ? `${cartItems.length} sản phẩm`
                        : null}
                    </Text>
                  </Flex>
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    type="text"
                    onClick={() => {
                      setModalText(
                        'Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng không?',
                      );
                      setOpen(true);
                      setDeleteType('all');
                    }}
                    disabled={
                      !(
                        selectedRowKeys.length === cartItems.length &&
                        cartItems.length > 0
                      )
                    }
                    className="hover:bg-red-50"
                  >
                    Xóa tất cả
                  </Button>
                </Flex>
              </div>

              <Table
                columns={columns}
                pagination={false}
                dataSource={variantItem}
                bordered
                className="w-full! rounded-md!"
                scroll={{ x: 800 }}
                rowSelection={Object.assign({ type: 'checkbox' }, rowSelection)}
                locale={{
                  emptyText: <Empty description="Giỏ hàng trống" />,
                }}
              />
            </Card>
          </Col>

          <Col xs={24} lg={7}>
            <Card className="lg:sticky lg:top-24">
              <div className="mb-6">
                <Title level={4} className="text-gray-900 font-semibold mb-0">
                  Tóm tắt đơn hàng
                </Title>
              </div>

              <div className="space-y-4">
                <Flex justify="space-between" align="center" className="mb-6!">
                  <Text className="text-gray-600! text-sm!">Tạm tính</Text>
                  <Text className="text-lg! font-medium!">
                    {total?.toLocaleString()}₫
                  </Text>
                </Flex>
                <Divider className="my-0!" />
                <Flex justify="space-between" align="center" className="my-6!">
                  <Text className="text-gray-600!">Phí vận chuyển</Text>
                  <Text className="font-medium! text-lg!">
                    {shippingFee?.toLocaleString()
                      ? shippingFee?.toLocaleString()
                      : 'Miễn phí'}
                  </Text>
                </Flex>

                <Divider className="my-0!" />

                <Flex justify="space-between" align="center" className="my-6!">
                  <Text className="text-sm! font-medium!">Tổng cộng</Text>
                  <Text className="text-lg! font-medium!">
                    {total?.toLocaleString()}₫
                  </Text>
                </Flex>

                <div className="mt-20">
                  <Link to="/order">
                    <Button
                      type="primary"
                      size="large"
                      className="w-full rounded-md! h-12 font-medium!"
                      disabled={cartItems.length === 0}
                    >
                      Tiến hành thanh toán
                    </Button>
                  </Link>
                </div>

                <div className="text-center mt-10">
                  <Link to="/">
                    <Button type="link" className="text-primary!">
                      ← Tiếp tục mua sắm
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {!loading && recommentProducts.length > 0 && (
        <div className="mt-2 lg:mt-12 w-full max-w-[1200px] mx-auto max-lg:bg-white max-lg:pb-8">
          <PreviewListProducts
            title="Sản phẩm có thể bạn quan tâm"
            products={recommentProducts}
            viewAll={false}
          />
        </div>
      )}
    </div>
  );
}

export default Cart;
