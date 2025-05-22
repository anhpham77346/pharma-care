import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger';
import authRoutes from './routes/auth.routes';
import medicineCategoryRoutes from './routes/medicineCategory.routes';
import supplierRoutes from './routes/supplier.routes';
import medicineRoutes from './routes/medicine.routes';
import saleInvoiceRoutes from './routes/saleInvoice.routes';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8000;

// Middleware cho JSON body parsing
app.use(express.json({ limit: '50mb' }));  // Increased limit for base64 images

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204
}));

// Ensure files directory exists
const filesDirectory = path.join(process.cwd(), 'files');
if (!fs.existsSync(filesDirectory)) {
  fs.mkdirSync(filesDirectory, { recursive: true });
}

// Serve static files from 'files' directory
app.use('/files', express.static(filesDirectory));

// Khởi tạo docs từ swagger-jsdoc
const specs = swaggerJsdoc(swaggerOptions);

// Mount Swagger UI tại đường dẫn /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Route authentication
app.use('/api/auth', authRoutes);

// Route medicine categories
app.use('/api/medicine-categories', medicineCategoryRoutes);

// Route suppliers
app.use('/api/suppliers', supplierRoutes);

// Route medicines
app.use('/api/medicines', medicineRoutes);

// Route sale invoices
app.use('/api/sale-invoices', saleInvoiceRoutes);

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

/**
 * @openapi
 * /api/export-docs:
 *   get:
 *     summary: Export API documentation as JSON
 *     description: Exports and saves Swagger documentation as a JSON file on the server
 *     responses:
 *       200:
 *         description: Documentation exported successfully
 *       500:
 *         description: Error exporting documentation
 */
app.get('/api/export-docs', (req: Request, res: Response) => {
  try {
    // Create directory if it doesn't exist
    const exportDir = path.join(__dirname, '../../frontend', 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Save the specs to a file
    const filePath = path.join(exportDir, `api-docs-${Date.now()}.json`);
    fs.writeFileSync(filePath, JSON.stringify(specs, null, 2));

    res.json({
      success: true,
      message: 'API documentation exported successfully',
      filePath: filePath
    });
  } catch (error) {
    console.error('Error exporting API documentation:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting API documentation',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api-docs`);
});