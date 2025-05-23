import Product from "../models/Product.js";
import Order from "../models/Order.js"; 

// Place order COD: /api/order/cod
export const placeOrderCod = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        if (!address || items.length === 0) {
            return res.json({
                success: false,
                message: "Invalid data",
            });
        }

        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            if (!product) throw new Error("Product not found");
            return (await acc) + product.offerPrice * item.quantity;
        }, Promise.resolve(0));

        amount += Math.floor(amount * 0.02); // Adding 2% charge

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        return res.json({
            success: true,
            message: "Order placed successfully",
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// Get orders by user ID: /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            message: orders,
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// Get all orders (for seller/admin): /api/orders/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            orders,
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
};






//=============================================================

// import Product from "../models/Product.js";
// import Order from "../models/Order.js"; // Assuming this is the correct import for the Order model

// // Place order (COD): /api/order/cod
// export const placeOrderCod = async (req, res) => {
//     try {
//         const { userId, items, address } = req.body;

//         if (!address || !items || items.length === 0) {
//             return res.json({
//                 success: false,
//                 message: "Invalid data",
//             });
//         }

//         let amount = await items.reduce(async (accPromise, item) => {
//             const acc = await accPromise; // Resolve the accumulator promise
//             const product = await Product.findById(item.product);
//             if (!product) {
//                 throw new Error(`Product with ID ${item.product} not found`);
//             }
//             return acc + product.offerPrice * item.quantity;
//         }, Promise.resolve(0));

//         amount += Math.floor(amount * 0.02); // Adding 2% additional charge

//         await Order.create({
//             userId,
//             items,
//             amount,
//             address,
//             paymentType: "COD",
//         });

//         return res.json({
//             success: true,
//             message: "Order placed successfully",
//         });
//     } catch (error) {
//         return res.json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// // Get orders by user ID: /api/order/user
// export const getUserOrders = async (req, res) => {
//     try {
//         const { userId } = req.body;

//         const orders = await Order.find({
//             userId,
//             $or: [{ paymentType: "COD" }, { isPaid: true }],
//         })
//             .populate("items.product address")
//             .sort({ createdAt: -1 });

//         return res.json({
//             success: true,
//             orders,
//         });
//     } catch (error) {
//         return res.json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// // Get all orders (for seller/admin): /api/orders/seller
// export const getAllOrders = async (req, res) => {
//     try {
//         const orders = await Order.find({
//             $or: [{ paymentType: "COD" }, { isPaid: true }],
//         })
//             .populate("items.product address")
//             .sort({ createdAt: -1 });

//         return res.json({
//             success: true,
//             orders,
//         });
//     } catch (error) {
//         return res.json({
//             success: false,
//             message: error.message,
//         });
//     }
// };
