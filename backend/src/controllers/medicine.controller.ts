import { Request, Response, RequestHandler } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Lấy danh sách tất cả thuốc
 */
export const getAllMedicines: RequestHandler = async (req: Request, res: Response) => {
  try {
    const medicines = await prisma.medicine.findMany({
      include: {
        category: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      data: medicines,
      message: 'Lấy danh sách thuốc thành công'
    });
  } catch (error) {
    console.error('Get all medicines error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách thuốc'
    });
  }
};

/**
 * Lấy chi tiết thuốc theo ID
 */
export const getMedicineById: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }

    const medicine = await prisma.medicine.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        category: true
      }
    });

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thuốc'
      });
    }

    return res.status(200).json({
      success: true,
      data: medicine,
      message: 'Lấy thông tin thuốc thành công'
    });
  } catch (error) {
    console.error('Get medicine by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thông tin thuốc'
    });
  }
};

/**
 * Thêm thuốc mới
 */
export const createMedicine: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { name, description, price, quantity, expirationDate, categoryId } = req.body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tên thuốc không được để trống'
      });
    }

    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Giá thuốc không hợp lệ'
      });
    }

    if (!quantity || isNaN(Number(quantity)) || Number(quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng thuốc không hợp lệ'
      });
    }

    if (!categoryId || isNaN(Number(categoryId))) {
      return res.status(400).json({
        success: false,
        message: 'Loại thuốc không hợp lệ'
      });
    }

    // Check if category exists
    const category = await prisma.medicineCategory.findUnique({
      where: {
        id: Number(categoryId)
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy loại thuốc'
      });
    }

    // Create medicine
    const newMedicine = await prisma.medicine.create({
      data: {
        name,
        description: description || null,
        price: Number(price),
        quantity: Number(quantity),
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        categoryId: Number(categoryId)
      }
    });

    return res.status(201).json({
      success: true,
      data: newMedicine,
      message: 'Thêm thuốc thành công'
    });
  } catch (error) {
    console.error('Create medicine error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi thêm thuốc'
    });
  }
};

/**
 * Cập nhật thông tin thuốc
 */
export const updateMedicine: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, expirationDate, categoryId } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }

    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tên thuốc không được để trống'
      });
    }

    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Giá thuốc không hợp lệ'
      });
    }

    if (!quantity || isNaN(Number(quantity)) || Number(quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng thuốc không hợp lệ'
      });
    }

    if (!categoryId || isNaN(Number(categoryId))) {
      return res.status(400).json({
        success: false,
        message: 'Loại thuốc không hợp lệ'
      });
    }

    // Check if medicine exists
    const existingMedicine = await prisma.medicine.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!existingMedicine) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thuốc'
      });
    }

    // Check if category exists
    const category = await prisma.medicineCategory.findUnique({
      where: {
        id: Number(categoryId)
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy loại thuốc'
      });
    }

    // Update medicine
    const updatedMedicine = await prisma.medicine.update({
      where: {
        id: Number(id)
      },
      data: {
        name,
        description: description || null,
        price: Number(price),
        quantity: Number(quantity),
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        categoryId: Number(categoryId)
      }
    });

    return res.status(200).json({
      success: true,
      data: updatedMedicine,
      message: 'Cập nhật thuốc thành công'
    });
  } catch (error) {
    console.error('Update medicine error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật thuốc'
    });
  }
};

/**
 * Xóa thuốc
 */
export const deleteMedicine: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }

    // Check if medicine exists
    const existingMedicine = await prisma.medicine.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!existingMedicine) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thuốc'
      });
    }

    // Delete medicine
    await prisma.medicine.delete({
      where: {
        id: Number(id)
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Xóa thuốc thành công'
    });
  } catch (error) {
    console.error('Delete medicine error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xóa thuốc'
    });
  }
};

/**
 * Lấy thông tin tồn kho
 */
export const getInventory: RequestHandler = async (req: Request, res: Response) => {
  try {
    const medicines = await prisma.medicine.findMany({
      select: {
        id: true,
        name: true,
        quantity: true,
        price: true,
        expirationDate: true,
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        quantity: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      data: medicines,
      message: 'Lấy thông tin tồn kho thành công'
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thông tin tồn kho'
    });
  }
}; 