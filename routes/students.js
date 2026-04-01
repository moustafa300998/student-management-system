import express from "express";
import prisma from "../prisma/client.js";

const router = express.Router();

// 1. جلب كل الطلاب مع مدفوعاتهم (GET)
router.get("/", async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: { 
        payments: true // أساسي عشان الـ Revenue والـ Chart
      },
      orderBy: {
        createdAt: 'desc' // الأحدث يظهر أولاً
      }
    });
    res.json(students);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "تعذر جلب بيانات الطلاب" });
  }
});

// 2. إضافة طالب جديد (POST)
router.post("/", async (req, res) => {
  const { name, level } = req.body;
  if (!name || !level) {
    return res.status(400).json({ error: "الاسم والمستوى مطلوبان" });
  }
  
  try {
    const newStudent = await prisma.student.create({
      data: { 
        name, 
        level: String(level) // التأكد من نوع البيانات
      },
      include: { payments: true } // نرجعه مع مصفوفة دفع فاضية عشان الـ Frontend ما يضربش
    });
    res.json(newStudent);
  } catch (err) {
    console.error("Add Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 3. تعديل بيانات طالب (PUT)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, level } = req.body;
  
  try {
    const updated = await prisma.student.update({
      where: { id: parseInt(id) },
      data: { 
        name, 
        level: String(level) 
      },
      include: { payments: true }
    });
    res.json(updated);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "فشل التعديل، تأكد من وجود الطالب" });
  }
});

// 4. مسح طالب (DELETE)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.student.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "تم حذف الطالب بنجاح" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "فشل الحذف، قد يكون الطالب غير موجود" });
  }
});

export default router;