import express from 'express';
import * as medicineController from '../controllers/medicine.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/medicines:
 *   get:
 *     summary: Lấy danh sách tất cả thuốc
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách thuốc
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
 *                         example: "Paracetamol"
 *                       description:
 *                         type: string
 *                         example: "Thuốc giảm đau, hạ sốt"
 *                       price:
 *                         type: integer
 *                         example: 15000
 *                       quantity:
 *                         type: integer
 *                         example: 100
 *                       expirationDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-31T00:00:00.000Z"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-10-20T07:15:20.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-10-20T07:15:20.000Z"
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Thuốc giảm đau"
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/', authenticate, medicineController.getAllMedicines);

/**
 * @openapi
 * /api/medicines:
 *   post:
 *     summary: Thêm thuốc mới
 *     tags: [Medicines]
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
 *               - price
 *               - quantity
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên thuốc
 *               description:
 *                 type: string
 *                 description: Mô tả thuốc
 *               price:
 *                 type: integer
 *                 description: Giá thuốc
 *               quantity:
 *                 type: integer
 *                 description: Số lượng thuốc
 *               expirationDate:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày hết hạn
 *               categoryId:
 *                 type: integer
 *                 description: ID loại thuốc
 *     responses:
 *       201:
 *         description: Thêm thuốc thành công
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
 *                       example: "Paracetamol"
 *                     description:
 *                       type: string
 *                       example: "Thuốc giảm đau, hạ sốt"
 *                     price:
 *                       type: integer
 *                       example: 15000
 *                     quantity:
 *                       type: integer
 *                       example: 100
 *                     expirationDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-31T00:00:00.000Z"
 *                     categoryId:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-20T07:15:20.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-20T07:15:20.000Z"
 *                 message:
 *                   type: string
 *                   example: "Thêm thuốc thành công"
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
 *                   example: "Tên thuốc không được để trống"
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
 *         description: Không tìm thấy loại thuốc
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
 *                   example: "Không tìm thấy loại thuốc"
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
 *                   example: "Đã xảy ra lỗi khi thêm thuốc"
 */
router.post('/', authenticate, medicineController.createMedicine);

/**
 * @openapi
 * /api/medicines/inventory/all:
 *   get:
 *     summary: Xem tồn kho thuốc
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin tồn kho
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
 *                         example: "Paracetamol"
 *                       quantity:
 *                         type: integer
 *                         example: 100
 *                       price:
 *                         type: integer
 *                         example: 15000
 *                       expirationDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-12-31T00:00:00.000Z"
 *                       category:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Thuốc giảm đau"
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get('/inventory/all', authenticate, medicineController.getInventory);

/**
 * @openapi
 * /api/medicines/{id}:
 *   get:
 *     summary: Lấy chi tiết thuốc theo ID
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thuốc
 *     responses:
 *       200:
 *         description: Chi tiết thuốc
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
 *                       example: "Paracetamol"
 *                     description:
 *                       type: string
 *                       example: "Thuốc giảm đau, hạ sốt"
 *                     price:
 *                       type: integer
 *                       example: 15000
 *                     quantity:
 *                       type: integer
 *                       example: 100
 *                     expirationDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-31T00:00:00.000Z"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-20T07:15:20.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-20T07:15:20.000Z"
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Thuốc giảm đau"
 *                         description:
 *                           type: string
 *                           example: "Thuốc dùng để giảm đau và hạ sốt"
 *                 message:
 *                   type: string
 *                   example: "Lấy thông tin thuốc thành công"
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
 *                   example: "ID không hợp lệ"
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
 *         description: Không tìm thấy thuốc
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
 *                   example: "Không tìm thấy thuốc"
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
 *                   example: "Đã xảy ra lỗi khi lấy thông tin thuốc"
 */
router.get('/:id', authenticate, medicineController.getMedicineById);

/**
 * @openapi
 * /api/medicines/{id}:
 *   put:
 *     summary: Cập nhật thông tin thuốc
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thuốc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - quantity
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên thuốc
 *               description:
 *                 type: string
 *                 description: Mô tả thuốc
 *               price:
 *                 type: integer
 *                 description: Giá thuốc
 *               quantity:
 *                 type: integer
 *                 description: Số lượng thuốc
 *               expirationDate:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày hết hạn
 *               categoryId:
 *                 type: integer
 *                 description: ID loại thuốc
 *     responses:
 *       200:
 *         description: Cập nhật thuốc thành công
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
 *                       example: "Paracetamol 500mg"
 *                     description:
 *                       type: string
 *                       example: "Thuốc giảm đau, hạ sốt liều 500mg"
 *                     price:
 *                       type: integer
 *                       example: 18000
 *                     quantity:
 *                       type: integer
 *                       example: 150
 *                     expirationDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-30T00:00:00.000Z"
 *                     categoryId:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-20T07:15:20.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-11-05T09:30:15.000Z"
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thuốc thành công"
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
 *                   example: "Tên thuốc không được để trống"
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
 *         description: Không tìm thấy thuốc hoặc loại thuốc
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
 *                   example: "Không tìm thấy thuốc"
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
 *                   example: "Đã xảy ra lỗi khi cập nhật thuốc"
 */
router.put('/:id', authenticate, medicineController.updateMedicine);

/**
 * @openapi
 * /api/medicines/{id}:
 *   delete:
 *     summary: Xóa thuốc
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thuốc
 *     responses:
 *       200:
 *         description: Xóa thuốc thành công
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
 *                   example: "Xóa thuốc thành công"
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
 *                   example: "ID không hợp lệ"
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
 *         description: Không tìm thấy thuốc
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
 *                   example: "Không tìm thấy thuốc"
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
 *                   example: "Đã xảy ra lỗi khi xóa thuốc"
 */
router.delete('/:id', authenticate, medicineController.deleteMedicine);

export default router; 