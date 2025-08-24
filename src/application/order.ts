import { NextFunction, Request, Response } from "express";
import Address from "../infrastructure/db/entities/Address";
import Order from "../infrastructure/db/entities/Order";
import Product from "../infrastructure/db/entities/Product";
import NotFoundError from "../domain/errors/not-found-error";
import UnauthorizedError from "../domain/errors/unauthorized-error";
import ForbiddenError from "../domain/errors/forbidden-error";
import { getAuth } from "@clerk/express";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const { userId } = getAuth(req);

    console.log('Creating order with data:', JSON.stringify(data, null, 2));
    console.log('User ID:', userId);
    console.log('Request headers:', req.headers);

    // Validate user authentication
    if (!userId) {
      console.error('No user ID found in request');
      console.error('Request auth object:', req.auth);
      console.error('Request headers:', req.headers);
      throw new UnauthorizedError('User authentication required. Please sign in to place an order.');
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
    const address = await Address.create(data.shippingAddress);
    console.log('Address created:', address._id);

    // Create order
    const orderData = {
      addressId: address._id,
      items: data.orderItems,
      userId: userId,
    };
    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
    
    const order = await Order.create(orderData);
    console.log('Order created successfully:', order._id);

    res.status(201).json(order);
  } catch (error) {
    console.error('Error in createOrder:', error);
    console.error('Error stack:', error.stack);
    next(error);
  }
};

const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate('addressId')
      .populate({
        path: 'items.productId',
        populate: [
          { path: 'categoryId', select: 'name' },
          { path: 'colorIds', select: 'name hexCode' }
        ]
      });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.userId !== userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    
    console.log('Getting orders for user:', userId);
    
    const orders = await Order.find({ userId })
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
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    next(error);
  }
};

const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    
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
    
    const orders = await Order.find({})
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
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    next(error);
  }
};

export { createOrder, getOrder, getUserOrders, getAllOrders };
