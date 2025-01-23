// App.tsx

import { Route, Routes } from "react-router-dom";
import Basic from "./layouts/Basic";
import Home from "./pages/homepage";
import SignIn from "./pages/signinpage";
import Profile from "./pages/profilepage"; 
import SignUp from "./pages/signuppage";
import AddProduct from "./pages/addproduct";
import CartPage from "./pages/cartpage";

function App() {
  return (
    <Routes>
      <Route element={<Basic />}>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>
    </Routes>
  );
}

export default App;
