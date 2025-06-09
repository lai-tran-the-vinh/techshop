import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Products from "@services/products";

const columns = [
  "Name",
  "Description",
  "Discount",
  "Category",
  "Brand",
  "Display Size",
  "Display Style",
  "Processor",
  "Operating System",
  "Battery",
  "Weight",
  "WiFi",
  "Bluetooth",
  "Cellular",
  "NFC",
  "GPS",
  "Ports",
  "Front Resolution",
  "Front Camera Feature",
  "Front Camera Video Recording",
  "Rear Resolution",
  "Rear Camera Feature",
  "Rear Camera Video Recording",
];

// Example data row (replace with real data as needed)
const data = [
  {
    name: "Product 1",
    description: "A great product",
    discount: "10%",
    category: "Electronics",
    brand: "BrandX",
    displaySize: '6.5"',
    displayStyle: "AMOLED",
    processor: "Snapdragon 888",
    operatingSystem: "Android 12",
    battery: "4500mAh",
    weight: "180g",
    wifi: "802.11ac",
    bluetooth: "5.2",
    cellular: "5G",
    nfc: "Yes",
    gps: "Yes",
    ports: "USB-C, 3.5mm",
    frontResolution: "32MP",
    frontCameraFeature: "HDR, Portrait",
    frontCameraVideoRecording: "4K@30fps",
    rearResolution: "64MP + 12MP",
    rearCameraFeature: "OIS, Night Mode",
    rearCameraVideoRecording: "8K@30fps",
  },
  {
    name: "Product 1",
    description: "A great product",
    discount: "10%",
    category: "Electronics",
    brand: "BrandX",
    displaySize: '6.5"',
    displayStyle: "AMOLED",
    processor: "Snapdragon 888",
    operatingSystem: "Android 12",
    battery: "4500mAh",
    weight: "180g",
    wifi: "802.11ac",
    bluetooth: "5.2",
    cellular: "5G",
    nfc: "Yes",
    gps: "Yes",
    ports: "USB-C, 3.5mm",
    frontResolution: "32MP",
    frontCameraFeature: "HDR, Portrait",
    frontCameraVideoRecording: "4K@30fps",
    rearResolution: "64MP + 12MP",
    rearCameraFeature: "OIS, Night Mode",
    rearCameraVideoRecording: "8K@30fps",
  },
  {
    name: "Product 1",
    description: "A great product",
    discount: "10%",
    category: "Electronics",
    brand: "BrandX",
    displaySize: '6.5"',
    displayStyle: "AMOLED",
    processor: "Snapdragon 888",
    operatingSystem: "Android 12",
    battery: "4500mAh",
    weight: "180g",
    wifi: "802.11ac",
    bluetooth: "5.2",
    cellular: "5G",
    nfc: "Yes",
    gps: "Yes",
    ports: "USB-C, 3.5mm",
    frontResolution: "32MP",
    frontCameraFeature: "HDR, Portrait",
    frontCameraVideoRecording: "4K@30fps",
    rearResolution: "64MP + 12MP",
    rearCameraFeature: "OIS, Night Mode",
    rearCameraVideoRecording: "8K@30fps",
  },
  {
    name: "Product 1",
    description: "A great product",
    discount: "10%",
    category: "Electronics",
    brand: "BrandX",
    displaySize: '6.5"',
    displayStyle: "AMOLED",
    processor: "Snapdragon 888",
    operatingSystem: "Android 12",
    battery: "4500mAh",
    weight: "180g",
    wifi: "802.11ac",
    bluetooth: "5.2",
    cellular: "5G",
    nfc: "Yes",
    gps: "Yes",
    ports: "USB-C, 3.5mm",
    frontResolution: "32MP",
    frontCameraFeature: "HDR, Portrait",
    frontCameraVideoRecording: "4K@30fps",
    rearResolution: "64MP + 12MP",
    rearCameraFeature: "OIS, Night Mode",
    rearCameraVideoRecording: "8K@30fps",
  },
  {
    name: "Product 1",
    description: "A great product",
    discount: "10%",
    category: "Electronics",
    brand: "BrandX",
    displaySize: '6.5"',
    displayStyle: "AMOLED",
    processor: "Snapdragon 888",
    operatingSystem: "Android 12",
    battery: "4500mAh",
    weight: "180g",
    wifi: "802.11ac",
    bluetooth: "5.2",
    cellular: "5G",
    nfc: "Yes",
    gps: "Yes",
    ports: "USB-C, 3.5mm",
    frontResolution: "32MP",
    frontCameraFeature: "HDR, Portrait",
    frontCameraVideoRecording: "4K@30fps",
    rearResolution: "64MP + 12MP",
    rearCameraFeature: "OIS, Night Mode",
    rearCameraVideoRecording: "8K@30fps",
  },
  {
    name: "Product 1",
    description: "A great product",
    discount: "10%",
    category: "Electronics",
    brand: "BrandX",
    displaySize: '6.5"',
    displayStyle: "AMOLED",
    processor: "Snapdragon 888",
    operatingSystem: "Android 12",
    battery: "4500mAh",
    weight: "180g",
    wifi: "802.11ac",
    bluetooth: "5.2",
    cellular: "5G",
    nfc: "Yes",
    gps: "Yes",
    ports: "USB-C, 3.5mm",
    frontResolution: "32MP",
    frontCameraFeature: "HDR, Portrait",
    frontCameraVideoRecording: "4K@30fps",
    rearResolution: "64MP + 12MP",
    rearCameraFeature: "OIS, Night Mode",
    rearCameraVideoRecording: "8K@30fps",
  },
  // Add more rows as needed
];

