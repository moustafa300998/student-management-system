import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// استيراد الـ Routes
import authRoutes from "./routes/auth.js";
import studentsRoutes from "./routes/students.js";
import paymentRoutes from "./routes/payments.js"; 
import attendanceRoutes from "./routes/attendance.js";

dotenv.config();

const app = express();

// Middleware
// ✅ تعديل الـ CORS للسماح لموقعك بالاتصال بالسيرفر
app.use(cors({
  origin: "https://quran-dashboard-frontend.onrender.com",
  credentials: true
}));

app.use(express.json());

// Routes Linking (ربط المسارات)
app.use("/auth", authRoutes);         
app.use("/students", studentsRoutes); 
app.use("/payments", paymentRoutes);   
app.use("/attendance", attendanceRoutes); 

// Test Route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong on the server!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});