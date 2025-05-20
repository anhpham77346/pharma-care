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
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
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
 *       400:
 *         description: ID không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy loại thuốc
 *       500:
 *         description: Lỗi server
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
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
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
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy loại thuốc
 *       500:
 *         description: Lỗi server
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
 *       400:
 *         description: ID không hợp lệ hoặc loại thuốc đang được sử dụng
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy loại thuốc
 *       500:
 *         description: Lỗi server
 */
router.delete('/:id', authenticate, medicineCategoryController.deleteCategory);

export default router; 