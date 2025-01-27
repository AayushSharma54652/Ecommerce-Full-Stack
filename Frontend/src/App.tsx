import React, { Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import Basic from "./layouts/Basic";
import { CircularProgress } from "@mui/material";

// Lazy load components
const Home = React.lazy(() => import("./pages/homepage"));
const SignIn = React.lazy(() => import("./pages/signinpage"));
const SignUp = React.lazy(() => import("./pages/signuppage"));
const Profile = React.lazy(() => import("./pages/profilepage"));
const AddProduct = React.lazy(() => import("./pages/addproduct"));
const CartPage = React.lazy(() => import("./pages/cartpage"));
const ProtectedRoute = React.lazy(() => import("./utils/protectedroute"));

function App() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <Routes>
        <Route element={<Basic />}>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <Suspense fallback={<CircularProgress />}>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/add-product"
            element={
              <Suspense fallback={<CircularProgress />}>
                <ProtectedRoute>
                  <AddProduct />
                </ProtectedRoute>
              </Suspense>
            }
          />
          <Route
            path="/cart"
            element={
              <Suspense fallback={<CircularProgress />}>
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
