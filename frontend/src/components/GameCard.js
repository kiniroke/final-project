import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const GameCard = ({ game }) => {
    const [showRentalForm, setShowRentalForm] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    const [error, setError] = useState('');
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const calculateTotalPrice = () => {
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        return days * game.pricePerDay;
    };

    const handleRentClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setShowRentalForm(true);
    };

    const handleRentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/rentals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    itemId: game._id,
                    itemType: 'Game',
                    startDate,
                    endDate,
                    totalPrice: calculateTotalPrice()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create rental');
            }

            navigate('/my-rentals');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="game-card">
            <img src={game.image} alt={game.title} />
            <div className="game-info">
                <h3>{game.title}</h3>
                <p className="platform">{game.platform}</p>
                <p className="genre">{game.genre}</p>
                <div className="price">
                    <span>${game.pricePerDay}</span> в день
                </div>
                {!showRentalForm ? (
                    <button 
                        className="rent-button"
                        onClick={handleRentClick}
                        disabled={!game.availability?.isAvailable}
                    >
                        {game.availability?.isAvailable ? 'Арендовать' : 'Недоступно'}
                    </button>
                ) : (
                    <form onSubmit={handleRentSubmit} className="rental-form">
                        <div className="date-pickers">
                            <div>
                                <label>Дата начала:</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={date => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={new Date()}
                                />
                            </div>
                            <div>
                                <label>Дата окончания:</label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={date => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                />
                            </div>
                        </div>
                        <div className="rental-summary">
                            <p>Итого: ${calculateTotalPrice()}</p>
                            {error && <p className="error">{error}</p>}
                        </div>
                        <div className="rental-buttons">
                            <button type="submit" className="confirm-button">
                                Подтвердить аренду
                            </button>
                            <button 
                                type="button" 
                                className="cancel-button"
                                onClick={() => setShowRentalForm(false)}
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default GameCard; 