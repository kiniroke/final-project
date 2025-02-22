import React, { useState, useEffect } from 'react';
import { getConsoles } from '../../services/api';
import ConsoleCard from './ConsoleCard';
import './ConsoleList.css';

const ConsoleList = () => {
    const [consoles, setConsoles] = useState([]);
    const [filters, setFilters] = useState({
        brand: '',
        priceRange: '',
        availability: true
    });
    const [sorting, setSorting] = useState('price-asc');

    // Фильтрация и сортировка
    const filteredConsoles = consoles
        .filter(console => {
            if (filters.brand && console.brand !== filters.brand) return false;
            if (filters.availability && !console.availability.isAvailable) return false;
            return true;
        })
        .sort((a, b) => {
            switch(sorting) {
                case 'price-asc': return a.pricePerDay - b.pricePerDay;
                case 'price-desc': return b.pricePerDay - a.pricePerDay;
                case 'rating': return b.averageRating - a.averageRating;
                default: return 0;
            }
        });

    return (
        <div className="console-list-container">
            <div className="filters">
                <select onChange={e => setFilters({...filters, brand: e.target.value})}>
                    <option value="">All Brands</option>
                    <option value="Sony">Sony</option>
                    <option value="Microsoft">Microsoft</option>
                    <option value="Nintendo">Nintendo</option>
                </select>
                {/* Другие фильтры */}
            </div>

            <div className="consoles-grid">
                {filteredConsoles.map(console => (
                    <ConsoleCard 
                        key={console._id} 
                        console={console}
                        onRent={() => handleRent(console._id)}
                    />
                ))}
            </div>

            <div className="pagination">
                {/* Пагинация */}
            </div>
        </div>
    );
}; 