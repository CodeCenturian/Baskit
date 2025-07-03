import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async(req,res,next) =>{
   try {
     const accessToken  = req.cookies.accessToken;

     if(!accessToken) return res.status(401).json({message : "Unauthorized - No Access Token"});

     try {
         const decodedPayload  =jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET);
         const user = await User.findById(decodedPayload.userID);
         console.log(user);

         if(!user) return res.status(401).json({message : "Unauthorized - User not found"});

         req.user = user;
         next();

     } catch (error) {
         throw error;
     }


   } catch (error) {
     console.log("Error in ProtectRoute Middleware: ", error);
     res.status(500).json({message : error.message});

   }
}

export const adminRoute = (req,res,next) =>{
    if(req.user && req.user.role === "admin") return next();
    return res.status(401).json({message : "Unauthorized - User is not an Admin"});
}