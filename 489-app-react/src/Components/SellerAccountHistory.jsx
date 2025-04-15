// src/Components/SellerAccountHistory.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import "./SellerAccountHistory.css";

const SellerAccountHistory = () => {
  const [history, setHistory] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchHistory();
    fetchProfilePhoto();
  }, []);

  const fetchHistory = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = collection(db, `users/${uid}/sales`);
    const snapshot = await getDocs(q);
    const soldItems = snapshot.docs.map(doc => doc.data());

    const revenue = soldItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
    setHistory(soldItems);
    setTotalRevenue(revenue);
  };

  const fetchProfilePhoto = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      setProfilePhoto(userDoc.data().profilePhoto || "");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        profilePhoto: base64Image,
      });
      setProfilePhoto(base64Image);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "N/A";
    return timestamp.toDate().toLocaleDateString();
  };

  return (
    <div className="seller-history-page">
      <div className="seller-profile">
        <img
          src={profilePhoto || "https://via.placeholder.com/120?text=No+Photo"}
          alt="Seller"
          className="profile-pic"
        />
        {!profilePhoto && (
          <div>
            <label className="upload-label">
              Upload Profile Photo
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>
          </div>
        )}
        <div className="summary-info">
          <h2>Account Summary</h2>
          <p><strong>Total Revenue:</strong> ${totalRevenue.toFixed(2)}</p>
          <p><strong>Total Items Sold:</strong> {history.length}</p>
        </div>
      </div>

      <h3>Sold Items</h3>
      <ul className="history-list">
        {history.map((item, index) => (
          <li key={index} className="history-item">
            <img src={item.image} alt={item.title} className="item-image" />
            <div className="item-info">
              <h4>{item.title}</h4>
              <p><strong>Sold for:</strong> ${item.price}</p>
              <p><strong>Buyer:</strong> {item.buyerEmail}</p>
              <p><strong>Date:</strong> {formatDate(item.timestamp)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerAccountHistory;
