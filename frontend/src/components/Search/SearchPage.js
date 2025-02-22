import React, { useState } from 'react';
import FilterSection from './FilterSection';
import SearchHeader from './SearchHeader';
import ConsoleCard from '../Console/ConsoleCard';
import Pagination from './Pagination';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useState({
        query: '',
        category: '',
        priceRange: [0, 1000],
        availability: true,
        brand: [],
        sortBy: 'relevance'
    });

    return (
        <div className="search-page">
            <aside className="filters-sidebar">
                <FilterSection 
                    filters={searchParams}
                    onChange={handleFilterChange}
                />
            </aside>

            <main className="search-results">
                <SearchHeader 
                    total={totalResults}
                    sortBy={searchParams.sortBy}
                    onSortChange={handleSortChange}
                />

                <div className="results-grid">
                    {results.map(console => (
                        <ConsoleCard key={console._id} console={console} />
                    ))}
                </div>

                <Pagination 
                    total={totalPages}
                    current={currentPage}
                    onChange={handlePageChange}
                />
            </main>
        </div>
    );
};

export default SearchPage; 