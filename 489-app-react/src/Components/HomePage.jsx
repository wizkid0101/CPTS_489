import React, { useState, useEffect } from "react";
import "../App.css";


const HomePage = () => {
  const [games, setGames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [gameData, setGameData] = useState({ title: "", condition: "", price: "", image: "" });

  useEffect(() => {
    const storedGames = JSON.parse(localStorage.getItem("games")) || [];
    setGames(storedGames);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGameData({ ...gameData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGameData({ ...gameData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGame = () => {
    const newGames = [...games, gameData];
    setGames(newGames);
    localStorage.setItem("games", JSON.stringify(newGames));
    setGameData({ title: "", condition: "", price: "", image: "" });
    setShowModal(false);
  };

  return (
    <div className="home-container">
      <div className="top-bar">
        <div className="title-container">
          <img src={cougarLogo} alt="WSU Logo" className="logo" />
          <h1 className="website-title">Video Game Marketplace</h1>
        </div>
        <div className="top-right-buttons">
          <button className="cart-button full-width">🛒</button>
          <button className="add-game-button full-width" onClick={() => setShowModal(true)}>Add a Game</button>
        </div>
      </div>
      
      <input type="text" placeholder="Search games..." className="search-bar" />

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add a Video Game</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={gameData.title}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="condition"
              placeholder="Condition"
              value={gameData.condition}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={gameData.price}
              onChange={handleInputChange}
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <button onClick={handleAddGame}>Add</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="game-list-container">
        <div className="game-list">
          {games.map((game, index) => (
            <div key={index} className="game-item">
              <h3>{game.title}</h3>
              <p>Condition: {game.condition}</p>
              <p>Price: ${game.price}</p>
              {game.image && <img src={game.image} alt={game.title} className="game-image" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
