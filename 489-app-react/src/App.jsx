import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import BuyerDashboard from "./Components/BuyerDashboard";
import SellerDashboard from "./Components/SellerDashboard";
import GameDetails from "./Components/GameDetails";
import BuyerGameDetails from "./Components/BuyerGameDetails";
import CartDetails from "./Components/CartDetails";
import BuyerAccountHistory from "./Components/BuyerAccountHistory";
import SellerAccountHistory from "./Components/SellerAccountHistory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/buyer" element={<BuyerDashboard />} />
      <Route path="/seller" element={<SellerDashboard />} />
      <Route path="/seller/game/:id" element={<GameDetails />} />
      <Route path="/buyer/game/:id" element={<BuyerGameDetails />} />
      <Route path="/buyer/cart" element={<CartDetails />} /> 
      <Route path="/buyer/history" element={<BuyerAccountHistory />} />
      <Route path="/seller/history" element={<SellerAccountHistory />} />
      
    </Routes>
  );
}

export default App;
