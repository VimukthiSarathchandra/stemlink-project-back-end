import { Request, Response } from "express";
import util from "util";
import Order from "../infrastructure/db/entities/Order";
import stripe from "../infrastructure/stripe";
import Product from "../infrastructure/db/entities/Product";

const FRONTEND_URL = process.env.FRONTEND_URL;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

interface Product {
  _id: string;
  stock: number;
  name: string;
  stripePriceId: string;
}

async function fulfillCheckout(sessionId: string) {
  // Set your secret key. Remember to switch to your live secret key in production.
  // See your keys here: https://dashboard.stripe.com/apikeys
  console.log("Fulfilling Checkout Session " + sessionId);

  // Make this function safe to run multiple times,
  // even concurrently, with the same session ID

  // Make sure fulfillment hasn't already been
  // peformed for this Checkout Session

  // Retrieve the Checkout Session from the API with line_items expanded
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });
  console.log(
    util.inspect(checkoutSession, false, null, true /* enable colors */)
  );

  const order = await Order.findById(
    checkoutSession.metadata?.orderId
  ).populate<{
    items: { productId: Product; quantity: number }[];
  }>("items.productId");
  
  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus !== "PENDING") {
    console.log("Payment is not pending, current status:", order.paymentStatus);
    return;
  }

  if (order.orderStatus !== "PENDING") {
    console.log("Order is not pending, current status:", order.orderStatus);
    return;
  }

  // Check the Checkout Session's payment_status property
  // to determine if fulfillment should be performed
  if (checkoutSession.payment_status === "paid") {
    console.log("Payment is paid, updating order and product stock...");
    
    // Update product stock
    for (const item of order.items) {
      const product = item.productId;
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity },
      });
      console.log(`Updated stock for product ${product.name}: -${item.quantity}`);
    }

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      order._id,
      {
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
      },
      { new: true }
    );
    
    console.log("Order updated successfully:", {
      orderId: updatedOrder?._id,
      paymentStatus: updatedOrder?.paymentStatus,
      orderStatus: updatedOrder?.orderStatus
    });
  } else {
    console.log("Payment status is not paid:", checkoutSession.payment_status);
  }
}

// Manual order status update for testing
export const manuallyUpdateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    console.log("Manually updating order status for:", orderId);
    
    const order = await Order.findById(orderId).populate<{
      items: { productId: Product; quantity: number }[];
    }>("items.productId");
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    console.log("Current order status:", {
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus
    });
    
    // Update product stock
    for (const item of order.items) {
      const product = item.productId;
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity },
      });
      console.log(`Updated stock for product ${product.name}: -${item.quantity}`);
    }
    
    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
      },
      { new: true }
    );
    
    console.log("Order manually updated:", {
      orderId: updatedOrder?._id,
      paymentStatus: updatedOrder?.paymentStatus,
      orderStatus: updatedOrder?.orderStatus
    });
    
    res.json({
      success: true,
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error manually updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const payload = req.body;
  const sig = req.headers["stripe-signature"] as string;

  console.log("Webhook received - Headers:", req.headers);
  console.log("Webhook received - Body length:", payload.length);
  console.log("Webhook received - Signature:", sig);

  let event;

  try {
    if (!endpointSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not configured");
      return res.status(500).send("Webhook secret not configured");
    }

    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    console.log("Webhook event received:", event.type);
    console.log("Webhook event data:", JSON.stringify(event.data, null, 2));
    
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      console.log("Processing checkout session completion...");
      await fulfillCheckout(event.data.object.id);
      console.log("Checkout fulfillment completed successfully");
    }
    
    res.status(200).send();
    return;
  } catch (err: any) {
    console.error("Webhook error:", err);
    console.error("Webhook error details:", {
      message: err.message,
      stack: err.stack
    });
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  const orderId = req.body.orderId;
  console.log("Creating checkout session for order:", orderId);
  
  const order = await Order.findById(orderId).populate<{
    items: { productId: Product; quantity: number }[];
  }>("items.productId");

  if (!order) {
    throw new Error("Order not found");
  }
  
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: order.items.map((item) => ({
      price: item.productId.stripePriceId,
      quantity: item.quantity,
    })),
    mode: "payment",
    return_url: `${FRONTEND_URL}/shop/complete?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      orderId: req.body.orderId,
    },
  });

  console.log("Checkout session created:", session.id);
  res.send({ clientSecret: session.client_secret });
};

export const retrieveSessionStatus = async (req: Request, res: Response) => {
  const sessionId = req.query.session_id as string;
  console.log("Retrieving session status for:", sessionId);
  
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  const order = await Order.findById(checkoutSession.metadata?.orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  console.log("Session status retrieved:", {
    sessionId,
    sessionStatus: checkoutSession.status,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus
  });

  res.status(200).json({
    orderId: order._id,
    status: checkoutSession.status,
    customer_email: checkoutSession.customer_details?.email,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
  });
};
