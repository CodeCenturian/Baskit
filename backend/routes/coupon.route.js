import express from 'express'
import { getCoupon , validateCoupon } from '../controllers/coupon.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const couponRoutes = express.Router();

couponRoutes.get("/" , protectRoute , getCoupon);
couponRoutes.get("/" , protectRoute , validateCoupon);


export default couponRoutes