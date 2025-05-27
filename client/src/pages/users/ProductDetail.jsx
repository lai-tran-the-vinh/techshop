import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();

  return (
    <div className="w-full xl:px-50 mt-30">
      <div className="flex border h-300">
        <div className="border w-[60%]"></div>
        <div className="border flex-1 flex-col flex p-20 gap-8">
          <h3 className="text-2xl font-medium">Apple Pro Display XDR</h3>
          <span className="text-lg font-bold text-primary">30.000.000 VNĐ</span>
          <div>
            <span className="text-sm font-medium">Bộ nhớ</span>
            <div className="flex gap-6">
              <span className="px-4 border border-gray-300 text-sm rounded-sm bg-gray-200 ">
                256GB
              </span>
              <span className="px-4 border border-gray-300 text-sm rounded-sm bg-gray-200 ">
                256GB
              </span>
              <span className="px-4 border border-gray-300 text-sm rounded-sm bg-gray-200 ">
                256GB
              </span>
              <span className="px-4 border border-gray-300 text-sm rounded-sm bg-gray-200 ">
                256GB
              </span>
              <span className="px-4 border border-gray-300 text-sm rounded-sm bg-gray-200 ">
                256GB
              </span>
            </div>
          </div>

          <div>
            <span className="text-sm font-medium">Màu</span>
            <div className="flex gap-6">
              <div className="px-4 text-sm rounded-full h-20 w-20 border-green-600 border bg-green-500"></div>
              <div className="px-4 text-sm rounded-full h-20 w-20 bg-red-500 border-red-600 border"></div>
              <div className="px-4 text-sm rounded-full h-20 w-20 bg-gray-500 border-gray-600 border"></div>
              <div className="px-4 text-sm rounded-full h-20 w-20 bg-yellow-500 border-yellow-600 border"></div>
              <div className="px-4 text-sm rounded-full h-20 w-20 bg-blue-500 border-blue-600 border"></div>
            </div>
          </div>

          <div className="flex gap-10 mt-auto">
            <button className="w-[50%] py-4 text-md hover:opacity-90 bg-gray-200 cursor-pointer rounded-sm">
              Thêm vào giỏ hàng
            </button>
            <button className="w-[50%] py-4 text-md hover:opacity-80 text-white rounded-sm cursor-pointer bg-primary">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
