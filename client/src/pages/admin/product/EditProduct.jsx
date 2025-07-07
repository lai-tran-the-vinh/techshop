import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; // useRef is not strictly needed here
import { Button, Col, Form, Input, Row, Select, Typography } from 'antd'; // Added Typography, Input, Select, Row, Col for renderExtraFields
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import Files from '@services/files';
import Brands from '@services/brands';
import Categories from '@services/categories';
import { useAppContext } from '@contexts'; // Keep this for app-wide context messages

import {
  CommonInformation,
  // Specifications, ConnectionInformation, CameraInformations are now rendered via renderExtraFields
  Variants,
} from '@pages/admin/product';
import {
  callDeleteFile,
  callFetchProductDetail,
  callUpdateProduct,
} from '@/services/apis';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Using message from useAppContext for consistency
  const { message, setToastLoading, setLoadingSuccess, setLoadingError } =
    useAppContext();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null); // Keep product state to store original for comparison/merging
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]); // For managing images to delete

  // State for dynamic fields based on category configuration
  const [selectedCategoryConfig, setSelectedCategoryConfig] = useState(null);
  const [fieldsToShow, setFieldsToShow] = useState({});

  const [form] = Form.useForm();

  // Titles for field groups (from AddProduct)
  const groupTitles = {
    specifications: 'Thông số kỹ thuật',
    connectivity: 'Kết nối',
    'camera.front': 'Camera trước',
    'camera.rear': 'Camera sau',
  };

  // --- Fetch Initial Data and Initialize Form ---
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [cats, brs, prodRes] = await Promise.all([
          Categories.getAll(),
          Brands.getAll(),
          callFetchProductDetail(id),
        ]);

        const fetchedProduct = prodRes.data.data;

        setCategories(cats);
        setBrands(brs);
        setProduct(fetchedProduct); // Store original product data

        // Find the initial category config and set fieldsToShow
        const initialCategory = cats.find(
          (c) => c._id === fetchedProduct.category,
        );
        if (initialCategory?.configFields) {
          setSelectedCategoryConfig(initialCategory);
          setFieldsToShow(initialCategory.configFields);
        } else {
          setFieldsToShow({});
        }

        form.setFieldsValue({
          ...fetchedProduct,
          category: fetchedProduct.category, // Ensure category ID is set for Select
          brand: fetchedProduct.brand._id, // Ensure brand ID is set for Select
          attributes: fetchedProduct.attributes || {},
          variants: fetchedProduct.variants || [],
        });

        message.success('Đã tải thông tin sản phẩm');
      } catch (err) {
        console.error(err);
        message.error('Không thể tải thông tin sản phẩm');
        setLoadingError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, message, setLoadingError, form]);

  const onCategoryChange = (categoryId) => {
    const foundCategory = categories.find((c) => c._id === categoryId);

    form.setFieldValue('category', categoryId);

    if (foundCategory?.configFields) {
      setSelectedCategoryConfig(foundCategory);
      setFieldsToShow(foundCategory.configFields);
    } else {
      setSelectedCategoryConfig(null);
      setFieldsToShow({});
    }
  };

  // --- renderExtraFields (from AddProduct) ---
  const renderExtraFields = (group) => {
    const fields =
      fieldsToShow.extraFields?.filter((f) => f.group === group) || [];
    // console.log('Rendering fields for group:', group, fields);
    const chunks = [];
    for (let i = 0; i < fields.length; i += 2) {
      chunks.push(fields.slice(i, i + 2));
    }

    // Only render the section if there are fields for this group
    if (fields.length === 0) return null;

    return (
      <>
        <div className="flex gap-4 items-center mb-10 relative">
          <div className="flex items-center gap-3">
            <span className="text-sm text-primary font-semibold tracking-wide uppercase letter-spacing-0.5 relative">
              {groupTitles[group] || 'Thông tin bổ sung'}
            </span>
          </div>
          <div className="flex-1 relative">
            <div className="border-t border-r-300 opacity-60 text-primary"></div>
          </div>
        </div>
        {chunks.map((pair, index) => (
          <Row key={index} gutter={16}>
            {pair.map((field) => (
              <Col span={12} key={field.name}>
                <Form.Item
                  name={['attributes', field.name]}
                  label={field.label}
                  rules={
                    field.required
                      ? [
                          {
                            required: true,
                            message: `${field.label} là bắt buộc`,
                          },
                        ]
                      : []
                  }
                >
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

  const onSubmit = async () => {
    try {
      const validatedValues = await form.getFieldValue();

      setToastLoading(true);
      message.loading({ content: 'Đang cập nhật sản phẩm...', key: 'update' });

      await Promise.all(
        imagesToDelete.map(async (imgUrl) => {
          try {
            await Files.delete(imgUrl);
          } catch (e) {
            console.warn('Không thể xóa ảnh (bỏ qua):', imgUrl, e);
          }
        }),
      );
      
      const productToSubmit = { ...product, ...validatedValues };
      productToSubmit._id = product._id;
      productToSubmit.category = validatedValues.category;
      productToSubmit.brand = validatedValues.brand;
      productToSubmit.attributes = validatedValues.attributes || {};
      productToSubmit.variants = validatedValues.variants || [];

      for (let i = 0; i < productToSubmit.variants.length; i++) {
        const variant = productToSubmit.variants[i];
        const newImgs = [];
        for (let j = 0; j < variant.images.length; j++) {
          const img = variant.images[j];
          if (
            img instanceof File ||
            (img && img.originFileObj instanceof File)
          ) {
            const uploadedUrl = await Files.upload(img.originFileObj || img);
            newImgs.push(uploadedUrl);
          } else if (typeof img === 'string') {
            newImgs.push(img);
          }
        }
        productToSubmit.variants[i].images = newImgs;
      }

      await callUpdateProduct(productToSubmit);

      message.success({
        content: 'Cập nhật sản phẩm thành công!',
        key: 'update',
      });
      setToastLoading(false);
      setLoadingSuccess(true);
      navigate('/admin/product');
    } catch (errInfo) {
      console.error('Đã có lỗi xảy ra khi cập nhật sản phẩm:', errInfo);
      message.error({ content: 'Cập nhật sản phẩm thất bại!', key: 'update' });
      setToastLoading(false);
      setLoadingError(true);
      if (errInfo.errorFields) {
        message.error('Vui lòng kiểm tra lại các trường bị lỗi.');
      }
    }
  };

  if (loading || !product) {
    return <Skeleton height={600} />;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          Cập nhật sản phẩm
        </h1>
      </div>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={onSubmit}
      >
        <CommonInformation
          brands={brands}
          categories={categories}
          onCategoryChange={onCategoryChange}
          form={form}
          initialProductData={product}
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

        {/* Dynamic rendering for connectivity */}
        {fieldsToShow.connectivity && <>{renderExtraFields('connectivity')}</>}

        <Variants
          form={form}
          product={product} // Pass product to Variants for initial values
          setProduct={setProduct} // Keep setProduct if Variants needs to update local product state directly
          setImagesToDelete={setImagesToDelete} // Pass this to collect images marked for deletion
        />

        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex gap-3">
              <Button
                size="large"
                disabled={loading}
                onClick={() => navigate(-1)}
                className="min-w-[120px] border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800"
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                size="large"
                loading={loading}
                htmlType="submit"
                className="min-w-[120px] bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Đang xử lý...' : 'Cập nhật sản phẩm'}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default EditProduct;
