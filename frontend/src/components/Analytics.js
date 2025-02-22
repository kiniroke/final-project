import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Analytics = () => {
    const [platformStats, setPlatformStats] = useState([]);
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [popularGames, setPopularGames] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [platformRes, monthlyRes, gamesRes] = await Promise.all([
                    axios.get('/api/analytics/platform-stats'),
                    axios.get('/api/analytics/monthly-stats'),
                    axios.get('/api/analytics/popular-games')
                ]);

                setPlatformStats(platformRes.data);
                setMonthlyStats(monthlyRes.data);
                setPopularGames(gamesRes.data);
            } catch (err) {
                console.error('Error fetching analytics:', err);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h2>Аналитика</h2>
            
            <section>
                <h3>Статистика по платформам</h3>
                <div>{JSON.stringify(platformStats)}</div>
            </section>

            <section>
                <h3>Ежемесячная статистика</h3>
                <div>{JSON.stringify(monthlyStats)}</div>
            </section>

            <section>
                <h3>Популярные игры</h3>
                <div>{JSON.stringify(popularGames)}</div>
            </section>
        </div>
    );
};

export default Analytics; 