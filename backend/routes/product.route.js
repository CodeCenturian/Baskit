import express from 'express';
import { getAllProducts , getFeaturedProducts , createProduct ,deleteProduct, getRecommendedProducts, getProductsByCategory ,toggleFeaturedProduct } from '../controllers/product.controller.js';
import { protectRoute , adminRoute} from '../middleware/auth.middleware.js';

const productRoutes = express.Router();

productRoutes.get("/" , protectRoute , adminRoute , getAllProducts );
productRoutes.get("/featured" , getFeaturedProducts)
productRoutes.get("/recommendations" , getRecommendedProducts)
productRoutes.get("/category/:category" , getProductsByCategory)
productRoutes.post("/",protectRoute , adminRoute , createProduct);
productRoutes.delete("/:id",protectRoute , adminRoute , deleteProduct);
productRoutes.patch("/:id",protectRoute , adminRoute , toggleFeaturedProduct);

export default productRoutes;