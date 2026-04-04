# 🛒 TechShop

Chào mừng đến với **TechShop** 🚀  
Đây là hệ thống thương mại điện tử và quản lý chuỗi cửa hàng gồm:

-   🖥️ Frontend: React + Vite
    
-   ⚙️ Backend: NestJS + MongoDB
    

----------

# 📦 1. TechShop Client (Frontend)

## 🚀 Công Nghệ Sử Dụng

-   **Core**: React 19, Vite
    
-   **UI & Styling**: Tailwind CSS 4, Ant Design (antd)
    
-   **Routing**: React Router DOM 7
    
-   **Forms**: React Hook Form
    
-   **HTTP Client**: Axios
    
-   **Maps**: MapLibre GL, React Map GL
    
-   **Charts**: Recharts
    
-   **Editor**: SunEditor
    
-   **Icons**: Lucide React, React Icons, Ant Design Icons
    
-   **Utilities**: Day.js, Moment, Lodash.get, JWT Decode, React Markdown
    

## 🛠️ Cài đặt và chạy Client

```bash
git clone https://github.com/lai-tran-the-vinh/techshop.git
cd client
npm install
npm run dev

```

👉 Truy cập: [http://localhost:5173](http://localhost:5173/)

## ⚙️ Scripts Client

```bash
npm run dev
npm run build
npm run preview
npm run format

```

## 📂 Cấu trúc thư mục Client

```
src/
├── assets/
├── components/
├── pages/
├── layouts/
├── services/
├── hooks/
├── utils/
├── contexts/
└── App.jsx

```

----------

# 🖥️ 2. TechShop Server (Backend - NestJS)

## 🚀 Công Nghệ Sử Dụng

-   **Framework**: NestJS 11
    
-   **Database**: MongoDB + Mongoose
    
-   **Authentication**: JWT, Passport (local, Google OAuth)
    
-   **Authorization**: CASL
    
-   **Cache**: Redis (ioredis)
    
-   **Upload**: Multer + Cloudinary
    
-   **Validation**: class-validator, class-transformer
    
-   **Mail**: Nodemailer
    
-   **AI**: Google Generative AI
    
-   **Khác**: Slugify, OTP Generator, Natural (NLP)
    

## 🛠️ Cài đặt và chạy Server

```bash
cd server
npm install
npm run start:dev

```

👉 Server chạy tại: [http://localhost:3000](http://localhost:3000/)

## ⚙️ Scripts Server

```bash
npm run build
npm run start
npm run start:dev
npm run start:prod
npm run lint
npm run format
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e

```

## 📂 Cấu trúc thư mục Server

```
src/
├── modules/
├── common/
├── config/
├── guards/
├── strategies/
├── decorators/
├── pipes/
└── main.ts

```

----------

# 🔗 Kết nối Client - Server

Tạo file `.env` trong thư mục `client`:

```
VITE_SERVER_URL=http://localhost:8080

VITE_RASA_URL=http://localhost:5005/webhooks/rest/webhook

VITE_REACT_APP_GEOAPIFY_PUBLIC_KEY=

```

Lưu ý: Do vấn đề về chi phí triển khai trên máy chủ nên để có thể thực hiện được chức năng trò chuyện với chatbot, xin vui lòng tải mã nguồn về máy cá nhân và thực thi theo hướng dẫn tại https://github.com/lai-tran-the-vinh/chatbot-training.git 

----------

# 🤝 Đóng góp

1.  Fork project
    
2.  Tạo branch: `feature/your-feature`
    
3.  Commit: `git commit -m "feat: add feature"`
    
4.  Push và tạo Pull Request
    

----------

# 👨‍💻 Tác giả

Lại Trần Thế Vinh
Võ Quốc Việt