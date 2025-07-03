import {
  Variants,
  Specifications,
  CommonInformation,
  CameraInformations,
  ConnectionInformation,
} from '@pages/admin/product';

import Files from '@services/files';
import Brands from '@services/brands';
import Categories from '@services/categories';
import Products from '@/services/products';

import { useAppContext } from '@contexts';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Form } from 'antd';

function AddProduct() {
  const { message } = useAppContext();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

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
      message.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const removeEmptyFields = (obj) => {
    const filtered = {};

    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          const filteredArray = value
            .map((item) =>
              typeof item === 'object' ? removeEmptyFields(item) : item,
            )
            .filter((item) => {
              return (
                item !== null &&
                item !== undefined &&
                item !== '' &&
                (typeof item !== 'object' || Object.keys(item).length > 0)
              );
            });
          if (filteredArray.length > 0) filtered[key] = filteredArray;
        } else if (typeof value === 'object') {
          const nested = removeEmptyFields(value);
          if (Object.keys(nested).length > 0) filtered[key] = nested;
        } else if (value !== '') {
          filtered[key] = value;
        }
      }
    });

    return filtered;
  };

  const onSubmit = async () => {
    try {
      const values = form.getFieldsValue(true); // lấy toàn bộ form
      const productToSubmit = removeEmptyFields(values);
      console.log(productToSubmit);

      message.loading('Đang thêm sản phẩm');

      for (let i = 0; i < productToSubmit.variants?.length; i++) {
        const variant = productToSubmit.variants[i];
        if (variant.images?.length > 0) {
          const uploadedUrls = [];
          for (let j = 0; j < variant.images.length; j++) {
            const url = await Files.upload(variant.images[j]);
            uploadedUrls.push(url);
          }
          productToSubmit.variants[i].images = uploadedUrls;
        }
      }

      // await Products.add(productToSubmit);

      // message.success('Thêm sản phẩm thành công');
      // navigate('/admin/product');
    } catch (error) {
      console.error(error);

      message.error('Thêm sản phẩm thất bại');
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          Thêm sản phẩm mới
        </h1>
      </div>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        initialValues={{
          name: '',
          description: '',
          category: '',
          brand: '',
          discount: '',
          isActive: true,
          specifications: {
            weight: '',
            battery: '',
            processor: '',
            dimensions: '',
            displaySize: '',
            displayType: '',
            operatingSystem: '',
          },
          connectivity: {
            wifi: '',
            bluetooth: '',
            cellular: '',
            nfc: false,
            gps: false,
            ports: [],
          },
          camera: {
            front: {
              resolution: '',
              features: [],
              videoRecording: [],
            },
            rear: {
              resolution: '',
              features: [],
              lensCount: '',
              videoRecording: [],
            },
          },
          variants: [
            {
              name: '',
              price: '',
              color: {
                name: '',
                hex: '',
              },
              memory: {
                ram: '',
                storage: '',
              },
              images: [],
            },
          ],
        }}
      >
        <CommonInformation
          brands={brands}
          categories={categories}
          form={form}
        />
        <Specifications form={form} />
        <ConnectionInformation form={form} />
        <CameraInformations form={form} />
        <Variants
          form={form}
         
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
                onClick={onSubmit}
                className="min-w-[120px] bg-blue-600 hover:bg-blue-700"
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
