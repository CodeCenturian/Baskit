import Product from "../models/product.model.js";
import User from "../models/user.model.js";


export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({ _id: { $in: req.user.cartItems.map(item => item._id) } });

        const cartItems = products.map(product => {
            const item = req.user.cartItems.find(cartItem =>
                cartItem._id.toString() === product._id.toString()
            );
            return { ...product.toJSON(), quantity: item ? item.quantity : 0 };
        });
        res.json(cartItems);
    } catch (error) {
        // console.log("Error in getCartProducts Controller: ", error);
        res.status(500).json({ message: error.message });
    }
}
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item =>
            item._id.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push({ _id: productId, quantity: 1 });
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        // console.log("Error in addToCart Controller: ", error);
        res.status(500).json({ message: error.message });
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = req.user;

        if (!productId) {
            user.cartItems = [];
        } else {
            user.cartItems = user.cartItems.filter(item =>
                item._id.toString() !== productId
            );
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        // console.log("Error in removeFromCart Controller: ", error);
        res.status(500).json({ message: error.message });
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item =>
            item._id.toString() === productId
        );

        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter(item =>
                    item._id.toString() !== productId
                );
            } else {
                existingItem.quantity = quantity;
            }
            await user.save();
            return res.json(user.cartItems);
        }

        res.status(404).json({ message: "Product not found" });
    } catch (error) {
        // console.log("Error in updateQuantity controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

