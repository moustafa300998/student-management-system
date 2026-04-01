import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// استيراد الـ Routes
import authRoutes from "./routes/auth.js";
import studentsRoutes from "./routes/students.js";
import paymentRoutes from "./routes/payments.js"; 
import attendanceRoutes from "./routes/attendance.js"; // 👈 تم التفعيل بنجاح ✅

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Linking (ربط المسارات)
app.use("/auth", authRoutes);         // مسارات الدخول والتسجيل
app.use("/students", studentsRoutes); // مسارات الطلاب (CRUD)
app.use("/payments", paymentRoutes);   // مسارات الدفع (Revenue)
app.use("/attendance", attendanceRoutes); // 👈 تم التفعيل بنجاح ✅

// Test Route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Error Handling Middleware (احترافي لمعالجة أي خطأ غير متوقع)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong on the server!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});