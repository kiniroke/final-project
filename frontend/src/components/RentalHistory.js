import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api/config';
import { format } from 'date-fns';

const RentalHistory = () => {
    const [rentals, setRentals] = useState([]);
    const [activeRentals, setActiveRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const token = localStorage.getItem('token');
                const [historyResponse, activeResponse] = await Promise.all([
                    axios.get(`${API_URL}/rentals/history`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${API_URL}/rentals/active`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setRentals(historyResponse.data);
                setActiveRentals(activeResponse.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch rental history');
                setLoading(false);
            }
        };

        fetchRentals();
    }, []);

    const handleCompleteRental = async (rentalId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `${API_URL}/rentals/${rentalId}/complete`,
                {},
                { headers: { Authorization: `Bearer ${token}` }}
            );
            
            // Refresh rentals after completion
            const activeResponse = await axios.get(
                `${API_URL}/rentals/active`,
                { headers: { Authorization: `Bearer ${token}` }}
            );
            setActiveRentals(activeResponse.data);
            
            const historyResponse = await axios.get(
                `${API_URL}/rentals/history`,
                { headers: { Authorization: `Bearer ${token}` }}
            );
            setRentals(historyResponse.data);
        } catch (err) {
            setError('Failed to complete rental');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="rental-history">
            <h2>Active Rentals</h2>
            <div className="rentals-grid">
                {activeRentals.map(rental => (
                    <div key={rental._id} className="rental-card">
                        {rental.items.map(item => (
                            <div key={item._id}>
                                <h3>{item.itemType === 'console' ? item.item.name : item.item.title}</h3>
                                <p>Rental Price: ${item.rentalPrice}</p>
                            </div>
                        ))}
                        <p>Start Date: {format(new Date(rental.startDate), 'PP')}</p>
                        <p>End Date: {format(new Date(rental.endDate), 'PP')}</p>
                        <p>Total Price: ${rental.totalPrice}</p>
                        <button onClick={() => handleCompleteRental(rental._id)}>
                            Complete Rental
                        </button>
                    </div>
                ))}
            </div>

            <h2>Rental History</h2>
            <div className="rentals-grid">
                {rentals.map(rental => (
                    <div key={rental._id} className="rental-card">
                        {rental.items.map(item => (
                            <div key={item._id}>
                                <h3>{item.itemType === 'console' ? item.item.name : item.item.title}</h3>
                                <p>Rental Price: ${item.rentalPrice}</p>
                            </div>
                        ))}
                        <p>Start Date: {format(new Date(rental.startDate), 'PP')}</p>
                        <p>End Date: {format(new Date(rental.endDate), 'PP')}</p>
                        <p>Total Price: ${rental.totalPrice}</p>
                        <p>Status: {rental.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RentalHistory; 