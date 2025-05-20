import { Request, Response, RequestHandler } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Lấy danh sách tất cả loại thuốc
 */
export const getAllCategories: RequestHandler = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.medicineCategory.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      data: categories,
      message: 'Lấy danh sách loại thuốc thành công'
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách loại thuốc'
    });
  }
};

/**
 * Lấy chi tiết một loại thuốc theo ID
 */
export const getCategoryById: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }

    const category = await prisma.medicineCategory.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy loại thuốc'
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
      message: 'Lấy thông tin loại thuốc thành công'
    });
  } catch (error) {
    console.error('Get category by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thông tin loại thuốc'
    });
  }
};

/**
 * Thêm một loại thuốc mới
 */
export const createCategory: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    // Kiểm tra tên loại thuốc
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tên loại thuốc không được để trống'
      });
    }

    // Kiểm tra xem loại thuốc đã tồn tại chưa
    const existingCategory = await prisma.medicineCategory.findUnique({
      where: {
        name
      }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Loại thuốc này đã tồn tại'
      });
    }

    // Tạo loại thuốc mới
    const newCategory = await prisma.medicineCategory.create({
      data: {
        name,
        description: description || null
      }
    });

    return res.status(201).json({
      success: true,
      data: newCategory,
      message: 'Thêm loại thuốc thành công'
    });
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi thêm loại thuốc'
    });
  }
};

/**
 * Cập nhật thông tin loại thuốc
 */
export const updateCategory: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }

    // Kiểm tra tên loại thuốc
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tên loại thuốc không được để trống'
      });
    }

    // Kiểm tra xem loại thuốc tồn tại không
    const existingCategory = await prisma.medicineCategory.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy loại thuốc'
      });
    }

    // Kiểm tra xem tên đã tồn tại chưa (nếu thay đổi tên)
    if (name !== existingCategory.name) {
      const duplicateName = await prisma.medicineCategory.findUnique({
        where: {
          name
        }
      });

      if (duplicateName) {
        return res.status(400).json({
          success: false,
          message: 'Tên loại thuốc đã tồn tại'
        });
      }
    }

    // Cập nhật loại thuốc
    const updatedCategory = await prisma.medicineCategory.update({
      where: {
        id: Number(id)
      },
      data: {
        name,
        description: description || null
      }
    });

    return res.status(200).json({
      success: true,
      data: updatedCategory,
      message: 'Cập nhật loại thuốc thành công'
    });
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật loại thuốc'
    });
  }
};

/**
 * Xóa một loại thuốc
 */
export const deleteCategory: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }

    // Kiểm tra xem loại thuốc tồn tại không
    const existingCategory = await prisma.medicineCategory.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy loại thuốc'
      });
    }

    // Xóa loại thuốc
    await prisma.medicineCategory.delete({
      where: {
        id: Number(id)
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Xóa loại thuốc thành công'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Lỗi ràng buộc khóa ngoại
      if (error.code === 'P2003') {
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa loại thuốc đang được sử dụng'
        });
      }
    }
    
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xóa loại thuốc'
    });
  }
}; 