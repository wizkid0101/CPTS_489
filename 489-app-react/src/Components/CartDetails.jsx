// src/Components/CartDetails.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import "./CartDetails.css";

const CartDetails = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const removeFromCart = async (itemToRemove) => {
    const itemRef = doc(db, "marketplace", itemToRemove.id);
    await updateDoc(itemRef, { reserved: false });

    const updated = cartItems.filter((item) => item.id !== itemToRemove.id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const confirmPurchase = async () => {
    try {
      const buyerId = auth.currentUser.uid;

      for (const item of cartItems) {
        const { id, title, price, sellerId, sellerName, image } = item;

        // Delete item from marketplace
        await deleteDoc(doc(db, "marketplace", id));

        const timestamp = Timestamp.now();

        // Log in buyer's history
        await addDoc(collection(db, `users/${buyerId}/history`), {
          title,
          price,
          sellerId,
          sellerName,
          image,
          timestamp,
        });

        // Log in seller's sales history
        await addDoc(collection(db, `users/${sellerId}/sales`), {
          title,
          price,
          buyerId,
          buyerEmail: auth.currentUser.email,
          image,
          timestamp,
        });
      }

      localStorage.removeItem("cart");
      setCartItems([]);
      alert("Purchase confirmed and logged!");
      navigate("/buyer");
    } catch (err) {
      console.error("Error confirming purchase:", err);
      alert("Something went wrong while confirming the purchase.");
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + parseFloat(item.price), 0);

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-thumbnail" />
                <div className="cart-info">
                  <span>{item.title}</span>
                  <span>${item.price}</span>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item)}>❌</button>
              </li>
            ))}
          </ul>
          <div className="total-section">
            <strong>Total:</strong> ${totalPrice.toFixed(2)}
          </div>
          <button className="confirm-btn" onClick={confirmPurchase}>Confirm Purchase</button>
        </>
      )}
    </div>
  );
};

export default CartDetails;
