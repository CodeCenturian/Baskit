import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getCartProducts , addToCart , removeFromCart , updateQuantity } from '../controllers/cart.controller.js';
const cartRoutes = express.Router();

cartRoutes.get("/" , protectRoute , getCartProducts);
cartRoutes.post("/" , protectRoute , addToCart);
cartRoutes.delete("/:id" , protectRoute , removeFromCart);
cartRoutes.put("/:id" ,protectRoute, updateQuantity);

export default cartRoutes;