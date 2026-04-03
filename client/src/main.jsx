import router from './routes';
import { StrictMode } from 'react';
import { App as AntdApp, ConfigProvider } from 'antd';
import 'antd/dist/reset.css'; // cần cho Ant Design v5
import { AppProvider } from '@contexts';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MobileGuard from './components/app/MobileGuard';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Inter, sans-serif',
          colorPrimary: '#dc2626',
        },
        components: {
          Input: {
            activeBorderColor: '#dc2626',
            hoverBorderColor: '#dc2626',
            activeShadow: '0',
          },
          Select: {
            activeBorderColor: '#dc2626',
            hoverBorderColor: '#dc2626',
            activeShadow: '0',
            controlHeight: 40,
          },
          Card: {
            padding: 0,
          },
        },
        message: {
          top: 80,
          duration: 2,
          maxCount: 3,
        },
      }}
    >
      <MobileGuard>
        <AntdApp>
          <AppProvider>
            <RouterProvider router={router} />
          </AppProvider>
        </AntdApp>
      </MobileGuard>
    </ConfigProvider>
  </StrictMode>,
);
