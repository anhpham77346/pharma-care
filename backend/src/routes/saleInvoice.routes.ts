import express from 'express';
import {
  createSaleInvoice,
  getSaleInvoiceById,
  searchInvoicesByDate,
  getRevenueReport,
} from '../controllers/saleInvoice.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Medicine:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: integer
 *         quantity:
 *           type: integer
 *         description:
 *           type: string
 *         categoryId:
 *           type: integer
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *
 *     Employee:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         fullName:
 *           type: string
 *
 *     SaleInvoiceDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         quantity:
 *           type: integer
 *         unitPrice:
 *           type: integer
 *         medicineId:
 *           type: integer
 *         saleInvoiceId:
 *           type: integer
 *         medicine:
 *           $ref: '#/components/schemas/Medicine'
 *
 *     SaleInvoice:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         invoiceDate:
 *           type: string
 *           format: date-time
 *         employeeId:
 *           type: integer
 *         employee:
 *           $ref: '#/components/schemas/Employee'
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SaleInvoiceDetail'
 *
 *     MedicineRevenue:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         revenue:
 *           type: integer
 *         quantity:
 *           type: integer
 *
 *     CategoryRevenue:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         revenue:
 *           type: integer
 *         quantity:
 *           type: integer
 *
 *     DailyRevenue:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *         revenue:
 *           type: integer
 *
 *     RevenueReport:
 *       type: object
 *       properties:
 *         totalRevenue:
 *           type: integer
 *         invoiceCount:
 *           type: integer
 *         timeRange:
 *           type: object
 *           properties:
 *             start:
 *               type: string
 *               format: date
 *             end:
 *               type: string
 *               format: date
 *         groupedData:
 *           type: array
 *           items:
 *             oneOf:
 *               - $ref: '#/components/schemas/MedicineRevenue'
 *               - $ref: '#/components/schemas/CategoryRevenue'
 *               - $ref: '#/components/schemas/DailyRevenue'
 */

/**
 * @swagger
 * tags:
 *   name: SaleInvoice
 *   description: Sale invoice management
 */

/**
 * @swagger
 * /api/sale-invoices:
 *   post:
 *     summary: Create a new sale invoice (employeeId is from token)
 *     tags: [SaleInvoice]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - medicineId
 *                     - quantity
 *                     - unitPrice
 *                   properties:
 *                     medicineId:
 *                       type: integer
 *                       description: ID of the medicine
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of medicine
 *                     unitPrice:
 *                       type: integer
 *                       description: Unit price of medicine
 *     responses:
 *       201:
 *         description: Sale invoice created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sale invoice created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoice:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         invoiceDate:
 *                           type: string
 *                           format: date-time
 *                         employeeId:
 *                           type: integer
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           quantity:
 *                             type: integer
 *                           unitPrice:
 *                             type: integer
 *                           medicineId:
 *                             type: integer
 *                           saleInvoiceId:
 *                             type: integer
 *       400:
 *         description: Invalid input data or business logic error (e.g., insufficient stock)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid item data: medicineId, quantity, and unitPrice are required for each item."
 *       401:
 *         description: Unauthorized (e.g., token missing or invalid)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized: Employee ID (userId) not found in token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to create sale invoice due to an internal server error."
 */
router.post('/', authenticate, createSaleInvoice);

/**
 * @swagger
 * /api/sale-invoices/search:
 *   get:
 *     summary: Search invoices by date range
 *     tags: [SaleInvoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: List of invoices in the date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       invoiceDate:
 *                         type: string
 *                         format: date-time
 *                       employeeId:
 *                         type: integer
 *                       employee:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           fullName:
 *                             type: string
 *                       details:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             quantity:
 *                               type: integer
 *                             unitPrice:
 *                               type: integer
 *                             medicineId:
 *                               type: integer
 *                             medicine:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                 name:
 *                                   type: string
 *       400:
 *         description: Invalid date parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Start date and end date are required"
 */
router.get('/search', authenticate, searchInvoicesByDate);

/**
 * @swagger
 * /api/sale-invoices/report/revenue:
 *   get:
 *     summary: Get basic revenue report
 *     tags: [SaleInvoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date in YYYY-MM-DD format
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date in YYYY-MM-DD format
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [medicine, category, daily]
 *         description: Group revenue data by medicine, category, or daily
 *     responses:
 *       200:
 *         description: Revenue report data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/RevenueReport'
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Start date and end date are required"
 */
router.get('/report/revenue', authenticate, getRevenueReport);

/**
 * @swagger
 * /api/sale-invoices/{id}:
 *   get:
 *     summary: Get a sale invoice by ID
 *     tags: [SaleInvoice]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the sale invoice
 *     responses:
 *       200:
 *         description: Sale invoice details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/SaleInvoice'
 *       404:
 *         description: Sale invoice not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sale invoice not found"
 */
router.get('/:id', authenticate, getSaleInvoiceById);

export default router; 