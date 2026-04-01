import express from "express";
import prisma from "../prisma/client.js";

const router = express.Router();

// 1. تسجيل حضور طالب (POST)
router.post("/", async (req, res) => {
  const { studentId } = req.body;
  try {
    const attendance = await prisma.attendance.create({
      data: {
        studentId: parseInt(studentId),
        date: new Date() // بيسجل تاريخ اللحظة دي
      }
    });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: "تعذر تسجيل الحضور" });
  }
});

// 2. جلب سجل حضور طالب معين (GET)
router.get("/:studentId", async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      where: { studentId: parseInt(req.params.studentId) },
      orderBy: { date: 'desc' }
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;