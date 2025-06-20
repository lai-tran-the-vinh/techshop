import router from "./routes";
import { StrictMode } from "react";
import { ConfigProvider, message } from "antd";
import { AppProvider } from "@contexts";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider
      theme={{}} // có thể thêm theme nếu muốn
      message={{
        top: 10,
        duration: 2,
        maxCount: 3,
      }}
    >
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ConfigProvider>
  </StrictMode>
);
