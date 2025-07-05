import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import {redis} from "../lib/redis.js";

export const getAllProducts = async(req,res) =>{
    try {
        const products = await Product.find({}).lean();
        res.status(200).json(products);
    } catch (error) {
        console.log("Error in getAllProducts Controller: ", error);
    }
}

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products");  // redis return in string like this '[{"id":1,"name":"Product 1"},{"id":2,"name":"Product 2"}]'
        if(featuredProducts) return res.json(JSON.parse(featuredProducts));

        //.lean() is used to convert the mongoose object to a plain javascript object
        featuredProducts = await Product.find({isFeatured : true}).lean(); // returns array of objects from mongodb

        await redis.set("featured_products" , JSON.stringify(featuredProducts));

        res.json(featuredProducts);

    } catch (error) {
        console.log("Error in getFeaturedProducts Controller: ", error);
        res.status(500).json({message : error.message});
    }
}

export const createProduct = async (req,res) => {
    try {
        const {name , description , price,image ,category} = req.body;

        let cloudinaryResponse = null;

        if(image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder : "products"});
        }
        const product = await Product.create({
            name,
            description,
            image : cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            price,
            category,
        })
        res.status(201).json(product);
    } catch (error) {
        console.log("Error in createProduct controller" , error.message);
        res.status(500).json({message : "Server Error : ", error : error.message});
    }
}

export const deleteProduct = async (req , res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json({message : "Product not found"});

        if(product.image) {
            try {
                const publicId = product.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy('/products/${publicId}');
            } catch (error) {
                console.log("Error in deleteProduct controller" , error.message);
            }
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({message : "Product deleted successfully"});
    } catch (error) {
        console.log("Error in deleteProduct controller" , error.message);
        res.status(500).json({message : "Server Error : ", error : error.message});
    }
}

export const getRecommendedProducts = async (req , res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample : {size :3}
            },
            {
                $project : {
                    _id :1,
                    name : 1,
                    image : 1,
                    price : 1,
                    description : 1
                }
            }
        ])
        res.status(200).json(products);
    } catch (error) {
        console.log("Error in getRecommendedProducts controller" , error.message);
        res.status(500).json({message : "Server Error : ", error : error.message});
    }
}

export const getProductsByCategory = async (req,res) => {
    const category = req.params.category;
    try {
        // the query would be something like db.products.find({ category: "some-category-value" })
        const products = await Product.find({category});
        res.status(200).json(products);
    } catch (error) {
        console.log("Error in getProductsByCategory controller" , error.message);
        res.status(500).json({message : "Server Error : ", error : error.message});
    }
}

export const toggleFeaturedProduct = async (req,res) =>{
    try {
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json({message : "Product not found"});

        product.isFeatured = !product.isFeatured;
        await product.save();
        await updateFeaturedProductsCache();
        res.status(200).json(product);
    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller" , error.message);
        res.status(500).json({message : "Server Error : ", error : error.message});
    }
}

const updateFeaturedProductsCache = async (req,res) => {
   try {
     const featuredProducts = await Product.find({isFeatured : true}).lean();
     await redis.set("featured_products" , JSON.stringify(featuredProducts));
   } catch (error) {
        console.error("Error in updateFeaturedProductsCache", error);
        res.status(500).json({message : "Server Error : ", error : error.message});
   }
}




// https://res.cloudinary.com/demo/image.jpg
//   |           |           |           |
//   |  split("/")  |  pop()  |  split(".")  |  [0]
//   |           |           |           |
//   ["https:", "res.cloudinary.com", "demo", "image.jpg"]
//   |           |           |           |
//   ["image.jpg"]
//   |           |           |
//   ["image", "jpg"]
//   |           |
//   "image"