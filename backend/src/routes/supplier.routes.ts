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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Công ty Dược phẩm ABC"
 *                       address:
 *                         type: string
 *                         example: "123 Đường XYZ, Quận 1, TP HCM"
 *                       phone:
 *                         type: string
 *                         example: "0901234567"
 *                       email:
 *                         type: string
 *                         example: "contact@abc-pharma.com"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-10-20T07:15:20.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-10-20T07:15:20.000Z"
 *       401:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không có quyền truy cập"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Đã xảy ra lỗi khi lấy danh sách nhà cung cấp"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Công ty Dược phẩm ABC"
 *                     address:
 *                       type: string
 *                       example: "123 Đường XYZ, Quận 1, TP HCM"
 *                     phone:
 *                       type: string
 *                       example: "0901234567"
 *                     email:
 *                       type: string
 *                       example: "contact@abc-pharma.com"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-20T07:15:20.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-20T07:15:20.000Z"
 *       400:
 *         description: ID không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "ID nhà cung cấp không hợp lệ"
 *       401:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không có quyền truy cập"
 *       404:
 *         description: Không tìm thấy nhà cung cấp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy nhà cung cấp"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Đã xảy ra lỗi khi lấy thông tin nhà cung cấp"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Thêm nhà cung cấp thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Công ty Dược phẩm ABC"
 *                     address:
 *                       type: string
 *                       example: "123 Đường XYZ, Quận 1, TP HCM"
 *                     phone:
 *                       type: string
 *                       example: "0901234567"
 *                     email:
 *                       type: string
 *                       example: "contact@abc-pharma.com"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-20T07:15:20.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-20T07:15:20.000Z"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Dữ liệu không hợp lệ"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Tên nhà cung cấp là bắt buộc", "Số điện thoại không đúng định dạng"]
 *       401:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không có quyền truy cập"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Đã xảy ra lỗi khi thêm nhà cung cấp"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cập nhật nhà cung cấp thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Công ty Dược phẩm ABC"
 *                     address:
 *                       type: string
 *                       example: "123 Đường XYZ, Quận 1, TP HCM"
 *                     phone:
 *                       type: string
 *                       example: "0901234567"
 *                     email:
 *                       type: string
 *                       example: "contact@abc-pharma.com"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-20T07:25:10.000Z"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Dữ liệu không hợp lệ"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Tên nhà cung cấp là bắt buộc", "Số điện thoại không đúng định dạng"]
 *       401:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không có quyền truy cập"
 *       404:
 *         description: Không tìm thấy nhà cung cấp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy nhà cung cấp"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Đã xảy ra lỗi khi cập nhật nhà cung cấp"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Xóa nhà cung cấp thành công"
 *       400:
 *         description: ID không hợp lệ hoặc nhà cung cấp đang được sử dụng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không thể xóa nhà cung cấp đang được sử dụng"
 *       401:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không có quyền truy cập"
 *       404:
 *         description: Không tìm thấy nhà cung cấp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy nhà cung cấp"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Đã xảy ra lỗi khi xóa nhà cung cấp"
 */
router.delete('/:id', authenticate, supplierController.deleteSupplier);

export default router; 