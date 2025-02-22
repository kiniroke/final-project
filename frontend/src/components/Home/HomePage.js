import React from 'react';
import FeaturedConsoles from './FeaturedConsoles';
import PromotionBanner from './PromotionBanner';
import CategoryList from './CategoryList';

const HomePage = () => {
    return (
        <div className="home-page">
            <PromotionBanner />
            <CategoryList />
            <FeaturedConsoles />
            <NewArrivals />
            <SpecialOffers />
            <CustomerReviews />
        </div>
    );
}; 