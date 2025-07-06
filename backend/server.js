import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from "cors";

import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import path from 'path';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

const app = express();

const __dirname = path.resolve();


// ✅ Use middlewares first
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use(
  cors({
    origin: true, // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allowed HTTP methods
    credentials: true, // Allow cookies/auth headers
    allowedHeaders: ["Content-Type", "Authorization"], // Explicitly allow these headers
  })
);

// ✅ Then use routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 7000;

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/dist')));

  app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});
}

app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
  connectDB();
});
