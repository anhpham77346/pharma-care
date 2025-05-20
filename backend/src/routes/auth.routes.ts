import express, { Request, Response, RequestHandler } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - birthDate
 *               - address
 *               - phone
 *               - email
 *               - username
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Họ tên đầy đủ
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày sinh (YYYY-MM-DD)
 *               address:
 *                 type: string
 *                 description: Địa chỉ
 *               phone:
 *                 type: string
 *                 description: Số điện thoại
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Địa chỉ email
 *               username:
 *                 type: string
 *                 description: Tên người dùng
 *               password:
 *                 type: string
 *                 description: Mật khẩu
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post('/register', authController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Tên người dùng
 *               password:
 *                 type: string
 *                 description: Mật khẩu
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Thông tin đăng nhập không đúng
 *       500:
 *         description: Lỗi server
 */
router.post('/login', authController.login);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
const getMeHandler: RequestHandler = (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: {
      userId: req.user?.userId,
      username: req.user?.username
    }
  });
};

router.get('/me', authenticate, getMeHandler);

/**
 * @openapi
 * /api/auth/profile:
 *   put:
 *     summary: Cập nhật thông tin cá nhân
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Họ tên đầy đủ
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày sinh (YYYY-MM-DD)
 *               address:
 *                 type: string
 *                 description: Địa chỉ
 *               phone:
 *                 type: string
 *                 description: Số điện thoại
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Địa chỉ email
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.put('/profile', authenticate, authController.updateProfile);

/**
 * @openapi
 * /api/auth/change-password:
 *   post:
 *     summary: Đổi mật khẩu
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Mật khẩu hiện tại
 *               newPassword:
 *                 type: string
 *                 description: Mật khẩu mới (ít nhất 6 ký tự)
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc mật khẩu hiện tại không đúng
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.post('/change-password', authenticate, authController.changePassword);

export default router; 