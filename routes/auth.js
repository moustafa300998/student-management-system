import express from "express";
import bcrypt from "bcryptjs"; // تم التعديل للتوافق مع package.json
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // التحقق من وجود المستخدم مسبقاً (عشان تتجنب Register failed)
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "student", 
      },
    });

    // نرجع البيانات بدون الباسورد للأمان
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ message: "User registered ✅", user: userWithoutPassword });
  } catch (err) {
    console.error("Register Error:", err); // هيطبع لك السبب في الـ Terminal
    res.status(500).json({ error: "Register failed, check backend console" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" }); // رسالة موحدة للأمان
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // التأكد من وجود المفتاح السري
    const secret = process.env.JWT_SECRET || "default_secret_key";

    const token = jwt.sign(
      { id: user.id, role: user.role },
      secret,
      { expiresIn: "1d" } // إضافة وقت انتهاء للتوكن
    );

    res.json({ message: "Login successful ✅", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;