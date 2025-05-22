# Pharma Care System

Hệ thống quản lý nhà thuốc Pharma Care.

## Công nghệ sử dụng

### Backend
- **Node.js** - Môi trường runtime
- **Express** - Framework API
- **Prisma** - ORM và database migrations
- **MySQL** - Hệ quản trị cơ sở dữ liệu
- **TypeScript** - Ngôn ngữ lập trình
- **JWT** - Xác thực và phân quyền
- **Swagger UI** - API documentation

### Frontend
- **Next.js** - React framework
- **React** - Thư viện UI
- **Tailwind CSS** - Framework CSS
- **TypeScript** - Ngôn ngữ lập trình

## Giao diện hệ thống

### Trang chủ
![Giao diện trang chủ](screenshots/home.png)

### Swagger UI - API Documentation
![Swagger UI](screenshots/swagger-ui.png)

## Yêu cầu hệ thống

- Node.js (v20 hoặc cao hơn)
- npm hoặc yarn
- MySQL (v8.0 hoặc cao hơn)

## Cài đặt dự án

### Clone dự án

```bash
git clone https://github.com/your-username/pharma-care.git
cd pharma-care
```

### Backend Setup

1. Cài đặt các dependencies:
   ```bash
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
   PORT=8000
   
   # Frontend URL for CORS
   FRONTEND_URL="http://localhost:3000"
   ```

3. Tạo database MySQL:
   ```sql
   CREATE DATABASE pharma_care;
   ```

4. Tạo và chạy migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Khởi chạy server phát triển:
   ```bash
   npm run dev
   ```

6. Mở Swagger UI để kiểm tra API:
   ```
   http://localhost:8000/api-docs
   ```

### Frontend Setup

1. Mở terminal mới và cài đặt dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Tạo file `.env.local` trong thư mục frontend với nội dung sau:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Khởi chạy server phát triển:
   ```bash
   npm run dev
   ```

4. Mở trình duyệt và truy cập:
   ```
   http://localhost:3000
   ```

## Sử dụng hệ thống

1. Đăng ký tài khoản mới.

2. Khám phá các chức năng quản lý thuốc, nhà cung cấp, và bán hàng.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký người dùng mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin người dùng hiện tại (yêu cầu JWT token)
- `PUT /api/auth/profile` - Cập nhật thông tin cá nhân (yêu cầu JWT token)
- `POST /api/auth/change-password` - Đổi mật khẩu người dùng (yêu cầu JWT token)
- `POST /api/auth/avatar` - Cập nhật ảnh đại diện (yêu cầu JWT token)

### Loại Thuốc (Medicine Categories)

- `GET /api/medicine-categories` - Lấy danh sách tất cả loại thuốc (yêu cầu JWT token)
- `GET /api/medicine-categories/:id` - Lấy chi tiết một loại thuốc theo ID (yêu cầu JWT token)
- `POST /api/medicine-categories` - Thêm một loại thuốc mới (yêu cầu JWT token)
- `PUT /api/medicine-categories/:id` - Cập nhật thông tin loại thuốc (yêu cầu JWT token)
- `DELETE /api/medicine-categories/:id` - Xóa một loại thuốc (yêu cầu JWT token)

### Nhà Cung Cấp (Suppliers)

- `GET /api/suppliers` - Lấy danh sách tất cả nhà cung cấp (yêu cầu JWT token)
- `GET /api/suppliers/:id` - Lấy chi tiết một nhà cung cấp theo ID (yêu cầu JWT token)
- `POST /api/suppliers` - Thêm một nhà cung cấp mới (yêu cầu JWT token)
- `PUT /api/suppliers/:id` - Cập nhật thông tin nhà cung cấp (yêu cầu JWT token)
- `DELETE /api/suppliers/:id` - Xóa một nhà cung cấp (yêu cầu JWT token)

### Thuốc (Medicines)

- `GET /api/medicines` - Lấy danh sách tất cả thuốc (yêu cầu JWT token)
- `GET /api/medicines/:id` - Lấy chi tiết một thuốc theo ID (yêu cầu JWT token)
- `POST /api/medicines` - Thêm một thuốc mới (yêu cầu JWT token)
- `PUT /api/medicines/:id` - Cập nhật thông tin thuốc (yêu cầu JWT token)
- `DELETE /api/medicines/:id` - Xóa một thuốc (yêu cầu JWT token)
- `GET /api/medicines/inventory/all` - Xem thông tin tồn kho (yêu cầu JWT token)

### Hóa Đơn Bán Hàng (Sale Invoices)

- `POST /api/sale-invoices` - Tạo hóa đơn bán hàng mới
- `GET /api/sale-invoices/:id` - Lấy chi tiết hóa đơn theo ID
- `GET /api/sale-invoices/search` - Tìm kiếm hóa đơn theo khoảng thời gian
- `GET /api/sale-invoices/revenue-report` - Xem báo cáo doanh thu
