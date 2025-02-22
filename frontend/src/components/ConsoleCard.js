import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ConsoleCard = ({ console }) => {
    const [showRentalForm, setShowRentalForm] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    const [error, setError] = useState('');
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const calculateTotalPrice = () => {
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        return days * console.pricePerDay;
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
                    itemId: console._id,
                    itemType: 'Console',
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

    // Проверяем, что console существует
    if (!console) {
        return null;
    }

    const isAvailable = console.availability?.isAvailable ?? true;

    return (
        <div className="console-card">
            <img 
                src={console.image} 
                alt={console.name}
                onError={(e) => {
                    e.target.src = '/placeholder-console.jpg';
                }}
            />
            <div className="console-info">
                <h3>{console.name}</h3>
                <p className="brand">{console.brand}</p>
                <div className="specifications">
                    <p>Storage: {console.specifications?.storage || 'N/A'}</p>
                    <p>Color: {console.specifications?.color || 'N/A'}</p>
                </div>
                <div className="price">
                    <span>${console.pricePerDay}</span> per day
                </div>
                {!showRentalForm ? (
                    <button 
                        className="rent-button"
                        onClick={handleRentClick}
                        disabled={!console.availability?.isAvailable}
                    >
                        {console.availability?.isAvailable ? 'Арендовать' : 'Недоступно'}
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

export default ConsoleCard; 