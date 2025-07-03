import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import { connectDB } from './lib/db.js';
const app = express();
import cookieParser from 'cookie-parser';


app.use(cookieParser()); // parse the cookies to req.cookies...
app.use(express.json()); // parse the body to json

//Routes
app.use("/api/auth" , authRoutes);
app.use("/api/products" , productRoutes);
app.use("/api/cart" , cartRoutes);
app.use("/api/coupons" , couponRoutes);
app.use("/api/payments" , paymentRoutes);
app.use("/api/analytics" , analyticsRoutes);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log("Server is running on port :",PORT);
    connectDB();
});

