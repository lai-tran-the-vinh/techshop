# TechShop Client (ReactJS)

Chào mừng đến với **TechShop Client**! Đây là frontend repository cho ứng dụng thương mại điện tử TechShop, được xây dựng bằng **ReactJS** và **Vite**, tập trung vào hiệu suất và trải nghiệm người dùng hiện đại.

## 🚀 Công Nghệ Sử Dụng

Dự án sử dụng các thư viện và công cụ mạnh mẽ sau:

- **Core**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Ant Design](https://ant.design/)
- **Routing**: [React Router DOM 7](https://reactrouter.com/)
- **State Management & Data Fetching**: [Axios](https://axios-http.com/), [React Query](https://tanstack.com/query/latest) (nếu có), Context API
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Bản đồ**: [MapLibre GL](https://maplibre.org/), [React Map GL](https://visgl.github.io/react-map-gl/)
- **Biểu đồ**: [Recharts](https://recharts.org/)
- **Editor**: [SunEditor React](https://github.com/mkhstar/suneditor-react)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/), [Lucide React](https://lucide.dev/)
- **Tiện ích khác**: Day.js, Lodash, JWT Decode

## 🛠️ Cài Đặt và Chạy Dự Án

Đảm bảo bạn đã cài đặt [Node.js](https://nodejs.org/) trên máy của mình.

1.  **Clone repository** (nếu chưa có):
    ```bash
    git clone https://github.com/VoViet266/techshop_client_reactjs.git
    cd techshop_client_reactjs
    ```

2.  **Cài đặt dependencies**:
    ```bash
    npm install
    ```

3.  **Chạy môi trường phát triển (Development)**:
    ```bash
    npm run dev
    ```
    Truy cập `http://localhost:5173` để xem ứng dụng.

4.  **Build cho production**:
    ```bash
    npm run build
    ```

5.  **Xem trước bản build**:
    ```bash
    npm run preview
    ```

## 📂 Cấu Trúc Thư Mục

```
src/
├── assets/         # Hình ảnh, fonts, static files
├── components/     # Các component tái sử dụng (Button, Input, etc.)
├── layouts/        # Bố cục trang (MainLayout, AuthLayout)
├── pages/          # Các trang chính (Home, Product, Cart, etc.)
├── services/       # API calls (Axios configuration)
├── hooks/          # Custom React hooks
├── utils/          # Các hàm tiện ích (format currency, date, etc.)
├── contexts/       # React Context (AuthContext, CartContext)
└── App.jsx         # Component gốc và cấu hình routes
```

## 🤝 Đóng Góp

1.  Fork dự án
2.  Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4.  Push lên branch (`git push origin feature/AmazingFeature`)
5.  Tạo Pull Request

---
*Dự án được phát triển bởi VoViet266.*
