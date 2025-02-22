import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';

const RentalForm = ({ console, onSubmit }) => {
    const [formData, setFormData] = useState({
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        delivery: {
            address: {
                street: '',
                city: '',
                zipCode: ''
            }
        },
        payment: {
            method: 'card',
            cardNumber: '',
            expiryDate: '',
            cvv: ''
        }
    });

    const calculateTotal = () => {
        const days = Math.ceil((formData.endDate - formData.startDate) / (1000 * 60 * 60 * 24));
        return days * console.pricePerDay;
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="rental-details">
                <h3>Rental Period</h3>
                <DateRangePicker
                    startDate={formData.startDate}
                    endDate={formData.endDate}
                    onChange={handleDateChange}
                />
            </div>

            <div className="delivery-details">
                <h3>Delivery Information</h3>
                {/* Поля доставки */}
            </div>

            <div className="payment-details">
                <h3>Payment Information</h3>
                {/* Поля оплаты */}
            </div>

            <div className="summary">
                <h3>Order Summary</h3>
                <p>Rental Period: {calculateDays()} days</p>
                <p>Daily Rate: ${console.pricePerDay}</p>
                <p>Total: ${calculateTotal()}</p>
            </div>

            <button type="submit">Confirm Rental</button>
        </form>
    );
};

export default RentalForm; 