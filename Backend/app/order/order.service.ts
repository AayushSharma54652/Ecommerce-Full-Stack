import CartModel from "../cart/cart.schema";
import OrderModel from "./order.schema";
import { OrderStatus } from "./order.dto";
import { IOrderItem } from "./order.dto";

/**
 * Create Order from Cart
 * @param {string} userId - ID of the user
 * @param {string} shippingAddress - Address where the order needs to be shipped
 * @returns {Promise<any>} - The created order
 */
export const createOrderFromCart = async (userId: string, shippingAddress: string) => {
  const cart = await CartModel.findOne({ userId }).populate("items.productId");

  if (!cart) {
    throw new Error("Cart not found for user");
  }

  const orderItems: IOrderItem[] = cart.items.map(item => ({
    productId: item.productId as any, // Ensure this is the populated product object
    quantity: item.quantity,
    price: item.productPrice,
  }));

  const totalAmount = cart.totalPrice;

  const newOrder = new OrderModel({
    user: userId,
    items: orderItems,
    totalAmount,
    status: OrderStatus.PENDING,
    shippingAddress,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await newOrder.save();

  return newOrder;
};

/**
 * Get Order by ID
 * @param {string} userId - ID of the user
 * @param {string} orderId - ID of the order
 * @returns {Promise<any>} - The order object
 */
export const getOrderById = async (userId: string, orderId: string) => {
  const order = await OrderModel.findOne({ _id: orderId, user: userId })
    .populate("items.productId");

  return order;
};

/**
 * Get All Orders
 * @param {string} userId - ID of the user
 * @returns {Promise<any[]>} - Array of orders for the user
 */
export const getAllOrders = async (userId: string) => {
  const orders = await OrderModel.find({ user: userId })
    .populate("items.productId", "name price");
  return orders;
};

/**
 * Delete Order
 * @param {string} userId - ID of the user
 * @param {string} orderId - ID of the order
 * @returns {Promise<boolean>} - Whether the order was successfully deleted
 */
export const deleteOrder = async (userId: string, orderId: string) => {
  const result = await OrderModel.deleteOne({ _id: orderId, user: userId });
  return result.deletedCount > 0;
};

/**
 * Get Order Status
 * @param {string} userId - ID of the user
 * @param {string} orderId - ID of the order
 * @returns {Promise<string | null>} - The status of the order or null if not found
 */
export const getOrderStatus = async (userId: string, orderId: string) => {
  const order = await OrderModel.findOne({ _id: orderId, user: userId }, "status");
  return order ? order.status : null;
};

/**
 * Update Order Status
 * @param {string} orderId - ID of the order
 * @param {OrderStatus} status - New status to be updated
 * @returns {Promise<any>} - The updated order object
 */
export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const order = await OrderModel.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (!Object.values(OrderStatus).includes(status)) {
    throw new Error("Invalid order status");
  }

  order.status = status;
  order.updatedAt = new Date();

  await order.save();

  return order;
};
