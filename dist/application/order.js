"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = exports.getUserOrders = exports.getOrder = exports.createOrder = void 0;
const Address_1 = __importDefault(require("../infrastructure/db/entities/Address"));
const Order_1 = __importDefault(require("../infrastructure/db/entities/Order"));
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const unauthorized_error_1 = __importDefault(require("../domain/errors/unauthorized-error"));
const express_1 = require("@clerk/express");
const createOrder = async (req, res, next) => {
    try {
        const data = req.body;
        const { userId } = (0, express_1.getAuth)(req);
        console.log('Creating order with data:', JSON.stringify(data, null, 2));
        console.log('User ID:', userId);
        console.log('Request headers:', req.headers);
        // Validate user authentication
        if (!userId) {
            console.error('No user ID found in request');
            console.error('Request auth object:', req.auth);
            console.error('Request headers:', req.headers);
            throw new unauthorized_error_1.default('User authentication required. Please sign in to place an order.');
        }
        // Validate required fields
        if (!data.shippingAddress) {
            throw new Error('Shipping address is required');
        }
        if (!data.orderItems || !Array.isArray(data.orderItems) || data.orderItems.length === 0) {
            throw new Error('Order items are required and must be an array');
        }
        // Create address
        console.log('Creating address with data:', JSON.stringify(data.shippingAddress, null, 2));
        const address = await Address_1.default.create(data.shippingAddress);
        console.log('Address created:', address._id);
        // Create order
        const orderData = {
            addressId: address._id,
            items: data.orderItems,
            userId: userId,
        };
        console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
        const order = await Order_1.default.create(orderData);
        console.log('Order created successfully:', order._id);
        res.status(201).json(order);
    }
    catch (error) {
        console.error('Error in createOrder:', error);
        if (error instanceof Error) {
            console.error('Error stack:', error.stack);
        }
        next(error);
    }
};
exports.createOrder = createOrder;
const getOrder = async (req, res, next) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        const orderId = req.params.id;
        const order = await Order_1.default.findById(orderId)
            .populate('addressId')
            .populate({
            path: 'items.productId',
            populate: [
                { path: 'categoryId', select: 'name' },
                { path: 'colorIds', select: 'name hexCode' }
            ]
        });
        if (!order) {
            throw new not_found_error_1.default("Order not found");
        }
        if (order.userId !== userId) {
            throw new unauthorized_error_1.default("Unauthorized");
        }
        res.status(200).json(order);
    }
    catch (error) {
        next(error);
    }
};
exports.getOrder = getOrder;
const getUserOrders = async (req, res, next) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        console.log('Getting orders for user:', userId);
        const orders = await Order_1.default.find({ userId })
            .populate('addressId')
            .populate({
            path: 'items.productId',
            populate: [
                { path: 'categoryId', select: 'name' },
                { path: 'colorIds', select: 'name hexCode' }
            ]
        })
            .sort({ createdAt: -1 });
        console.log('Found orders for user:', orders.length);
        if (orders.length > 0) {
            console.log('Sample user order:', JSON.stringify(orders[0], null, 2));
        }
        res.status(200).json(orders);
    }
    catch (error) {
        console.error('Error in getUserOrders:', error);
        next(error);
    }
};
exports.getUserOrders = getUserOrders;
const getAllOrders = async (req, res, next) => {
    try {
        const { userId } = (0, express_1.getAuth)(req);
        // For now, we'll allow all authenticated users to access admin orders
        // In production, you should implement proper admin role checking
        // This could be done by checking user metadata from Clerk or a separate admin table
        // TODO: Implement proper admin role checking
        // Example implementation:
        // 1. Create an admin middleware that checks user metadata
        // 2. Use Clerk's user metadata to store admin roles
        // 3. Or create a separate admin table in the database
        // const isAdmin = await checkUserIsAdmin(userId);
        // if (!isAdmin) {
        //   throw new ForbiddenError("Admin access required");
        // }
        console.log('Getting all orders...');
        const orders = await Order_1.default.find({})
            .populate('addressId')
            .populate({
            path: 'items.productId',
            populate: [
                { path: 'categoryId', select: 'name' },
                { path: 'colorIds', select: 'name hexCode' }
            ]
        })
            .sort({ createdAt: -1 });
        console.log('Found orders:', orders.length);
        console.log('Sample order:', JSON.stringify(orders[0], null, 2));
        res.status(200).json(orders);
    }
    catch (error) {
        console.error('Error in getAllOrders:', error);
        next(error);
    }
};
exports.getAllOrders = getAllOrders;
//# sourceMappingURL=order.js.map