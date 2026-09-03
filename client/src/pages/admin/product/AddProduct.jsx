import { Variants, CommonInformation } from '@pages/admin/product';

import Files from '@services/files';
import Brands from '@services/brands';
import Categories from '@services/categories';
import Products from '@/services/products';

import { useAppContext } from '@contexts';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
  Upload,
  Image,
  message as antMessage,
  notification,
} from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

function AddProduct() {
  const { message, notification } = useAppContext();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fieldsToShow, setFieldsToShow] = useState({});
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    discount: '',
    isActive: true,
    attributes: {},
    galleryImages: [],
    variants: [
      {
        name: '',
        price: 0,
        color: [
          {
            colorName: '',
            colorHex: '#000000',
            images: [],
          },
        ],
        memory: { ram: '', storage: '' },

        weight: 0,
        isActive: true,
      },
    ],
  });

  useEffect(() => {
    document.title = 'Thêm sản phẩm';
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [fetchedCategories, fetchedBrands] = await Promise.all([
        Categories.getAll(),
        Brands.getAll(),
      ]);
      setCategories(fetchedCategories);
      setBrands(fetchedBrands);
    } catch (error) {
      console.error(error);
      notification.error({
        message: 'Lỗi tải dữ liệu danh sách thuật hành',
        description: `Lỗi: ${error}`,
        duration: 4.5,
      });
    } finally {
      setLoading(false);
    }
  };

  const onCategoryChange = (categoryId) => {
    const foundCategory = categories.find((c) => c._id === categoryId);
    setSelectedCategory(categoryId);
    form.setFieldValue('category', categoryId);
    if (foundCategory?.configFields) {
      setFieldsToShow(foundCategory.configFields);
    } else {
      setFieldsToShow({});
    }
  };

  // Hàm xử lý upload gallery images
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      notification.warning({
        message: 'Chỉ có thể upload file hình ảnh!',
        duration: 4.5,
      });
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      notification.warning({
        message: 'Kích thước file phải nhỏ hơn 5MB!',
        duration: 4.5,
      });
      return false;
    }
    return false; // Prevent auto upload
  };

  const handleGalleryImageChange = ({ fileList }) => {
    setGalleryImages(fileList);

    setProduct((prev) => ({
      ...prev,
      galleryImages: fileList
        .map((file) => file.originFileObj || file.url)
        .filter(Boolean),
    }));
  };

  const onSubmit = async () => {
    message.loading('Đang thêm sản phẩm');
    try {
      // Validate form first
      await form.validateFields();

      const productToSubmit = form.getFieldsValue();

      // Đảm bảo isActive có giá trị mặc định
      if (productToSubmit.isActive === undefined) {
        productToSubmit.isActive = true;
      }

      // Auto-generate slug từ name (backend bắt buộc)
      if (productToSubmit.name) {
        productToSubmit.slug = productToSubmit.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/đ/g, 'd')
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');
      }

      // Đảm bảo discount là số
      productToSubmit.discount = Number(productToSubmit.discount) || 0;

      // Process attributes
      productToSubmit.attributes = {
        ...productToSubmit.attributes,
        ...fieldsToShow.extraFields?.reduce((acc, field) => {
          acc[field.name] = form.getFieldValue([field.group, field.name]);
          return acc;
        }, {}),
      };

      // Upload gallery images
      if (galleryImages.length > 0) {
        const uploadedGalleryUrls = [];
        for (let i = 0; i < galleryImages.length; i++) {
          const file = galleryImages[i];
          if (file.originFileObj) {
            const imageUrl = await Files.upload(file.originFileObj);
            uploadedGalleryUrls.push(imageUrl);
          } else if (file.url) {
            uploadedGalleryUrls.push(file.url);
          }
        }
        productToSubmit.galleryImages = uploadedGalleryUrls;
      }

      // Upload variant images
      if (productToSubmit.variants && productToSubmit.variants.length > 0) {
        for (let i = 0; i < productToSubmit.variants.length; i++) {
          const variant = productToSubmit.variants[i];

          // Upload color-specific images
          if (variant.color && variant.color.length > 0) {
            for (let j = 0; j < variant.color.length; j++) {
              const color = variant.color[j];
              if (color.images && color.images.length > 0) {
                const uploadedColorImages = [];
                for (let k = 0; k < color.images.length; k++) {
                  const image = color.images[k];
                  if (image instanceof File) {
                    const imageUrl = await Files.upload(image);
                    uploadedColorImages.push(imageUrl);
                  } else if (typeof image === 'string') {
                    uploadedColorImages.push(image);
                  }
                }
                productToSubmit.variants[i].color[j].images =
                  uploadedColorImages;
              }
            }
          }
        }
      }

      console.log('📦 Payload gửi lên API:', JSON.parse(JSON.stringify(productToSubmit)));
      const addProduct = await Products.add(productToSubmit);

      if (addProduct) {
        message.destroy();
        message.success('Thêm sản phẩm thành công!');
        navigate('/admin/product');
      }
    } catch (error) {
      message.destroy();
      console.error('Đã có lỗi xảy ra khi thêm sản phẩm:', error);

      if (error.errorFields && error.errorFields.length > 0) {
        message.error({
          content: 'Vui lòng kiểm tra lại thông tin đã nhập',
          key: 'adding-product',
        });
      } else {
        message.error({
          content: 'Thêm sản phẩm thất bại',
          key: 'adding-product',
        });
      }
    }
  };

  const groupTitles = {
    specifications: 'Thông số kỹ thuật',
    connectivity: 'Kết nối',
    'camera.front': 'Camera trước',
    'camera.rear': 'Camera sau',
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const renderExtraFields = (group) => {
    const fields =
      fieldsToShow.extraFields?.filter((f) => f.group === group) || [];

    const chunks = [];
    for (let i = 0; i < fields.length; i += 2) {
      chunks.push(fields.slice(i, i + 2));
    }

    return (
      <>
        <div className="flex gap-4 items-center mb-6 relative">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-800 font-semibold tracking-wide uppercase letter-spacing-0.5 relative whitespace-nowrap">
              {groupTitles[group] || 'Thông tin bổ sung'}
            </span>
          </div>
          <div className="flex-1 relative">
            <div className="border-t border-gray-300 opacity-60"></div>
          </div>
        </div>
        {chunks.map((pair, index) => (
          <Row key={`${group}-row-${index}`} gutter={16}>
            {pair.map((field) => (
              <Col span={12} key={`${group}-${field.name}`}>
                <Form.Item name={[group, field.name]} label={field.label}>
                  {field.type === 'text' || field.type === 'number' ? (
                    <Input
                      type={field.type}
                      placeholder={`Nhập thông tin ${field.label}`}
                    />
                  ) : field.type === 'select' ? (
                    <Select
                      options={(field.options || []).map((o) => ({
                        label: o,
                        value: o,
                      }))}
                    />
                  ) : field.type === 'checkbox' ? (
                    <Select
                      options={[
                        { label: 'Có', value: true },
                        { label: 'Không', value: false },
                      ]}
                    />
                  ) : null}
                </Form.Item>
              </Col>
            ))}
          </Row>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen px-8 py-6 sm:px-12 sm:py-8 lg:px-16 lg:py-10 max-w-7xl mx-auto">
      <div className="mb-16">
        <div className="text-2xl md:text-[30px] font-semibold text-[#111827]! m-0! leading-tight">
          Thêm sản phẩm mới
        </div>
        <div className="text-xs md:text-sm text-[#6b7280]! mt-1!">
          Điền thông tin chi tiết để thêm sản phẩm mới vào hệ thống
        </div>
      </div>

      <Form form={form} layout="vertical" autoComplete="off">
        <CommonInformation
          brands={brands}
          categories={categories}
          product={product}
          onCategoryChange={onCategoryChange}
          form={form}
        />

        {fieldsToShow.specifications && (
          <>{renderExtraFields('specifications')}</>
        )}

        {fieldsToShow.camera && (
          <>
            {renderExtraFields('camera.front')}
            {renderExtraFields('camera.rear')}
          </>
        )}

        {fieldsToShow.connectivity && <>{renderExtraFields('connectivity')}</>}

        <div className="mb-8">
          <div className="flex gap-4 items-center mb-6 relative">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-800 font-semibold tracking-wide uppercase letter-spacing-0.5 relative whitespace-nowrap">
                Hình ảnh quảng bá
              </span>
            </div>
            <div className="flex-1 relative">
              <div className="border-t border-gray-300 opacity-60"></div>
            </div>
          </div>

          <Form.Item name="galleryImages">
            <Dragger
              fileList={galleryImages}
              onChange={handleGalleryImageChange}
              onRemove={(file) =>
                setGalleryImages((prev) =>
                  prev.filter((f) => f.uid !== file.uid),
                )
              }
              beforeUpload={beforeUpload}
              maxCount={5}
              multiple={true}
              accept="image/*"
              onPreview={(file) => handlePreview(file)}
              className="gallery-upload"
              listType="picture"
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: true,
                showDownloadIcon: false,
              }}
            >
              <div className="flex flex-col items-center justify-center p-6">
                <InboxOutlined className="text-4xl text-gray-400 mb-3" />
                <div className="text-gray-600 text-base mb-1">
                  Kéo thả hoặc nhấp để chọn hình ảnh
                </div>
              </div>
            </Dragger>
            {previewImage && (
              <Image
                wrapperStyle={{ display: 'none' }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(''),
                }}
                src={previewImage}
              />
            )}
          </Form.Item>
        </div>

        <Variants
          form={form}
          product={product}
          setProduct={setProduct}
          setImagesToDelete={setImagesToDelete}
        />

        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                disabled={loading}
                onClick={() => navigate(-1)}
                className="flex-1 sm:flex-none min-w-[120px] border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800"
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                loading={loading}
                onClick={onSubmit}
                className="flex-1 sm:flex-none min-w-[120px] bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Đang xử lý...' : 'Thêm sản phẩm'}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default AddProduct;
