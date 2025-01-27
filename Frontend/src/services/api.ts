import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  loginSuccess,
  loginFailure,
  logout,
  registerSuccess,
  registerFailure,
} from "../store/reducers/authReducer";


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
    refreshToken: string;
  };
  message: string;
  success: boolean;
}

interface RegisterResponse {
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
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

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args:any, api:any, extraOptions:any) => {
  // Execute the initial query
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized errors
  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      // Attempt to refresh the token
      const refreshResult = await baseQuery(
        {
          url: "/users/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { accessToken, refreshToken: newRefreshToken } = refreshResult.data;

        // Store updated tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Update Redux auth state
        api.dispatch(
          loginSuccess({
            user: api.getState().auth.user, // Use existing user state
            accessToken,
            refreshToken: newRefreshToken,
          })
        );

        // Retry the original request with the new token
        result = await baseQuery(
          {
            ...args,
            headers: {
              ...args.headers,
              Authorization: `Bearer ${accessToken}`,
            },
          },
          api,
          extraOptions
        );
      } else {
        // Refresh failed, log out the user
        api.dispatch(logout());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } else {
      // No refresh token available, log out the user
      api.dispatch(logout());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  return result;
};


export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getProducts: builder.query<{ data: { products: Product[] } }, void>({
      query: () => "/products",
    }),

    loginUser: builder.mutation<LoginResponse, { email: string; password: string }>(
      {
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
                  refreshToken: data.data.refreshToken,
                })
              );
              localStorage.setItem("accessToken", data.data.accessToken);
              localStorage.setItem("refreshToken", data.data.refreshToken);
            }
          } catch (err) {
            if (err instanceof Error) {
              dispatch(loginFailure(err.message || "Login failed"));
            } else {
              dispatch(loginFailure("Login failed"));
            }
          }
        },
      }
    ),

    registerUser: builder.mutation<
  RegisterResponse,
  { name: string; email: string; role: string; password: string }
>({
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
            refreshToken: data.data.refreshToken
          })
        );
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken); // Store refreshToken
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


    getUserProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: "/users/profile",
      }),
    }),

    addToCart: builder.mutation<CartResponse, { productId: string; quantity: number }>(
      {
        query: ({ productId, quantity }) => ({
          url: "/cart/add-to-cart",
          method: "POST",
          body: { productId, quantity },
        }),
      }
    ),

    createProduct: builder.mutation<
      CreateProductResponse,
      {
        name: string;
        description: string;
        price: number;
        category: string;
        stockQuantity: number;
        images: string[];
        isActive: boolean;
      }
    >({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
    }),

    getCart: builder.query<CartResponse, void>({
      query: () => ({
        url: "/cart",
      }),
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
  useGetCartQuery,
} = api;
