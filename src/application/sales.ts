import { NextFunction, Request, Response } from "express";
import Order from "../infrastructure/db/entities/Order";
import { getAuth } from "@clerk/express";
import UnauthorizedError from "../domain/errors/unauthorized-error";

interface DailySales {
  date: string;
  total: number;
  orders: number;
}

const getSalesData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    const { period = '7' } = req.query; // Default to 7 days

    // Validate user authentication
    if (!userId) {
      throw new UnauthorizedError('User authentication required');
    }

    // TODO: Add proper admin role checking
    // For now, allow all authenticated users to access sales data

    const days = parseInt(period as string);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    console.log(`Getting sales data for ${days} days from ${startDate.toISOString()} to ${endDate.toISOString()}`);

    // Aggregate sales data by day
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: 'PAID' // Only count paid orders
        }
      },
      {
        $unwind: "$items"
      },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      {
        $unwind: "$product"
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          total: { 
            $sum: { 
              $multiply: [
                { $toDouble: "$items.quantity" }, 
                { $toDouble: "$product.price" }
              ] 
            } 
          },
          orders: { $addToSet: "$_id" }
        }
      },
      {
        $project: {
          _id: 1,
          total: 1,
          orders: { $size: "$orders" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Fill in missing days with zero sales
    const dailySales: DailySales[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      const existingData = salesData.find(item => item._id === dateString);
      
      dailySales.push({
        date: dateString,
        total: existingData ? existingData.total : 0,
        orders: existingData ? existingData.orders : 0
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate summary statistics
    const totalSales = dailySales.reduce((sum, day) => sum + day.total, 0);
    const totalOrders = dailySales.reduce((sum, day) => sum + day.orders, 0);
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Get top selling days
    const topDays = [...dailySales]
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    const response = {
      period: days,
      dailySales,
      summary: {
        totalSales: Math.round(totalSales * 100) / 100,
        totalOrders,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        topDays
      }
    };

    console.log('Sales data response:', response);

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getSalesData:', error);
    next(error);
  }
};

export { getSalesData };
