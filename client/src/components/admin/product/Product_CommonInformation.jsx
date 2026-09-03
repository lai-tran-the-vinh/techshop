import { useEffect, useCallback } from 'react';
import { Editor } from '@components/app';
import { Input, Select, Typography, Row, Col, Form, Switch } from 'antd';
import Files from '@services/files';
import { useAppContext } from '@/contexts';

const { Option } = Select;

function CommonInformation({
  brands,
  categories,
  product,
  form,
  onCategoryChange,
}) {
  const { message } = useAppContext();
  const handleImageUpload = useCallback(async (files, info, uploadHandler) => {
    try {
      const file = files[0];
      if (!file) throw new Error('No file selected');

      const imageUrl = await Files.upload(file);

      if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
        uploadHandler({
          result: [{ url: imageUrl, name: file.name, size: file.size }],
        });
      } else {
        throw new Error('Invalid image URL');
      }
    } catch (error) {
      message.error('Có lỗi khi upload hình ảnh', error);
      console.error('Image upload failed:', error);
    }
  }, []);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({ description: product.description });
    }
  }, [product, form]);

  return (
    <>
      <div className="flex gap-4 items-center mb-6 relative">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-800 font-semibold tracking-wide uppercase letter-spacing-0.5 relative whitespace-nowrap">
            Thông tin kết nối
          </span>
        </div>
        <div className="flex-1 relative">
          <div className="border-t border-gray-300"></div>
        </div>
      </div>

      <Row gutter={[16, 0]}>
        <Col xs={24} md={12} lg={6}>
          <Form.Item name="name" label="Tên sản phẩm">
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Form.Item name="discount" label="Giảm giá (%)">
            <Input
              type="number"
              min={0}
              placeholder="Nhập phần trăm giảm giá"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Form.Item name="category" label="Thể loại">
            <Select
              placeholder="Chọn thể loại"
              onChange={onCategoryChange}
            >
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Form.Item name="brand" label="Thương hiệu">
            <Select placeholder="Chọn thương hiệu">
              {brands.map((brand) => (
                <Option key={brand._id} value={brand._id}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="description" label="Mô tả" className="mt-6">
        <Editor
          product={product}
          setProduct={(val) => form.setFieldValue('description', val)}
          value={form.getFieldValue('description')}
          height="300px"
          onImageUploadBefore={handleImageUpload}
        />
      </Form.Item>
    </>
  );
}

export default CommonInformation;
