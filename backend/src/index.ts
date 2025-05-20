import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger';
import authRoutes from './routes/auth.routes';
import medicineCategoryRoutes from './routes/medicineCategory.routes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware cho JSON body parsing
app.use(express.json());

// Khởi tạo docs từ swagger-jsdoc
const specs = swaggerJsdoc(swaggerOptions);

// Mount Swagger UI tại đường dẫn /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Route authentication
app.use('/api/auth', authRoutes);

// Route medicine categories
app.use('/api/medicine-categories', medicineCategoryRoutes);

/**
 * @openapi
 * /:
 *   get:
 *     summary: Thử endpoint Hello World
 *     responses:
 *       200:
 *         description: Phản hồi thành công với chuỗi Hello World
 */
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api-docs`);
});