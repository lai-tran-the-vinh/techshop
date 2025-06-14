import router from "./routes";
import { StrictMode } from "react";
import { ConfigProvider } from "antd";
import { AppProvider } from "@contexts";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        components: {
          token: {
            colorPrimary: "#FE2C55",
            fontFamily: "Roboto, sans-serif",
          },
          Input: {
            activeShadow: "0",
            hoverBorderColor: "#d1d5db",
            paddingBlock: 8,
            activeBorderColor: "#9ca3af",
            colorTextPlaceholder: "#9ca3af",
            fontFamily: "Roboto, sans-serif",
          },
        },
      }}
    >
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ConfigProvider>
  </StrictMode>
);
