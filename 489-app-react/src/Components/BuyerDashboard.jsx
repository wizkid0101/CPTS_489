// src/Components/BuyerDashboard.jsx
import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./BuyerDashboard.css";

const BuyerDashboard = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchItems = async () => {
      const snapshot = await getDocs(collection(db, "marketplace"));
      const fetchedItems = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(item => !item.reserved && item.title && item.condition && item.price && item.image);
      setItems(fetchedItems);
    };
    fetchItems();
  }, [cart]); // Refresh marketplace when cart changes

  const addToCart = async (item) => {
    const itemRef = doc(db, "marketplace", item.id);
    await updateDoc(itemRef, { reserved: true });

    const updatedCart = [...cart, item];
    setCart(updatedCart);
    alert(`${item.title} added to cart!`);
  };

  const viewDetails = (item) => {
    navigate(`/buyer/game/${item.id}`, { state: { item } });
  };

  return (
    <div className="buyer-dashboard">
      <nav className="top-nav">
        <h1 className="logo">🎮  Bazzar Gamez</h1>
        <div className="nav-links">
          <a href="#">Home</a>
          <a onClick={() => navigate("/buyer/cart")}>My Cart</a>
          <a onClick={() => navigate("/buyer/history")}>Account History</a>
        </div>
      </nav>

      <div className="welcome-banner">
        <div className="banner-content">
          <h2>Welcome Gamer!</h2>
          <p>Your digital arena for epic finds.</p>
        </div>
      </div>

      <div className="search-wrapper">
        <input className="search-input" type="text" placeholder="Search games or platforms..." />
      </div>

      <h2 className="section-title">Popular Games</h2>

      <div className="card-grid">
        {items.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "2rem", color: "#777" }}>
            No games listed yet. Please check back soon!
          </p>
        ) : (
          items.map((item) => (
            <div
              className="game-card"
              key={item.id}
              onClick={() => viewDetails(item)}
              style={{ cursor: "pointer" }}
            >
              <img src={item.image} alt={item.title} className="game-image" />
              <h3>{item.title}</h3>
              <p><strong>Condition:</strong> {item.condition}</p>
              <p><strong>Price:</strong> ${item.price}</p>
              <button className="add-btn" onClick={(e) => {
                e.stopPropagation();
                addToCart(item);
              }}>
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;
