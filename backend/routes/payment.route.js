import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { checkoutSuccess, createCheckoutSesssion } from '../controllers/payment.controller.js';


const paymentRoutes = express.Router();

paymentRoutes.post("/create-checkout-session" , protectRoute , createCheckoutSesssion);
paymentRoutes.post("/checkout-success" , protectRoute , checkoutSuccess);

export default paymentRoutes