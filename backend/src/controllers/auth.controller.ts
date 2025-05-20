import { Request, Response, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

interface RegisterRequestBody {
  fullName: string;
  birthDate: string;
  address: string;
  phone: string;
  email: string;
  username: string;
  password: string;
}

interface LoginRequestBody {
  username: string;
  password: string;
}

/**
 * Đăng ký người dùng mới
 */
export const register: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { 
      fullName,
      birthDate, 
      address, 
      phone, 
      email, 
      username, 
      password 
    } = req.body as RegisterRequestBody;

    // Kiểm tra các trường bắt buộc
    if (!fullName || !birthDate || !address || !phone || !email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin'
      });
    }

    // Kiểm tra xem username đã tồn tại chưa
    const existingEmployee = await prisma.employee.findUnique({
      where: {
        username
      }
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Tên người dùng đã tồn tại'
      });
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingEmail = await prisma.employee.findUnique({
      where: {
        email
      }
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Kiểm tra xem số điện thoại đã tồn tại chưa
    const existingPhone = await prisma.employee.findUnique({
      where: {
        phone
      }
    });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại đã được sử dụng'
      });
    }

    // Mã hóa mật khẩu
    const passwordHash = await hashPassword(password);

    // Tạo người dùng mới
    const newEmployee = await prisma.employee.create({
      data: {
        fullName,
        birthDate: new Date(birthDate),
        address,
        phone,
        email,
        username,
        passwordHash
      }
    });

    // Tạo JWT token
    const token = generateToken({
      userId: newEmployee.id,
      username: newEmployee.username
    });

    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        userId: newEmployee.id,
        username: newEmployee.username,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đăng ký'
    });
  }
};

/**
 * Đăng nhập người dùng
 */
export const login: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as LoginRequestBody;

    // Kiểm tra các trường bắt buộc
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp tên người dùng và mật khẩu'
      });
    }

    // Tìm người dùng theo username
    const employee = await prisma.employee.findUnique({
      where: {
        username
      }
    });

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: 'Tên người dùng hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await comparePassword(password, employee.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Tên người dùng hoặc mật khẩu không đúng'
      });
    }

    // Tạo JWT token
    const token = generateToken({
      userId: employee.id,
      username: employee.username
    });

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        userId: employee.id,
        username: employee.username,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đăng nhập'
    });
  }
}; 