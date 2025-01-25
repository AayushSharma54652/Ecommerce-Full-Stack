import { Router } from "express";
import {
  createOrderHandler,
  getOrderByIdHandler,
  getAllOrdersHandler,
  updateOrderStatusHandler,
  deleteOrderHandler,
  getOrderStatusHandler,
} from "./order.controller";
import { catchError } from "../common/middleware/cath-error.middleware";
import { authMiddleware } from "../common/middleware/auth.middleware";
import { isAdmin } from "../common/middleware/AdminCheck.middleware";

const router = Router();

// Route to create an order from the cart for an authenticated user
router.post(
  "/create",
  authMiddleware, // Ensure the user is authenticated
  catchError, // Middleware to catch any errors
  createOrderHandler // Handler that processes the order creation
);

// Route to get an order by its ID for an authenticated user
router.get(
  "/:id",
  authMiddleware, // Ensure the user is authenticated
  catchError, // Middleware to catch any errors
  getOrderByIdHandler // Handler that fetches an order by its ID
);

// Route to get all orders for the authenticated user
router.get(
  "/",
  authMiddleware, // Ensure the user is authenticated
  catchError, // Middleware to catch any errors
  getAllOrdersHandler // Handler that fetches all orders
);

// Route to update the status of an order (admin-only)
router.put(
  "/update-status/:id",
  authMiddleware, // Ensure the user is authenticated
  isAdmin, // Ensure the user has admin privileges
  catchError, // Middleware to catch any errors
  updateOrderStatusHandler // Handler that updates the status of the order
);

// Route to delete an order (admin-only)
router.delete(
  "/delete/:id",
  authMiddleware, // Ensure the user is authenticated
  isAdmin, // Ensure the user has admin privileges
  catchError, // Middleware to catch any errors
  deleteOrderHandler // Handler that deletes the order
);

// Route to fetch the status of a specific order for the authenticated user
router.get(
  "/status/:id",
  authMiddleware, // Ensure the user is authenticated
  catchError, // Middleware to catch any errors
  getOrderStatusHandler // Handler that fetches the order status
);

export default router;
