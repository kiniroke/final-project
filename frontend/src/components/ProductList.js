import React, { useState, useEffect } from 'react';
import ConsoleCard from './ConsoleCard';
import GameCard from './GameCard';
import '../styles/ProductList.css';

const ProductList = () => {
    const [consoles, setConsoles] = useState([]);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('consoles');
    const [filters, setFilters] = useState({
        platform: 'all',
        priceRange: 'all',
        genre: 'all',
        availability: 'all'
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [consolesRes, gamesRes] = await Promise.all([
                    fetch(`${process.env.REACT_APP_API_URL}/consoles`),
                    fetch(`${process.env.REACT_APP_API_URL}/games`)
                ]);

                const consolesData = await consolesRes.json();
                const gamesData = await gamesRes.json();

                setConsoles(consolesData);
                setGames(gamesData);
                setLoading(false);
            } catch (err) {
                setError('Ошибка при загрузке данных');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filterProducts = (products) => {
        return products.filter(product => {
            if (filters.platform !== 'all' && product.platform !== filters.platform) return false;
            if (filters.availability === 'available' && !product.availability?.isAvailable) return false;
            if (filters.genre !== 'all' && product.genre !== filters.genre) return false;
            if (filters.priceRange !== 'all') {
                const price = product.pricePerDay;
                switch (filters.priceRange) {
                    case 'under5': return price < 5;
                    case '5to10': return price >= 5 && price <= 10;
                    case 'over10': return price > 10;
                    default: return true;
                }
            }
            return true;
        });
    };

    if (loading) return <div className="loading-spinner">Загрузка...</div>;
    if (error) return <div className="error-message">{error}</div>;

    const filteredProducts = activeTab === 'consoles' ? filterProducts(consoles) : filterProducts(games);

    return (
        <div className="products-page">
            <header className="products-header">
                <h1>{activeTab === 'consoles' ? 'Аренда Консолей' : 'Аренда Игр'}</h1>
                <div className="tabs">
                    <button 
                        className={`tab ${activeTab === 'consoles' ? 'active' : ''}`}
                        onClick={() => setActiveTab('consoles')}
                    >
                        Игровые Консоли
                    </button>
                    <button 
                        className={`tab ${activeTab === 'games' ? 'active' : ''}`}
                        onClick={() => setActiveTab('games')}
                    >
                        Видеоигры
                    </button>
                </div>
            </header>

            <div className="filters-section">
                <select 
                    value={filters.platform} 
                    onChange={(e) => setFilters({...filters, platform: e.target.value})}
                >
                    <option value="all">Все платформы</option>
                    <option value="PlayStation 5">PlayStation 5</option>
                    <option value="Xbox Series X">Xbox Series X</option>
                    <option value="Nintendo Switch">Nintendo Switch</option>
                </select>

                <select 
                    value={filters.priceRange} 
                    onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                >
                    <option value="all">Любая цена</option>
                    <option value="under5">До $5 в день</option>
                    <option value="5to10">$5 - $10 в день</option>
                    <option value="over10">Более $10 в день</option>
                </select>

                {activeTab === 'games' && (
                    <select 
                        value={filters.genre} 
                        onChange={(e) => setFilters({...filters, genre: e.target.value})}
                    >
                        <option value="all">Все жанры</option>
                        <option value="Action">Экшен</option>
                        <option value="RPG">RPG</option>
                        <option value="Sports">Спорт</option>
                        <option value="Strategy">Стратегии</option>
                    </select>
                )}

                <select 
                    value={filters.availability} 
                    onChange={(e) => setFilters({...filters, availability: e.target.value})}
                >
                    <option value="all">Все товары</option>
                    <option value="available">Только доступные</option>
                </select>
            </div>

            <div className="products-grid">
                {filteredProducts.length > 0 ? (
                    activeTab === 'consoles' ? (
                        filteredProducts.map(console => (
                            <ConsoleCard key={console._id} console={console} />
                        ))
                    ) : (
                        filteredProducts.map(game => (
                            <GameCard key={game._id} game={game} />
                        ))
                    )
                ) : (
                    <div className="no-results">
                        Нет товаров, соответствующих выбранным фильтрам
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList; 