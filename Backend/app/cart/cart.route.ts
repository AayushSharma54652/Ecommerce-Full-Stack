import { Router } from "express";
import { catchError } from "../common/middleware/cath-error.middleware"; // Assuming this is your error handling middleware
import { 
  addToCartHandler,
  getUserCartHandler,
} from "./cart.controller"; // New controller functions
import { authMiddleware } from "../common/middleware/auth.middleware"; // Authentication middleware

const router = Router();

// Route to add an item to the cart
router.post(
  "/add-to-cart",
  authMiddleware, // Ensure the user is authenticated via access token
  catchError, // Catch errors from async functions
  addToCartHandler // Controller handler to add item to cart
);

// Route to get the user's cart
router.get(
  "/",
  authMiddleware, // Ensure the user is authenticated via access token
  catchError, // Catch errors from async functions
  getUserCartHandler // Controller handler to get the user's cart
);

export default router;
