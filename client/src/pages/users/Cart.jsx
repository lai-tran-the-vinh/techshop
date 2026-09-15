import {
  Checkbox,
  Row,
  Col,
  Card,
  Flex,
  Spin,
  Image,
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
    const fetchInitialCart = async () => {
      try {
        const response = await CartServices.get();
        if (response.status === 200) {
          const data = response.data.data;
          setCartData(data);
          if (data?.items) {
            setSelectedRowKeys(data.items.map(item => `${item.product._id}-${item.variant._id}`));
          }
          setLoading(false);
        }
      } catch (error) {
        message.error('Không thể lấy giỏ hàng!');
        console.error('Lỗi khi lấy giỏ hàng:', error);
      }
    };
    fetchInitialCart();
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
        await getCart();
        message.error('Cập nhật số lượng thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
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

  const cartItems = cartData?.items || [];
  
  const variantItem = cartItems.map((item) => {
    const selectedColor = item.variant?.color?.find(
      (color) => color.colorName === item.color,
    );
    return {
      ...item,
      color: selectedColor,
      itemKey: `${item.product._id}-${item.variant._id}`,
    };
  });

  const selectedItems = variantItem.filter(item => selectedRowKeys.includes(item.itemKey));

  const total = selectedItems.reduce(
    (sum, item) => sum + (item.variant?.price || 0) * item.quantity,
    0,
  );
  
  const calculateDiscountedPrice = (item) => {
    const originalPrice = item?.variant?.price * item.quantity;
    const discountAmount =
      originalPrice * ((item.product?.discount || 0) / 100);
    return originalPrice - discountAmount;
  };

  const discountedTotal = selectedItems.reduce(
    (sum, item) => sum + calculateDiscountedPrice(item),
    0,
  );
  
  const totalDiscount = total - discountedTotal;
  const shippingFee = 0;
  const finalTotal = discountedTotal + shippingFee;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowKeys(variantItem.map(item => item.itemKey));
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleSelectItem = (itemKey, checked) => {
    if (checked) {
      setSelectedRowKeys([...selectedRowKeys, itemKey]);
    } else {
      setSelectedRowKeys(selectedRowKeys.filter(k => k !== itemKey));
    }
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
    <div className="bg-[#f3f4f6] min-h-screen max-lg:p-0 lg:px-24 lg:py-32 lg:pt-48 w-full pb-[150px] lg:pb-32 relative">
      <Modal
        centered
        open={open}
        okText="Xóa"
        title={
          <div className="flex items-center gap-8">
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
        <p className="text-gray-700 py-16">{modalText}</p>
      </Modal>

      {cartItems.length === 0 || !cartData ? (
        <div className="bg-white lg:rounded-xl max-lg:pt-[100px] max-lg:pb-64 p-32 lg:p-80 flex flex-col lg:flex-row items-center justify-center lg:gap-[200px] gap-4 text-center lg:text-left w-full max-w-[1200px] mx-auto lg:my-32">
          <div className="w-[300px] lg:w-[450px] order-1 lg:order-2">
            <Image
              className="w-full h-auto"
              preview={false}
              src="https://fptshop.com.vn/img/empty_cart.png?w=1920&q=75"
            />
          </div>
          
          <div className="flex flex-col gap-24 lg:gap-24 items-center lg:items-start order-2 lg:order-1 px-8 mt-8 lg:mt-0">
            <Title level={5} className="font-semibold! mb-0! text-[16px]! text-gray-800! lg:text-[24px]!">
              Chưa có sản phẩm nào trong giỏ hàng
            </Title>
            <Text className="text-[#6b7280]! text-[13px]! lg:text-[16px]!">
              Cùng mua sắm hàng ngàn sản phẩm tại TechShop nhé!
            </Text>
            <Link to="/" className="mt-16 lg:mt-16">
              <Button type="primary" className="rounded-full! h-[40px]! px-48! lg:h-[48px]! lg:px-56! bg-[#cb1c22]! hover:bg-[#a1161b]! border-none! text-[14px]! font-medium!">
                Mua hàng
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[1200px] mx-auto">
          {/* Mobile Back to Shop Link */}
          <div className="lg:hidden px-16 py-12 bg-white flex items-center shadow-sm sticky top-0 z-40">
            <Link to="/" className="text-primary! text-sm font-medium flex items-center gap-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Tiếp tục mua sắm
            </Link>
          </div>

          <Row gutter={[24, 24]} className="w-full! m-0! max-lg:px-0 max-lg:pt-0">
            <Col xs={24} lg={17} className="max-lg:px-0!">
              <div className="bg-white rounded-none lg:rounded-xl lg:border lg:border-gray-200 overflow-hidden">
                {/* Header Actions */}
                <div className="px-16 py-12 flex justify-between items-center border-b border-gray-100">
                  <Checkbox 
                    checked={selectedRowKeys.length === cartItems.length && cartItems.length > 0}
                    onChange={handleSelectAll}
                    className="custom-checkbox"
                  >
                    <span className="ml-8 font-medium text-gray-800 text-[15px]">Chọn tất cả ({cartItems.length})</span>
                  </Checkbox>
                  
                  <button
                    onClick={() => {
                      setModalText('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng không?');
                      setOpen(true);
                      setDeleteType('all');
                    }}
                    disabled={!(selectedRowKeys.length === cartItems.length && cartItems.length > 0)}
                    className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <DeleteOutlined className="text-[18px]" />
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="flex flex-col">
                  {variantItem.map((item, index) => {
                    const originalPrice = item?.variant?.price * item.quantity;
                    const discountedPrice = calculateDiscountedPrice(item);
                    const hasDiscount = (item.product?.discount || 0) > 0;
                    
                    return (
                      <div key={item.itemKey} className={`p-16 flex items-start gap-12 relative group ${index !== variantItem.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <Checkbox 
                          checked={selectedRowKeys.includes(item.itemKey)}
                          onChange={(e) => handleSelectItem(item.itemKey, e.target.checked)}
                          className="mt-4 custom-checkbox"
                        />
                        
                        <div className="w-[80px] h-[80px] border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                          <Image
                            src={item?.color?.images?.[0] || '/placeholder-image.jpg'}
                            alt={item?.variant?.name}
                            width="100%"
                            height="100%"
                            className="object-cover"
                            fallback="/placeholder-image.jpg"
                            preview={false}
                          />
                        </div>
                        
                        <div className="flex-1 flex flex-col lg:flex-row lg:items-center lg:justify-between min-w-0">
                          {/* Item Info */}
                          <div className="flex flex-col gap-4 lg:gap-6 lg:w-[45%]">
                            <Link to={`/product/${item.product._id}`} className="hover:text-primary transition-colors">
                              <h3 className="font-medium text-gray-800 text-[14px] leading-snug line-clamp-2">
                                {item?.product?.name} {item?.variant?.name}
                              </h3>
                            </Link>
                            {item?.color?.colorName && (
                              <div className="inline-flex items-center gap-4 bg-gray-50 border border-gray-200 px-6 py-2 rounded text-xs text-gray-600 w-fit lg:mt-2">
                                Màu: {item.color.colorName}
                              </div>
                            )}
                          </div>
                          
                          {/* Mobile Price & Actions grouped, Desktop horizontal */}
                          <div className="flex flex-col lg:flex-row lg:items-center lg:w-[55%] mt-12 lg:mt-0">
                            {/* Price */}
                            <div className="flex items-center gap-8 lg:flex-col lg:gap-2 lg:items-end lg:w-[35%] mb-12 lg:mb-0">
                              <span className="font-bold text-red-600 text-[16px] lg:text-[16px]">
                                {discountedPrice?.toLocaleString()}₫
                              </span>
                              {hasDiscount && (
                                <span className="text-gray-400 text-[13px] line-through">
                                  {originalPrice?.toLocaleString()}₫
                                </span>
                              )}
                            </div>
                            
                            {/* Quantity & Trash */}
                            <div className="flex items-center justify-between lg:justify-end w-full lg:w-[65%]">
                              <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white lg:mr-24">
                                <button
                                  onClick={() => updateQuantity(item.product._id, item.variant._id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-[32px] h-[32px] flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-300 transition-colors cursor-pointer"
                                >
                                  <MinusOutlined className="text-[12px]" />
                                </button>
                                <input
                                  type="text"
                                  value={item.quantity}
                                  readOnly
                                  className="w-[40px] h-[32px] text-center text-[14px] font-medium border-x border-gray-300 focus:outline-none"
                                />
                                <button
                                  onClick={() => updateQuantity(item.product._id, item.variant._id, item.quantity + 1)}
                                  className="w-[32px] h-[32px] flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                  <PlusOutlined className="text-[12px]" />
                                </button>
                              </div>
                              
                              <button
                                onClick={() => {
                                  setDeleteType('item');
                                  showModal();
                                  setDeleteItem(item);
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors p-8 cursor-pointer"
                              >
                                <DeleteOutlined className="text-[18px]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Col>

            <Col xs={24} lg={7} className="max-lg:px-0!">
              <div 
                className="lg:sticky lg:top-[120px] bg-white rounded-none lg:rounded-xl lg:border lg:border-gray-200 relative lg:pb-24 border-t border-gray-100 lg:border-t-gray-200" 
              >

                <div className="p-[24px]">
                  {/* Summary Details */}
                  <div>
                    <h3 className="text-gray-900 font-semibold text-[16px] m-0 mb-4 pb-4 border-b border-gray-100">
                      Thông tin đơn hàng
                    </h3>
                    <div className="space-y-4">
                      <Flex justify="space-between" align="center">
                        <Text className="text-gray-500! text-[14px]!">Tổng tiền</Text>
                        <Text className="text-gray-900! font-medium! text-[15px]!">
                          {total?.toLocaleString()}đ
                        </Text>
                      </Flex>
                      
                      <Flex justify="space-between" align="start" className="flex-col gap-3">
                        <div className="flex justify-between w-full">
                          <Text className="text-gray-500! text-[14px]!">Tổng khuyến mãi</Text>
                          <Text className="text-gray-900! font-medium! text-[15px]!">
                            -{totalDiscount?.toLocaleString()}đ
                          </Text>
                        </div>
                        <div className="w-full space-y-3 pl-4">
                          <div className="flex justify-between w-full text-[13px] items-center">
                            <Text className="text-gray-400! flex items-center gap-2 text-[13px]!">
                              <span className="w-1 h-1 bg-gray-300 rounded-full inline-block"></span>
                              Giảm giá sản phẩm
                            </Text>
                            <Text className="text-gray-400! text-[13px]!">{totalDiscount?.toLocaleString()}đ</Text>
                          </div>
                          <div className="flex justify-between w-full text-[13px] items-center">
                            <Text className="text-gray-400! flex items-center gap-2 text-[13px]!">
                              <span className="w-1 h-1 bg-gray-300 rounded-full inline-block"></span>
                              Voucher
                            </Text>
                            <Text className="text-gray-400! text-[13px]!">0đ</Text>
                          </div>
                          <div className="flex justify-between w-full text-[13px] items-center">
                            <Text className="text-gray-400! flex items-center gap-2 text-[13px]!">
                              <span className="w-1 h-1 bg-gray-300 rounded-full inline-block"></span>
                              Phí vận chuyển
                            </Text>
                            <Text className="text-gray-400! text-[13px]!">0đ</Text>
                          </div>
                        </div>
                      </Flex>
                    </div>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-dashed border-gray-200">
                    <Flex justify="space-between" align="center">
                      <Text className="text-gray-800! font-semibold! text-[15px]!">Cần thanh toán</Text>
                      <Text className="text-[#cb1c22]! font-bold! text-[20px]!">
                        {finalTotal?.toLocaleString()}đ
                      </Text>
                    </Flex>
                  </div>

                  {/* Desktop Checkout Button */}
                  <div className="hidden lg:block mt-8">
                    <Link to="/order" className="text-white! hover:text-white!">
                      <button
                        disabled={selectedItems.length === 0}
                        className="w-full bg-[#cb1c22] hover:bg-[#a1161b] text-white! font-semibold rounded-xl h-[52px] text-[16px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5"
                      >
                        Xác nhận đơn
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Mobile Sticky Checkout Bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50 p-4 px-6 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Tạm tính ({selectedItems.length} sản phẩm)</span>
              <span className="text-[#cb1c22] font-bold text-[18px]">{finalTotal?.toLocaleString()}₫</span>
            </div>
            <Link to="/order" className="w-[150px] text-white! hover:text-white!">
              <button
                disabled={selectedItems.length === 0}
                className="w-full bg-[#cb1c22] hover:bg-[#a1161b] text-white! font-semibold rounded-xl h-[44px] text-[14px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-red-500/20"
              >
                Xác nhận đơn
              </button>
            </Link>
          </div>
        </div>
      )}

      {!loading && recommentProducts.length > 0 && (
        <div className="mt-8 lg:mt-32 w-full max-w-[1200px] mx-auto max-lg:bg-white max-lg:pb-32 lg:px-0">
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
