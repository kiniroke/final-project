import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GameCard = ({ game, onRent }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="game-card">
      <img 
        src={imageError ? '/placeholder.jpg' : game.image} 
        alt={game.title}
        onError={() => setImageError(true)}
      />
      <div className="game-info">
        <h3>{game.title}</h3>
        <p className="platform">{game.platform}</p>
        <p className="genre">{game.genre}</p>
        <div className="price">
          <span>${game.pricePerDay}</span> per day
        </div>
        <button 
          className="rent-button"
          onClick={() => onRent(game._id)}
          disabled={!game.status?.isAvailable}
        >
          {game.status?.isAvailable ? 'Rent Now' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:4004/api/games');
        setGames(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching games');
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleRent = async (gameId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:4004/api/games/${gameId}/rent`,
        { rentalDays: 3 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/my-rentals');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to rent game');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="games-container">
      <h2>Games Available for Rent</h2>
      <div className="games-grid">
        {games.map(game => (
          <GameCard 
            key={game._id} 
            game={game} 
            onRent={handleRent}
          />
        ))}
      </div>
    </div>
  );
};

export default GameList; 