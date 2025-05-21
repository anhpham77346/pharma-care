import express, { Request, Response, RequestHandler } from 'express';
import * as medicineCategoryController from '../controllers/medicineCategory.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/medicine-categories:
 *   get:
 *     summary: Lấy danh sách tất cả loại thuốc
 *     tags: [Medicine Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách loại thuốc
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
 *                         example: "Thuốc kháng sinh"
 *                       description:
 *                         type: string
 *                         example: "Nhóm thuốc dùng để tiêu diệt hoặc ức chế sự phát triển của vi khuẩn"
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
 *                   example: "Đã xảy ra lỗi khi lấy danh sách loại thuốc"
 */
router.get('/', authenticate, medicineCategoryController.getAllCategories);

/**
 * @openapi
 * /api/medicine-categories/{id}:
 *   get:
 *     summary: Lấy chi tiết một loại thuốc theo ID
 *     tags: [Medicine Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của loại thuốc
 *     responses:
 *       200:
 *         description: Chi tiết loại thuốc
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
 *                       example: "Thuốc kháng sinh"
 *                     description:
 *                       type: string
 *                       example: "Nhóm thuốc dùng để tiêu diệt hoặc ức chế sự phát triển của vi khuẩn"
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
 *                   example: "ID loại thuốc không hợp lệ"
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
 *                   example: "Đã xảy ra lỗi khi lấy thông tin loại thuốc"
 */
router.get('/:id', authenticate, medicineCategoryController.getCategoryById);

/**
 * @openapi
 * /api/medicine-categories:
 *   post:
 *     summary: Thêm một loại thuốc mới
 *     tags: [Medicine Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên loại thuốc
 *               description:
 *                 type: string
 *                 description: Mô tả loại thuốc
 *     responses:
 *       201:
 *         description: Thêm loại thuốc thành công
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
 *                   example: "Thêm loại thuốc thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Thuốc kháng sinh"
 *                     description:
 *                       type: string
 *                       example: "Nhóm thuốc dùng để tiêu diệt hoặc ức chế sự phát triển của vi khuẩn"
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
 *                   example: ["Tên loại thuốc là bắt buộc", "Tên loại thuốc đã tồn tại"]
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
 *                   example: "Đã xảy ra lỗi khi thêm loại thuốc"
 */
router.post('/', authenticate, medicineCategoryController.createCategory);

/**
 * @openapi
 * /api/medicine-categories/{id}:
 *   put:
 *     summary: Cập nhật thông tin loại thuốc
 *     tags: [Medicine Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của loại thuốc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên loại thuốc
 *               description:
 *                 type: string
 *                 description: Mô tả loại thuốc
 *     responses:
 *       200:
 *         description: Cập nhật loại thuốc thành công
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
 *                   example: "Cập nhật loại thuốc thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Thuốc kháng sinh"
 *                     description:
 *                       type: string
 *                       example: "Nhóm thuốc dùng để tiêu diệt hoặc ức chế sự phát triển của vi khuẩn"
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
 *                   example: ["Tên loại thuốc là bắt buộc", "Tên loại thuốc đã tồn tại"]
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
 *                   example: "Đã xảy ra lỗi khi cập nhật loại thuốc"
 */
router.put('/:id', authenticate, medicineCategoryController.updateCategory);

/**
 * @openapi
 * /api/medicine-categories/{id}:
 *   delete:
 *     summary: Xóa một loại thuốc
 *     tags: [Medicine Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của loại thuốc
 *     responses:
 *       200:
 *         description: Xóa loại thuốc thành công
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
 *                   example: "Xóa loại thuốc thành công"
 *       400:
 *         description: ID không hợp lệ hoặc loại thuốc đang được sử dụng
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
 *                   example: "Không thể xóa loại thuốc đang được sử dụng"
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
 *                   example: "Đã xảy ra lỗi khi xóa loại thuốc"
 */
router.delete('/:id', authenticate, medicineCategoryController.deleteCategory);

export default router; 