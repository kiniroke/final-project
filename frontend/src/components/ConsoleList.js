import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api/config';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ConsoleList = () => {
    const [consoles, setConsoles] = useState([]);
    const [selectedConsole, setSelectedConsole] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConsoles = async () => {
            try {
                const response = await axios.get(`${API_URL}/consoles`);
                setConsoles(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch consoles');
                setLoading(false);
            }
        };

        fetchConsoles();
    }, []);

    const handleRental = async (consoleId) => {
        try {
            const token = localStorage.getItem('token');
            const selectedConsole = consoles.find(c => c._id === consoleId);
            const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            const rentalPrice = selectedConsole.price * days;

            await axios.post(
                `${API_URL}/rentals/console`,
                {
                    consoleId,
                    startDate,
                    endDate,
                    rentalPrice,
                    totalPrice: rentalPrice
                },
                { headers: { Authorization: `Bearer ${token}` }}
            );

            // Refresh consoles list
            const response = await axios.get(`${API_URL}/consoles`);
            setConsoles(response.data);
            setSelectedConsole(null);
        } catch (err) {
            setError('Failed to create rental');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="consoles-grid">
            {consoles.map(console => (
                <div key={console._id} className="console-card">
                    <h3>{console.name}</h3>
                    <p>Manufacturer: {console.manufacturer}</p>
                    <p>Release Year: {console.releaseYear}</p>
                    <p>Price per day: ${console.price}</p>
                    {console.available ? (
                        <>
                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                minDate={new Date()}
                            />
                            <DatePicker
                                selected={endDate}
                                onChange={date => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                            />
                            <button onClick={() => handleRental(console._id)}>
                                Rent Console
                            </button>
                        </>
                    ) : (
                        <p className="not-available">Currently not available</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ConsoleList; 