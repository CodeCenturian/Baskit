import Product from "../models/product.model.js";
import User from "../models/user.model.js";


export const getCartProducts = async (req,res) => {  // tricky
    try {
        const products = await Product.find({_id : {$in : req.user.cartItems}});

        //adding quantity to each product
        const cartItems = products.map(product => {
            const item = req.user.cartItems.find(cartItem => cartItem.id === product.id);
            return { ...product.toJSON(), quantity: item ? item.quantity : 0 };
        });
        res.json(cartItems);
    } catch (error) {
        console.log("Error in getCartProducts Controller: ", error);
        res.status(500).json({message : error.message});
    }
}
export const addToCart = async (req,res) => {
    try {
        const {productId} = req.body;
        const user  = req.user;

        const existingItem = user.cartItems.find(item => item.id === productId);
        if(existingItem){
            existingItem.quantity += 1;
        }
        else{
            user.cartItems.push({id : productId, quantity : 1});
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("Error in addToCart Controller: ", error);
        res.status(500).json({message : error.message});
    }

}

export const removeFromCart = async (req,res) => {
    try {
        const {productId} = req.body;
        console.log(req.body)
        const user = req.user;

        if(!productId) user.cartItems = [];
        else user.cartItems = user.cartItems.filter(item => (item.id !== productId));

        await user.save();
        res.json(user.cartItems);

    } catch (error) {
        console.log("Error in removeFromCart Controller: ", error);
        res.status(500).json({message : error.message});
    }
}

export const updateQuantity = async (req , res) => {
    try {
        const {id : productId} = req.params;
        const {quantity} = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => (item.id === productId)); // returns the item
        if(existingItem){
            if(quantity === 0) user.cartItems = user.cartItems.filter(item => (item.id !== productId)); // if quantity is 0 remove the item from the cart

            else existingItem.quantity = quantity; // if quantity is not 0 update the quantity
            await user.save();
            res.json(user.cartItems);
        }else{
            res.status(404).json({message : "Item not found"});
        }
    } catch (error) {
        console.log("Error in updateQuantity Controller: ", error);
        res.status(500).json({message : error.message});
    }


}


