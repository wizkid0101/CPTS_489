// src/Components/BuyerAccountHistory.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import "./BuyerAccountHistory.css";

const BuyerAccountHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, `users/${auth.currentUser.uid}/history`),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch buyer history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="history-page">
      <h2>Purchase History</h2>
      {history.length === 0 ? (
        <p>No purchases yet.</p>
      ) : (
        <ul className="history-list">
          {history.map((item) => (
            <li key={item.id} className="history-item">
              <img src={item.image} alt={item.title} className="history-thumbnail" />
              <div className="history-info">
                <h4>{item.title}</h4>
                <p><strong>Price:</strong> ${item.price}</p>
                <p><strong>Seller:</strong> {item.sellerName || "N/A"}</p>
                <p className="timestamp">
                  {item.timestamp?.toDate().toLocaleString() || "Unknown time"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BuyerAccountHistory;
