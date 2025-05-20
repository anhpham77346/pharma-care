import express, { Request, Response, RequestHandler } from 'express';
import * as supplierController from '../controllers/supplier.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/suppliers:
 *   get:
 *     summary: Lấy danh sách tất cả nhà cung cấp
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách nhà cung cấp
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/', authenticate, supplierController.getAllSuppliers);

/**
 * @openapi
 * /api/suppliers/{id}:
 *   get:
 *     summary: Lấy chi tiết một nhà cung cấp theo ID
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của nhà cung cấp
 *     responses:
 *       200:
 *         description: Chi tiết nhà cung cấp
 *       400:
 *         description: ID không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy nhà cung cấp
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', authenticate, supplierController.getSupplierById);

/**
 * @openapi
 * /api/suppliers:
 *   post:
 *     summary: Thêm một nhà cung cấp mới
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên nhà cung cấp
 *               address:
 *                 type: string
 *                 description: Địa chỉ
 *               phone:
 *                 type: string
 *                 description: Số điện thoại
 *               email:
 *                 type: string
 *                 description: Email (không bắt buộc)
 *     responses:
 *       201:
 *         description: Thêm nhà cung cấp thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.post('/', authenticate, supplierController.createSupplier);

/**
 * @openapi
 * /api/suppliers/{id}:
 *   put:
 *     summary: Cập nhật thông tin nhà cung cấp
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của nhà cung cấp
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên nhà cung cấp
 *               address:
 *                 type: string
 *                 description: Địa chỉ
 *               phone:
 *                 type: string
 *                 description: Số điện thoại
 *               email:
 *                 type: string
 *                 description: Email (không bắt buộc)
 *     responses:
 *       200:
 *         description: Cập nhật nhà cung cấp thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy nhà cung cấp
 *       500:
 *         description: Lỗi server
 */
router.put('/:id', authenticate, supplierController.updateSupplier);

/**
 * @openapi
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Xóa một nhà cung cấp
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của nhà cung cấp
 *     responses:
 *       200:
 *         description: Xóa nhà cung cấp thành công
 *       400:
 *         description: ID không hợp lệ hoặc nhà cung cấp đang được sử dụng
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy nhà cung cấp
 *       500:
 *         description: Lỗi server
 */
router.delete('/:id', authenticate, supplierController.deleteSupplier);

export default router; 