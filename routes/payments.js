import express from "express";
import prisma from "../prisma/client.js";

const router = express.Router();

// 1. إضافة دفعة جديدة لطالب (POST)
router.post("/", async (req, res) => {
  const { studentId, amount } = req.body;

  if (!studentId || !amount) {
    return res.status(400).json({ error: "Student ID and Amount are required" });
  }

  try {
    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        studentId: parseInt(studentId),
        // التاريخ بيتسجل تلقائي @default(now()) في الـ Schema
      },
    });
    res.json(payment);
  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).json({ error: "فشل تسجيل عملية الدفع" });
  }
});

// 2. جلب ملخص الدفع (GET Summary) 👈 ميزة جديدة للتقارير
router.get("/summary", async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // حساب إجمالي دخل الشهر الحالي
    const monthlyTotal = await prisma.payment.aggregate({
      where: {
        date: {
          gte: startOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // حساب إجمالي الدخل التاريخي
    const allTimeTotal = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
    });

    res.json({
      monthlyTotal: monthlyTotal._sum.amount || 0,
      allTimeTotal: allTimeTotal._sum.amount || 0,
    });
  } catch (err) {
    console.error("Summary Error:", err);
    res.status(500).json({ error: "تعذر جلب ملخص الحسابات" });
  }
});

// 3. جلب آخر عمليات دفع (الاختياري - لعرض سجل العمليات)
router.get("/recent", async (req, res) => {
  try {
    const recentPayments = await prisma.payment.findMany({
      take: 10,
      orderBy: { date: 'desc' },
      include: { student: { select: { name: true } } }
    });
    res.json(recentPayments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;