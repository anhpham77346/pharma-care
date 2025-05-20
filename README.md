# Pharma Care System

Hệ thống quản lý nhà thuốc Pharma Care.

## Backend Setup

1. Cài đặt các dependencies:
   ```
   cd backend
   npm install
   ```

2. Tạo file `.env` trong thư mục backend với nội dung sau (điều chỉnh thông tin cơ sở dữ liệu theo môi trường của bạn):
   ```
   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/pharma_care"

   # JWT Config
   JWT_SECRET="pharma-care-secret-key-change-for-production"
   JWT_EXPIRES_IN="24h"

   # Server config
   PORT=3000
   ```

3. Tạo database và chạy migrations:
   ```
   npx prisma migrate dev --name init
   ```

4. Khởi chạy server phát triển:
   ```
   npm run dev
   ```

5. Mở Swagger UI để kiểm tra API:
   ```
   http://localhost:3000/api-docs
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký người dùng mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin người dùng hiện tại (yêu cầu JWT token)
