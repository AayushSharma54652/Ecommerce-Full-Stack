import mongoose, { Document, Schema } from "mongoose";
import { ICartItem, ICart } from "./cart.dto";

const CartItemSchema: Schema = new Schema<ICartItem>(
  {
    productId: {
      type: Schema.Types.String,
      ref: "Product",
      required: true,
      validate: {
        validator: function (v: string) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: props => `${props.value} is not a valid ObjectId!`
      }
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    totalItemPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false } // No need to generate a separate _id for each cart item
);

const CartSchema: Schema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.String,
      ref: "User",
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: props => `${props.value} is not a valid ObjectId!`
      }
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Method to calculate total price of items in the cart
CartSchema.methods.calculateTotalPrice = function () {
  const totalPrice = this.items.reduce((total: number, item: ICartItem) => total + item.totalItemPrice, 0);
  this.totalPrice = totalPrice;
  return totalPrice;
};

// Create the model
const CartModel = mongoose.model<ICart & Document>("Cart", CartSchema);

export default CartModel;
