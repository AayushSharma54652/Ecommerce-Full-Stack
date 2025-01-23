import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loginSuccess, loginFailure, logout, registerSuccess, registerFailure } from "../store/reducers/authReducer";

// Define types for products, users, and other responses
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  data: {
    user: User;
    accessToken: string;
  };
  message: string;
  success: boolean;
}

interface RegisterResponse {
  data: {
    user: User;
    accessToken: string;
  };
  message: string;
  success: boolean;
}

interface ProfileResponse {
  data: User;
  message: string;
  success: boolean;
}

interface CreateProductResponse {
  data: Product;
  message: string;
  success: boolean;
}

interface CartResponse {
  data: {
    _id: string;
    userId: string;
    items: {
      productId: string;
      quantity: number;
      productName: string;
      productPrice: number;
      totalItemPrice: number;
    }[];
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
  success: boolean;
}

// Create an API service using Redux Toolkit
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    // Get products
    getProducts: builder.query<{ data: { products: Product[] } }, void>({
      query: () => "/products",
    }),

    // Login user
    loginUser: builder.mutation<LoginResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          if (data && data.data.accessToken) {
            dispatch(
              loginSuccess({
                user: data.data.user,
                accessToken: data.data.accessToken,
              })
            );
          }
        } catch (err) {
          if (err instanceof Error) {
            dispatch(loginFailure(err.message || "Login failed"));
          } else {
            dispatch(loginFailure("Login failed"));
          }
        }
      },
    }),

    // Register user
    registerUser: builder.mutation<RegisterResponse, { name: string; email: string; role: string; password: string }>({
      query: (userDetails) => ({
        url: "/users/register",
        method: "POST",
        body: userDetails,
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data.accessToken) {
            dispatch(
              registerSuccess({
                user: data.data.user,
                accessToken: data.data.accessToken,
              })
            );
          }
        } catch (err) {
          if (err instanceof Error) {
            dispatch(registerFailure(err.message || "Registration failed"));
          } else {
            dispatch(registerFailure("Registration failed"));
          }
        }
      },
    }),

    // Get user profile
    getUserProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: "/users/profile",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          if (!data.success) {
            dispatch(logout());
          }
        } catch (error: any) {
          if (error.status === 401) {
            dispatch(logout());
          }
        }
      },
    }),

    // Add to Cart
    addToCart: builder.mutation<CartResponse, { productId: string; quantity: number }>({
      query: ({ productId, quantity }) => ({
        url: "/cart/add-to-cart",
        method: "POST",
        body: {
          productId,
          quantity,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch, getState }) => {
        try {
          const { data } = await queryFulfilled;
          // Refetch the cart after adding an item
          const cartQuery = getState().api.queries['getCart(undefined)'];
          if (cartQuery) {
            cartQuery.refetch();
          }
        } catch (err) {
          console.error("Failed to add item to cart:", err);
        }
      },
    }),

    // Create Product
    createProduct: builder.mutation<CreateProductResponse, { name: string; description: string; price: number; category: string; stockQuantity: number; images: string[]; isActive: boolean }>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          // Optionally dispatch an action on success (e.g., show a success message)
          console.log("Product created:", data);
        } catch (err) {
          console.error("Failed to create product:", err);
        }
      },
    }),

    // Get user's cart
    getCart: builder.query<CartResponse, void>({
      query: () => ({
        url: "/cart",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Cart fetched:", data);
        } catch (err) {
          console.error("Failed to fetch cart:", err);
        }
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserProfileQuery,
  useCreateProductMutation,
  useAddToCartMutation,
  useGetCartQuery, // Export the useGetCartQuery hook
} = api;
