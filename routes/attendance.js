import express from "express";
import prisma from "../prisma/client.js";

const router = express.Router();

// 1. تسجيل حضور طالب (POST)
router.post("/", async (req, res) => {
  const { studentId } = req.body;

  // تأكد أن الـ ID مبعوث صح
  if (!studentId) {
    return res.status(400).json({ error: "Student ID is required" });
  }

  try {
    const attendance = await prisma.attendance.create({
      data: {
        studentId: parseInt(studentId),
        // ملحوظة: الـ date هيتسجل تلقائي الآن من الداتابيز 
        // لأننا عرفناه في الـ Schema بـ @default(now())
      }
    });
    res.json(attendance);
  } catch (err) {
    console.error("Attendance Error:", err);
    res.status(500).json({ error: "تعذر تسجيل الحضور، تأكد من وجود الطالب" });
  }
});

// 2. جلب سجل حضور طالب معين (GET)
router.get("/:studentId", async (req, res) => {
  const { studentId } = req.params;
  
  try {
    const records = await prisma.attendance.findMany({
      where: { 
        studentId: parseInt(studentId) 
      },
      orderBy: { 
        date: 'desc' // عرض أحدث أيام الحضور أولاً
      }
    });
    res.json(records);
  } catch (err) {
    console.error("Fetch Attendance Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 3. (إضافة اختيارية) مسح سجل حضور معين
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.attendance.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "تم حذف سجل الحضور" });
  } catch (err) {
    res.status(500).json({ error: "فشل الحذف" });
  }
});

export default router;