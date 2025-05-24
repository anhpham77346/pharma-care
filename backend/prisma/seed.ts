import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function main() {
  const hashedPassword1 = await hashPassword('password123');
  const hashedPassword2 = await hashPassword('password123');

  // Create Employees
  const employee1 = await prisma.employee.create({
    data: {
      fullName: 'Nguyễn Văn An',
      birthDate: new Date('1985-06-15'),
      address: 'Số 10, Đường Trần Hưng Đạo, Quận 1, TP. Hồ Chí Minh',
      phone: '0903123456',
      email: 'nguyen.van.an@example.com',
      username: 'annguyen',
      passwordHash: hashedPassword1,
    },
  });

  const employee2 = await prisma.employee.create({
    data: {
      fullName: 'Trần Thị Bích',
      birthDate: new Date('1992-11-20'),
      address: 'Số 25, Phố Huế, Quận Hai Bà Trưng, Hà Nội',
      phone: '0912987654',
      email: 'tran.thi.bich@example.com',
      username: 'bichtran',
      passwordHash: hashedPassword2,
    },
  });

  console.log({ employee1, employee2 });

  // Create Medicine Categories
  const category1 = await prisma.medicineCategory.create({
    data: {
      name: 'Thuốc giảm đau, hạ sốt',
      description: 'Các loại thuốc dùng để giảm đau và hạ sốt thông thường.',
    },
  });

  const category2 = await prisma.medicineCategory.create({
    data: {
      name: 'Thuốc kháng sinh',
      description: 'Các loại thuốc dùng để điều trị nhiễm khuẩn do vi khuẩn.',
    },
  });

  const category3 = await prisma.medicineCategory.create({
    data: {
      name: 'Thuốc ho, long đờm',
      description: 'Các loại thuốc dùng để giảm ho và làm loãng đờm.',
    },
  });

   const category4 = await prisma.medicineCategory.create({
    data: {
      name: 'Vitamin và khoáng chất',
      description: 'Bổ sung vitamin và khoáng chất thiết yếu cho cơ thể.',
    },
  });

  console.log({ category1, category2, category3, category4 });

  // Create Medicines
  const medicine1 = await prisma.medicine.create({
    data: {
      name: 'Panadol Extra',
      description: 'Giảm đau đầu, đau nửa đầu, đau răng, đau bụng kinh. Hạ sốt.',
      price: 25000,
      quantity: 200,
      expirationDate: new Date('2026-05-10'),
      category: {
        connect: { id: category1.id },
      },
    },
  });

  const medicine2 = await prisma.medicine.create({
    data: {
      name: 'Augmentin 625mg',
      description: 'Điều trị nhiễm khuẩn đường hô hấp, tiết niệu, da và mô mềm.',
      price: 180000,
      quantity: 75,
      expirationDate: new Date('2025-08-22'),
      category: {
        connect: { id: category2.id },
      },
    },
  });

  const medicine3 = await prisma.medicine.create({
    data: {
      name: 'Terpin Codein',
      description: 'Trị ho khan, ho do kích ứng.',
      price: 45000,
      quantity: 120,
      expirationDate: new Date('2025-11-15'),
      category: {
        connect: { id: category3.id },
      },
    },
  });

  const medicine4 = await prisma.medicine.create({
    data: {
      name: 'Berocca Performance',
      description: 'Bổ sung vitamin nhóm B, vitamin C, canxi, magie, kẽm. Giúp giảm căng thẳng, tăng cường năng lượng.',
      price: 150000,
      quantity: 90,
      expirationDate: new Date('2026-01-30'),
      category: {
        connect: { id: category4.id },
      },
    },
  });

  console.log({ medicine1, medicine2, medicine3, medicine4 });

  // Create Suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'Công ty Dược Hậu Giang (DHG Pharma)',
      address: '288 Bis Nguyễn Văn Cừ, Phường An Hòa, Quận Ninh Kiều, TP. Cần Thơ',
      phone: '02923891433',
      email: 'dhgpharma@dhgpharma.com.vn',
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'Công ty Cổ phần Traphaco',
      address: '75 Phố Yên Ninh, Phường Trúc Bạch, Quận Ba Đình, Hà Nội',
      phone: '02437676522',
      email: 'info@traphaco.com.vn',
    },
  });
   const supplier3 = await prisma.supplier.create({
    data: {
      name: 'GlaxoSmithKline (GSK) Việt Nam',
      address: 'Tầng 10, Tòa nhà CentrePoint, 106 Nguyễn Văn Trỗi, Phường 8, Quận Phú Nhuận, TP.HCM',
      phone: '02838453100',
      email: 'contact.vn@gsk.com',
    },
  });

  console.log({ supplier1, supplier2, supplier3 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 