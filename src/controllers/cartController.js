const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel")

// Create Cart Item
const createCart = async (req, res) => {
    const user_id = req.user.user_id ;
    
    try {
        const {
            product_id,
            weight_id,
            weight,
            quantity,
            price
        } = req.body;

        if(!user_id){
            return res.status(401).json({
                success:false,
                message: "Please login To add to cart "
            })
        }

        // Validation
        if (
            !product_id ||
            !weight_id ||
            !weight ||
            !quantity 
        ) {
            return res.status(400).json({
                success: false,
                message: "product_id, weight_id, weight, quantity  are required"
            });
        }

        const IsproductExits = await productModel.getProductById(product_id)
        if(!IsproductExits){
            return res.status(400).json({
                success: false ,
                message: "Invalid Product !!! Please select a valid product "
            })
        }

        // Check if same product + weight already exists
        const existingCart = await cartModel.getCartByUserId(user_id);

        const existingItem = existingCart.find(
            item =>
                item.product_id == product_id &&
                item.weight_id == weight_id
        );


        if (existingItem) {

            const updatedQuantity =
                Number(existingItem.quantity) + Number(quantity);

            await cartModel.updateCart(existingItem.id, {
                product_id,
                weight_id,
                weight,
                quantity: updatedQuantity,
                price: price ?? existingItem.price
            });

            return res.status(200).json({
                success: true,
                message: "Product quantity updated in cart"
            });
        }

        
        
        const result = await cartModel.createCart({
            user_id,
            product_id,
            weight_id,
            weight,
            quantity,
            price
        });


        return res.status(201).json({
            success: true,
            message: "Product added to cart successfully",
            data: {
                id: result.insertId
            }
        });

    } catch (error) {

        console.error("Create Cart Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add product to cart"
        });
    }
};


// Get All Carts
const getAllCarts = async (req, res) => {
    try {

        const carts = await cartModel.getAllCarts();

        return res.status(200).json({
            success: true,
            count: carts.length,
            data: carts
        });

    } catch (error) {

        console.error("Get Carts Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch carts"
        });
    }
};


// Get Cart By ID
const getCartById = async (req, res) => {
    try {

        const { id } = req.params;

        const cart = await cartModel.getCartById(id);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }


        return res.status(200).json({
            success: true,
            data: cart
        });

    } catch (error) {

        console.error("Get Cart Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart item"
        });
    }
};


// Get Cart By User
const getCartByUserId = async (req, res) => {
    try {

        const { user_id } = req.params;

        const carts = await cartModel.getCartByUserId(user_id);

        return res.status(200).json({
            success: true,
            count: carts.length,
            data: carts
        });

    } catch (error) {

        console.error("Get User Cart Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user cart"
        });
    }
};


// Update Cart
const updateCart = async (req, res) => {
    try {

        const { id } = req.params;

        const existingCart = await cartModel.getCartById(id);

        if (!existingCart) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }


        const data = req.body;

        const updatedData = {
            product_id: data.product_id ?? existingCart.product_id,
            weight_id: data.weight_id ?? existingCart.weight_id,
            weight: data.weight ?? existingCart.weight,
            quantity: data.quantity ?? existingCart.quantity,
            price: data.price ?? existingCart.price
        };


        await cartModel.updateCart(id, updatedData);


        return res.status(200).json({
            success: true,
            message: "Cart updated successfully"
        });

    } catch (error) {

        console.error("Update Cart Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update cart"
        });
    }
};


// Delete Cart Item
const deleteCart = async (req, res) => {
    try {

        const { id } = req.params;

        const existingCart = await cartModel.getCartById(id);

        if (!existingCart) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }


        await cartModel.deleteCart(id);


        return res.status(200).json({
            success: true,
            message: "Cart item removed successfully"
        });

    } catch (error) {

        console.error("Delete Cart Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove cart item"
        });
    }
};


// Clear Cart
const clearCart = async (req, res) => {
    try {

        const { user_id } = req.params;

        await cartModel.clearCart(user_id);

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully"
        });

    } catch (error) {

        console.error("Clear Cart Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to clear cart"
        });
    }
};


module.exports = {
    createCart,
    getAllCarts,
    getCartById,
    getCartByUserId,
    updateCart,
    deleteCart,
    clearCart
};