import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware xác thực JWT
 */
export const authenticate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  // Lấy token từ header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Không tìm thấy token xác thực'
    });
  }

  // Lấy JWT token từ header
  const token = authHeader.split(' ')[1];
  
  // Xác thực token
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }

  // Lưu thông tin user vào request
  req.user = payload;
  next();
}; 