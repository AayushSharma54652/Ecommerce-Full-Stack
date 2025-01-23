import { Request, Response } from "express";
import { verifyAccessToken } from "../common/middleware/auth.middleware"; // Assuming you have this middleware for verifying access token
import CartModel from "./cart.schema"; // Cart model
import ProductModel from "../product/product.schema"; // Product model
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";

// Helper function to get user from token (from headers)
const getUserFromToken = (req: Request) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from Authorization header
  if (!token) return null;

  try {
    const decoded: any = verifyAccessToken(token); // Decoding token (assuming verifyAccessToken returns user info)
    return decoded; // Returning the decoded user object (including userId)
  } catch (error) {
    return null; // Return null if token is invalid or expired
  }
};

// Controller for adding items to the cart
export const addToCartHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = getUserFromToken(req); // Get user from token

  if (!user) {
    res.status(401).send(createResponse(null, "User not authenticated"));
    return;
  }

  const { productId, quantity } = req.body; // Get productId and quantity from request body

  if (!productId || !quantity || quantity <= 0) {
    res.status(400).send(createResponse(null, "Invalid productId or quantity"));
    return;
  }

  try {
    const product = await ProductModel.findById(productId); // Check if the product exists
    if (!product) {
      res.status(404).send(createResponse(null, "Product not found"));
      return;
    }

    let cart = await CartModel.findOne({ userId: user._id }); // Find user's cart by userId

    if (!cart) {
      cart = new CartModel({ userId: user._id, items: [] }); // Create new cart if it doesn't exist
    }

    // Check if the product is already in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if product already exists in the cart
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].totalItemPrice =
        cart.items[existingItemIndex].quantity * cart.items[existingItemIndex].productPrice;
    } else {
      // Add new product to the cart
      const totalItemPrice = product.price * quantity;
      cart.items.push({
        productId,
        quantity,
        productName: product.name,
        productPrice: product.price,
        totalItemPrice,
      });
    }

    // Recalculate total price by summing up the totalItemPrice of each item in the cart
    cart.totalPrice = cart.items.reduce((total, item) => total + item.totalItemPrice, 0);

    await cart.save(); // Save the cart

    res.send(createResponse(cart, "Item added to cart successfully"));
  } catch (error) {
    res.status(500).send(createResponse(null, "Error adding item to cart"));
  }
});

// Controller for getting the user's cart
export const getUserCartHandler = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = getUserFromToken(req); // Get user from token

  if (!user) {
    res.status(401).send(createResponse(null, "User not authenticated"));
    return;
  }

  try {
    const cart = await CartModel.findOne({ userId: user._id }).populate("items.productId"); // Get user's cart and populate product details

    if (!cart) {
      res.status(404).send(createResponse(null, "Cart not found"));
      return;
    }

    res.send(createResponse(cart, "User's cart fetched successfully"));
  } catch (error) {
    res.status(500).send(createResponse(null, "Error fetching cart"));
  }
});
