import { BaseSchema } from "../common/dto/base.dto";
import { IProduct } from "../product/product.dto";

export interface ICartItem {
  productId: string; // Reference to the product
  quantity: number; // Quantity of the product in the cart
  productName: string; // Name of the product
  productPrice: number; // Price of the product
  totalItemPrice: number; // Total price for this item (quantity * price)
}

export interface ICart extends BaseSchema {
  userId: string; // Reference to the user
  items: ICartItem[]; // List of products in the cart
  totalPrice: number; // Total price of all items in the cart
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCartDto {
  userId: string; // The user who owns the cart
  items: ICartItem[]; // List of items to add to the cart
  totalPrice: number; // The total price of all items in the cart
}

export interface UpdateCartDto {
  items?: ICartItem[]; // List of updated items in the cart
  totalPrice?: number; // The updated total price
}

export interface AddItemToCartDto {
  productId: string; // The product to add to the cart
  quantity: number; // The quantity of the product
}
