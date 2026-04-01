import { PrismaClient } from '@prisma/client';

// تعريف النسخة مع معالجة الخطأ لو الـ Client مش جاهز
let prisma;

try {
  prisma = new PrismaClient();
} catch (e) {
  console.error("Prisma failed to initialize. Try running 'npx prisma generate'");
  throw e;
}

export default prisma;