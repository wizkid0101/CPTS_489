// src/Components/SellerDashboard.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import "./SellerDashboard.css";

const SellerDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    condition: "",
    price: "",
    image: "",
    description: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchSellerItems(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchSellerItems = async (uid) => {
    const q = query(collection(db, "marketplace"), where("sellerId", "==", uid));
    const snapshot = await getDocs(q);
    const items = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter(item => !item.reserved);
    setInventory(items);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = async () => {
    const { title, condition, price, image, description } = newItem;
    if (!title || !condition || !price || !image || !description) {
      alert("Please fill in all fields.");
      return;
    }

    const userDoc = await getDocs(query(collection(db, "users"), where("email", "==", auth.currentUser.email)));
    const userData = userDoc.docs[0]?.data();

    await addDoc(collection(db, "marketplace"), {
      ...newItem,
      sellerId: auth.currentUser.uid,
      sellerName: userData?.displayName || userData?.email,
      reserved: false
    });

    alert("Item added to your inventory!");
    setNewItem({ title: "", condition: "", price: "", image: "", description: "" });
    setShowModal(false);
    fetchSellerItems(auth.currentUser.uid); // refresh inventory
  };

  const handleCardClick = (item) => {
    navigate(`/seller/game/${item.id}`, { state: { game: item } });
  };

  return (
    <div className="seller-dashboard">
      <nav className="top-nav">
        <h1 className="logo">🎮 Bazzar Gamez</h1>
        <div className="nav-links">
          <a href="#">Dashboard</a>
          <a onClick={() => navigate("/seller/history")}>Account History</a>
          <a href="#">Logout</a>
        </div>
      </nav>

      <div className="welcome-banner">
        <div className="banner-content">
          <h2>Welcome, Seller!</h2>
          <p>List your games and start selling today.</p>
        </div>
        <button className="banner-btn" onClick={() => setShowModal(true)}>+ Add Game</button>
      </div>

      <div className="search-wrapper">
        <input className="search-input" type="text" placeholder="Search your listings..." />
      </div>

      <h2 className="section-title">Your Inventory</h2>

      <div className="card-grid">
        {inventory.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "2rem", color: "#777" }}>
            You haven’t listed any games yet.
          </p>
        ) : (
          inventory.map((item) => (
            <div className="game-card" key={item.id} onClick={() => handleCardClick(item)} style={{ cursor: "pointer" }}>
              {item.image && <img src={item.image} alt={item.title} className="game-image" />}
              <h3>{item.title}</h3>
              <p><strong>Condition:</strong> {item.condition}</p>
              <p><strong>Price:</strong> ${item.price}</p>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Add New Game</h2>
            <input type="text" name="title" placeholder="Title" value={newItem.title} onChange={handleInputChange} />
            <input type="text" name="condition" placeholder="Condition" value={newItem.condition} onChange={handleInputChange} />
            <input type="number" name="price" placeholder="Price" value={newItem.price} onChange={handleInputChange} />
            <textarea name="description" placeholder="Seller Description" value={newItem.description} onChange={handleInputChange} />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddItem}>Add</button>
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
