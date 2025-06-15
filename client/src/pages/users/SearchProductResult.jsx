import { Space } from "antd";
import Products from "@services/products";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PreviewListProducts } from "@/components/products";

function SearchProductResult() {
  const { query } = useParams();
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchSearchResult() {
    try {
      const result = await Products.search(query);
      setResult(result);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    fetchSearchResult();
  }, []);

  useEffect(() => {
    if (result) {
      console.log("Result:", result);
    }
  }, [result]);

  return (
    <Space direction="vertical">
      <PreviewListProducts
        products={result}
        loading={loading}
        canViewAll={false}
        showListBrands={false}
        title="Kết quả tìm kiếm"
      />
    </Space>
  );
}

export default SearchProductResult;
