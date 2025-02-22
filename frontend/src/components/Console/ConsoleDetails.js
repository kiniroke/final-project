import React, { useState } from 'react';
import ImageGallery from 'react-image-gallery';
import ReviewSection from '../Review/ReviewSection';
import RentalCalendar from '../Rental/RentalCalendar';

const ConsoleDetails = ({ console }) => {
    const [selectedTab, setSelectedTab] = useState('description');

    return (
        <div className="console-details">
            <div className="console-header">
                <h1>{console.name}</h1>
                <div className="rating">
                    <StarRating value={console.averageRating} />
                    <span>({console.ratings.length} reviews)</span>
                </div>
            </div>

            <div className="console-main">
                <div className="image-gallery">
                    <ImageGallery items={console.images} />
                </div>

                <div className="console-info">
                    <div className="price-section">
                        <h2>${console.pricePerDay}/day</h2>
                        {console.discount && (
                            <span className="discount">-{console.discount}%</span>
                        )}
                    </div>

                    <div className="availability">
                        <AvailabilityIndicator status={console.availability} />
                        <RentalCalendar availability={console.availability} />
                    </div>

                    <div className="actions">
                        <AddToCartButton consoleId={console._id} />
                        <RentNowButton console={console} />
                        <WishlistButton consoleId={console._id} />
                    </div>
                </div>
            </div>

            <div className="console-tabs">
                <TabPanel value={selectedTab} onChange={setSelectedTab}>
                    <Tab label="Description" value="description">
                        <ConsoleDescription console={console} />
                    </Tab>
                    <Tab label="Specifications" value="specs">
                        <ConsoleSpecs specs={console.specifications} />
                    </Tab>
                    <Tab label="Reviews" value="reviews">
                        <ReviewSection consoleId={console._id} />
                    </Tab>
                    <Tab label="Rental Terms" value="terms">
                        <RentalTerms />
                    </Tab>
                </TabPanel>
            </div>

            <div className="related-consoles">
                <h3>Similar Consoles</h3>
                <ConsoleSlider category={console.category} />
            </div>
        </div>
    );
}; 