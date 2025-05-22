-- CreateTable
CREATE TABLE `SaleInvoice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `invoiceDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `employeeId` INTEGER NOT NULL,

    INDEX `SaleInvoice_employeeId_idx`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleInvoiceDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `unitPrice` INTEGER NOT NULL,
    `saleInvoiceId` INTEGER NOT NULL,
    `medicineId` INTEGER NOT NULL,

    INDEX `SaleInvoiceDetail_saleInvoiceId_idx`(`saleInvoiceId`),
    INDEX `SaleInvoiceDetail_medicineId_idx`(`medicineId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SaleInvoice` ADD CONSTRAINT `SaleInvoice_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleInvoiceDetail` ADD CONSTRAINT `SaleInvoiceDetail_saleInvoiceId_fkey` FOREIGN KEY (`saleInvoiceId`) REFERENCES `SaleInvoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleInvoiceDetail` ADD CONSTRAINT `SaleInvoiceDetail_medicineId_fkey` FOREIGN KEY (`medicineId`) REFERENCES `Medicine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
