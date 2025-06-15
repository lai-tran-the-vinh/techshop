import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import Products from "@services/products";
import { ImagesSlider } from "@components/app";
import "react-loading-skeleton/dist/skeleton.css";
import { PreviewListProducts } from "@components/products";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    try {
      const products = await Products.getAll();
      setProducts(products);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      {/* <div className="relative w-[60%] mt-20">
        {loading ? (
          <Skeleton className="h-500" />
        ) : (
          <ImagesSlider images={[]} />
        )}
      </div> */}
      <div className="mb-50">
        <PreviewListProducts
          loading={loading}
          products={products}
          title="Điện thoại nổi bật"
        />
        <PreviewListProducts
          loading={loading}
          products={products}
          title="Laptop nổi bật"
        />
        <PreviewListProducts
          loading={loading}
          products={products}
          title="TV nổi bật"
        />
      </div>
    </>
  );
}

export default Home;