function ListProduct() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      var products = [];
      try {
        products = await Products.getAll();
        setLoading(false);
        if (products.length > 0) {
          setProducts(products);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      {loading ? (
        <div className="rounded-lg">
          <Skeleton className="h-1000" />
        </div>
      ) : (
        <div className="p-6 font-roboto min-h-screen flex flex-col justify-start">
          <div className="mb-10">
            <h1 className="text-xl font-medium">Danh sách sản phẩm</h1>
          </div>
          <div
            className="overflow-x-auto rounded-md border border-gray-300 bg-white max-h-[70vh]"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
            <div className="hide-scrollbar">
              <table className="min-w-full text-sm align-middle">
                <thead className="bg-gray-50 h-35 border-b border-gray-200">
                  <tr>
                    {columns.map((col, i) => (
                      <th
                        key={col}
                        className={
                          `px-12 py-8 text-center border-r min-w-100 font-semibold text-gray-700 whitespace-nowrap bg-white border-b border-gray-200 z-20 ` +
                          (i === 0
                            ? "sticky left-0 z-30 border-gray-300"
                            : "sticky top-0")
                        }
                        style={i === 0 ? { left: 0, top: 0 } : { top: 0 }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-12 py-8 text-center whitespace-nowrap sticky left-0 z-1000 border-gray-200">
                        {row.name || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {row.description || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {row.discount || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {row.category.name || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {row.brand.name || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {row?.specifications?.displaySize || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {row?.specifications?.displayStyle || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {row?.specifications?.processor || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {row?.specifications?.operatingSystem || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {row?.specifications?.battery || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {row?.specifications?.weight || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {row?.connectivity?.wifi || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {row?.connectivity?.bluetooth || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {row?.connectivity?.cellular || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {row?.connectivity?.nfc || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {row?.connectivity?.gps || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {Array.isArray(row.connectivity?.ports)
                          ? row.connectivity?.ports?.join(", ")
                          : "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {Array.isArray(row?.camera?.front?.resolution)
                          ? row?.camera?.front?.resolution?.join(", ")
                          : "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {Array.isArray(row.camera?.front?.features)
                          ? row.camera?.front?.features?.join(", ")
                          : "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center border-gray-300 border-l max-w-200 overflow-x-hidden whitespace-nowrap">
                        {Array.isArray(row.camera?.front?.videoRecording)
                          ? row.camera?.front?.videoRecording?.join(", ")
                          : "Không có"}
                      </td>
                      {/*
                      <td className="px-12 py-8 text-center whitespace-nowrap">
                        {Array.isArray(row.camera?.front?.videoRecording)
                          ? row.camera?.front?.videoRecording?.join(", ")
                          : "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center whitespace-nowrap">
                        {row.camera?.rear?.resolution || "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center whitespace-nowrap">
                        {Array.isArray(row.camera?.rear?.features)
                          ? row.camera?.rear?.features?.join(", ")
                          : "Không có"}
                      </td>
                      <td className="px-12 py-8 text-center whitespace-nowrap">
                        {Array.isArray(row.camera?.rear?.videoRecording)
                          ? row.camera?.rear?.videoRecording?.join(", ")
                          : "Không có"}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ListProduct;
