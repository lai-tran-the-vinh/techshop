import { useEffect, useCallback } from 'react';
import { Editor } from '@components/app';
import { Input, Select, Typography, Row, Col, Form, Switch } from 'antd';
import Files from '@services/files';

const { Option } = Select;

function CommonInformation({
  brands,
  product,
  categories,
  productError,
  productMessage,
  form,
}) {
  const handleImageUpload = useCallback(async (files, uploadHandler) => {
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
      console.error('Image upload failed:', error);
      uploadHandler({
        errorMessage: 'Upload failed: ' + (error.message || 'Unknown error'),
      });
    }
  }, []);

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    }
  }, [product]);

  return (
    <>
      <div className="flex gap-12 items-center">
        <span className="text-sm text-primary font-medium">
          Thông tin chung
        </span>
        <div className="flex-1 border-t border-t-gray-300"></div>
      </div>

      <Row gutter={[10, 0]}>
        <Col span={5}>
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            validateStatus={productError.name ? 'error' : ''}
            help={productError.name ? productMessage.name : ''}
          >
            <Input placeholder="Nhập tên sản phẩm" size="large" />
          </Form.Item>
        </Col>

        <Col span={5}>
          <Form.Item
            name="discount"
            label="Giảm giá"
            validateStatus={productError.discount ? 'error' : ''}
            help={productError.discount ? productMessage.discount : ''}
          >
            <Input
              type="number"
              min={0}
              placeholder="Nhập phần trăm giảm giá"
              size="large"
            />
          </Form.Item>
        </Col>

        <Col span={5}>
          <Form.Item
            name="category"
            label="Thể loại"
            validateStatus={productError.category ? 'error' : ''}
            help={productError.category ? productMessage.category : ''}
          >
            <Select placeholder="Chọn thể loại" size="large">
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={5}>
          <Form.Item
            name="brand"
            label="Thương hiệu"
            validateStatus={productError.brand ? 'error' : ''}
            help={productError.brand ? productMessage.brand : ''}
          >
            <Select placeholder="Chọn thương hiệu" size="large">
              {brands.map((brand) => (
                <Option key={brand._id} value={brand._id}>
                  {brand.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col>
          <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="description"
        label="Mô tả"
        validateStatus={productError.description ? 'error' : ''}
        help={productError.description ? productMessage.description : ''}
      >
        <Editor
          height="200px"
          product={product}
          setProduct={(newData) => {
            form.setFieldsValue({ description: newData.description });
          }}
          onImageUploadBefore={handleImageUpload}
        />
      </Form.Item>
    </>
  );
}

export default CommonInformation;
