// src/Components/GameDetails.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "./GameDetails.css";

const GameDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const game = location.state?.game;

  const [title, setTitle] = useState(game?.title || "");
  const [condition, setCondition] = useState(game?.condition || "");
  const [price, setPrice] = useState(game?.price || "");
  const [image, setImage] = useState(game?.image || "");
  const [description, setDescription] = useState(game?.description || "");

  useEffect(() => {
    if (!game) {
      alert("No game data provided.");
      navigate("/seller");
    }
  }, [game, navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!title || !condition || !price || !image || !description) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await updateDoc(doc(db, "marketplace", game.id), {
        title,
        condition,
        price,
        image,
        description
      });
      alert("Game updated successfully!");
      navigate("/seller");
    } catch (err) {
      alert("Error updating game: " + err.message);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this game?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "marketplace", game.id));
      alert("Game deleted.");
      navigate("/seller");
    } catch (err) {
      alert("Error deleting game: " + err.message);
    }
  };

  return (
    <div className="game-details">
      <div className="details-card">
        <h2>Edit Game</h2>

        {image && <img src={image} alt={title} className="game-preview" />}

        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Condition</label>
        <input value={condition} onChange={(e) => setCondition(e.target.value)} />

        <label>Price</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

        <label>Seller Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a short description of the game..."
        />

        <label>Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <div className="button-group">
          <button className="save-btn" onClick={handleSave}>Save</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
          <button className="cancel-btn" onClick={() => navigate("/seller")}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
