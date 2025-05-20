import { Request, Response, RequestHandler } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
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

interface UpdateProfileRequestBody {
  fullName?: string;
  birthDate?: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface ChangePasswordRequestBody {
  currentPassword: string;
  newPassword: string;
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

/**
 * Cập nhật thông tin cá nhân
 */
export const updateProfile: RequestHandler = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Không xác thực được người dùng'
      });
    }

    const userId = req.user.userId;
    const { 
      fullName, 
      birthDate, 
      address, 
      phone, 
      email
    } = req.body as UpdateProfileRequestBody;

    // Lấy thông tin người dùng hiện tại
    const employee = await prisma.employee.findUnique({
      where: {
        id: userId
      }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Kiểm tra thay đổi email
    if (email && email !== employee.email) {
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
    }

    // Kiểm tra thay đổi số điện thoại
    if (phone && phone !== employee.phone) {
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
    }

    // Dữ liệu cập nhật
    const updateData: Prisma.EmployeeUpdateInput = {};
    
    if (fullName) updateData.fullName = fullName;
    if (birthDate) updateData.birthDate = new Date(birthDate);
    if (address) updateData.address = address;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;

    // Cập nhật thông tin người dùng
    const updatedEmployee = await prisma.employee.update({
      where: {
        id: userId
      },
      data: updateData
    });

    return res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: {
        userId: updatedEmployee.id,
        username: updatedEmployee.username,
        fullName: updatedEmployee.fullName,
        email: updatedEmployee.email,
        phone: updatedEmployee.phone,
        address: updatedEmployee.address,
        birthDate: updatedEmployee.birthDate
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật thông tin'
    });
  }
};

/**
 * Đổi mật khẩu người dùng
 */
export const changePassword: RequestHandler = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Không xác thực được người dùng'
      });
    }

    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body as ChangePasswordRequestBody;

    // Kiểm tra các trường bắt buộc
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới'
      });
    }

    // Lấy thông tin người dùng hiện tại
    const employee = await prisma.employee.findUnique({
      where: {
        id: userId
      }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await comparePassword(currentPassword, employee.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Mã hóa mật khẩu mới
    const newPasswordHash = await hashPassword(newPassword);

    // Cập nhật mật khẩu mới
    await prisma.employee.update({
      where: {
        id: userId
      },
      data: {
        passwordHash: newPasswordHash
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đổi mật khẩu'
    });
  }
};

/**
 * Lấy thông tin người dùng hiện tại
 */
export const getMe: RequestHandler = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Không xác thực được người dùng'
      });
    }

    const userId = req.user.userId;
    
    // Fetch complete user information from database
    const user = await prisma.employee.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        birthDate: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      });
    }

    return res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thông tin người dùng'
    });
  }
}; 