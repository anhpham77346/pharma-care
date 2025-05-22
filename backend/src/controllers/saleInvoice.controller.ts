import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new sale invoice with automatic inventory deduction
export const createSaleInvoice = async (req: Request, res: Response) => {
  try {
    const { employeeId, items } = req.body;

    if (!employeeId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Use transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Create the sale invoice
      const invoice = await tx.saleInvoice.create({
        data: {
          employeeId,
          invoiceDate: new Date(),
        },
      });

      // Create invoice details and update medicine inventory
      const invoiceDetailsPromises = items.map(async (item: { medicineId: number; quantity: number; unitPrice: number }) => {
        // Validate the item
        if (!item.medicineId || !item.quantity || !item.unitPrice) {
          throw new Error('Invalid item data');
        }

        // Get the medicine to check inventory
        const medicine = await tx.medicine.findUnique({
          where: { id: item.medicineId },
        });

        if (!medicine) {
          throw new Error(`Medicine with ID ${item.medicineId} not found`);
        }

        if (medicine.quantity < item.quantity) {
          throw new Error(`Insufficient inventory for medicine: ${medicine.name}`);
        }

        // Create invoice detail
        const invoiceDetail = await tx.saleInvoiceDetail.create({
          data: {
            saleInvoiceId: invoice.id,
            medicineId: item.medicineId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          },
        });

        // Update medicine inventory
        await tx.medicine.update({
          where: { id: item.medicineId },
          data: {
            quantity: medicine.quantity - item.quantity,
          },
        });

        return invoiceDetail;
      });

      const invoiceDetails = await Promise.all(invoiceDetailsPromises);

      return {
        invoice,
        details: invoiceDetails,
      };
    });

    return res.status(201).json({
      message: 'Sale invoice created successfully',
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || 'Failed to create sale invoice',
    });
  }
};

// Get sale invoice by ID
export const getSaleInvoiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const invoice = await prisma.saleInvoice.findUnique({
      where: { id: Number(id) },
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
          },
        },
        details: {
          include: {
            medicine: true,
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Sale invoice not found' });
    }

    return res.status(200).json({ data: invoice });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || 'Failed to get sale invoice',
    });
  }
};

// Search invoices by date range
export const searchInvoicesByDate = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    // Set end date to end of day
    end.setHours(23, 59, 59, 999);

    const invoices = await prisma.saleInvoice.findMany({
      where: {
        invoiceDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        employee: {
          select: {
            id: true,
            fullName: true,
          },
        },
        details: {
          include: {
            medicine: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        invoiceDate: 'desc',
      },
    });

    return res.status(200).json({ data: invoices });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || 'Failed to search invoices',
    });
  }
};

// Get basic revenue report
export const getRevenueReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, groupBy } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    // Set end date to end of day
    end.setHours(23, 59, 59, 999);

    // Get all invoices in the date range with their details
    const invoices = await prisma.saleInvoice.findMany({
      where: {
        invoiceDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        details: {
          include: {
            medicine: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    // Calculate total revenue
    let totalRevenue = 0;
    
    // For detailed reports
    const medicineRevenue: Record<number, { name: string; revenue: number; quantity: number }> = {};
    const categoryRevenue: Record<number, { name: string; revenue: number; quantity: number }> = {};
    const dailyRevenue: Record<string, number> = {};

    // Process each invoice
    invoices.forEach(invoice => {
      const invoiceDate = invoice.invoiceDate.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Initialize daily revenue if not exists
      if (!dailyRevenue[invoiceDate]) {
        dailyRevenue[invoiceDate] = 0;
      }
      
      // Process invoice details
      invoice.details.forEach(detail => {
        const revenue = detail.quantity * detail.unitPrice;
        totalRevenue += revenue;
        dailyRevenue[invoiceDate] += revenue;
        
        // Medicine revenue
        if (!medicineRevenue[detail.medicineId]) {
          medicineRevenue[detail.medicineId] = {
            name: detail.medicine.name,
            revenue: 0,
            quantity: 0,
          };
        }
        medicineRevenue[detail.medicineId].revenue += revenue;
        medicineRevenue[detail.medicineId].quantity += detail.quantity;
        
        // Category revenue
        const categoryId = detail.medicine.categoryId;
        if (!categoryRevenue[categoryId]) {
          categoryRevenue[categoryId] = {
            name: detail.medicine.category.name,
            revenue: 0,
            quantity: 0,
          };
        }
        categoryRevenue[categoryId].revenue += revenue;
        categoryRevenue[categoryId].quantity += detail.quantity;
      });
    });

    // Format the response based on groupBy parameter
    let groupedData = {};
    
    if (groupBy === 'medicine') {
      groupedData = Object.values(medicineRevenue).sort((a, b) => b.revenue - a.revenue);
    } else if (groupBy === 'category') {
      groupedData = Object.values(categoryRevenue).sort((a, b) => b.revenue - a.revenue);
    } else if (groupBy === 'daily') {
      groupedData = Object.entries(dailyRevenue)
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return res.status(200).json({
      data: {
        totalRevenue,
        invoiceCount: invoices.length,
        timeRange: {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        },
        groupedData,
      },
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || 'Failed to generate revenue report',
    });
  }
}; 