import { Request, Response, RequestHandler } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Lấy danh sách tất cả nhà cung cấp
 */
export const getAllSuppliers: RequestHandler = async (req: Request, res: Response) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      data: suppliers,
      message: 'Lấy danh sách nhà cung cấp thành công'
    });
  } catch (error) {
    console.error('Get all suppliers error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách nhà cung cấp'
    });
  }
};

/**
 * Lấy chi tiết một nhà cung cấp theo ID
 */
export const getSupplierById: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }

    const supplier = await prisma.supplier.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà cung cấp'
      });
    }

    return res.status(200).json({
      success: true,
      data: supplier,
      message: 'Lấy thông tin nhà cung cấp thành công'
    });
  } catch (error) {
    console.error('Get supplier by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thông tin nhà cung cấp'
    });
  }
};

/**
 * Thêm một nhà cung cấp mới
 */
export const createSupplier: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { name, address, phone, email } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tên nhà cung cấp không được để trống'
      });
    }

    if (!address || address.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Địa chỉ không được để trống'
      });
    }

    if (!phone || phone.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại không được để trống'
      });
    }

    // Tạo nhà cung cấp mới
    const newSupplier = await prisma.supplier.create({
      data: {
        name,
        address,
        phone,
        email: email || null
      }
    });

    return res.status(201).json({
      success: true,
      data: newSupplier,
      message: 'Thêm nhà cung cấp thành công'
    });
  } catch (error) {
    console.error('Create supplier error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi thêm nhà cung cấp'
    });
  }
};

/**
 * Cập nhật thông tin nhà cung cấp
 */
export const updateSupplier: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, phone, email } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }

    // Kiểm tra dữ liệu bắt buộc
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tên nhà cung cấp không được để trống'
      });
    }

    if (!address || address.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Địa chỉ không được để trống'
      });
    }

    if (!phone || phone.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại không được để trống'
      });
    }

    // Kiểm tra xem nhà cung cấp tồn tại không
    const existingSupplier = await prisma.supplier.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!existingSupplier) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà cung cấp'
      });
    }

    // Cập nhật nhà cung cấp
    const updatedSupplier = await prisma.supplier.update({
      where: {
        id: Number(id)
      },
      data: {
        name,
        address,
        phone,
        email: email || null
      }
    });

    return res.status(200).json({
      success: true,
      data: updatedSupplier,
      message: 'Cập nhật nhà cung cấp thành công'
    });
  } catch (error) {
    console.error('Update supplier error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật nhà cung cấp'
    });
  }
};

/**
 * Xóa một nhà cung cấp
 */
export const deleteSupplier: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }

    // Kiểm tra xem nhà cung cấp tồn tại không
    const existingSupplier = await prisma.supplier.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!existingSupplier) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà cung cấp'
      });
    }

    // Xóa nhà cung cấp
    await prisma.supplier.delete({
      where: {
        id: Number(id)
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Xóa nhà cung cấp thành công'
    });
  } catch (error) {
    console.error('Delete supplier error:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Lỗi ràng buộc khóa ngoại
      if (error.code === 'P2003') {
        return res.status(400).json({
          success: false,
          message: 'Không thể xóa nhà cung cấp đang được sử dụng'
        });
      }
    }
    
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xóa nhà cung cấp'
    });
  }
}; 