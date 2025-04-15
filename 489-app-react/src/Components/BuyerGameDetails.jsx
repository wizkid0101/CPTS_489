// src/Components/BuyerGameDetails.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import "./BuyerGameDetails.css";

const BuyerGameDetails = () => {
  const { state } = useLocation();
  const item = state?.item;

  if (!item) return <p>Game not found.</p>;

  return (
    <div className="game-details-container">
      <div className="game-details-card">
        <img src={item.image} alt={item.title} className="game-details-image" />
        <h2>{item.title}</h2>
        <p><strong>Condition:</strong> {item.condition}</p>
        <p><strong>Price:</strong> ${item.price}</p>
        <p><strong>Seller:</strong> {item.sellerName}</p>
        <p><strong>Description:</strong> {item.description}</p>

      </div>
    </div>
  );
};

export default BuyerGameDetails;
