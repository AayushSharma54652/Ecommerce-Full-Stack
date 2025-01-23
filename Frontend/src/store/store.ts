// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./reducers/authReducer";  // Import authReducer
import { api } from "../services/api";
import productReducer from "./reducers/productReducer";  // If you have any product-related reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,          // Add the authReducer to the store
    products: productReducer,   // Keep any other reducers like productReducer if you have
    [api.reducerPath]: api.reducer,  // Keep API slice reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),  // Ensure api middleware is included
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
