import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RentalForm = ({ itemId, itemType, pricePerDay, onClose }) => {
    const [days, setDays] = useState(1);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:4004/api/rentals',
                {
                    itemId,
                    itemType: 'Console',
                    rentalDays: days
                },
                {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                onClose();
                navigate('/my-rentals');
            }
        } catch (error) {
            console.error('Rental error:', error);
            setError(error.response?.data?.message || 'Failed to create rental');
        }
    };

    return (
        <div className="rental-form-overlay">
            <div className="rental-form">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2>Rent {itemType}</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Number of Days:</label>
                        <input
                            type="number"
                            min="1"
                            max="30"
                            value={days}
                            onChange={(e) => setDays(parseInt(e.target.value))}
                            required
                        />
                    </div>
                    <div className="price-calculation">
                        <p>Price per day: ${pricePerDay}</p>
                        <p>Total price: ${pricePerDay * days}</p>
                    </div>
                    <button type="submit" className="submit-button">
                        Confirm Rental
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RentalForm; 