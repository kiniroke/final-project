import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import OrderHistory from './OrderHistory';
import RentalHistory from './RentalHistory';
import Wishlist from './Wishlist';
import ProfileSettings from './ProfileSettings';
import PaymentMethods from './PaymentMethods';
import DeliveryAddresses from './DeliveryAddresses';

const UserProfile = () => {
    return (
        <div className="profile-page">
            <aside className="profile-sidebar">
                <ProfileMenu />
            </aside>

            <main className="profile-content">
                <Switch>
                    <Route path="/profile/orders" component={OrderHistory} />
                    <Route path="/profile/rentals" component={RentalHistory} />
                    <Route path="/profile/wishlist" component={Wishlist} />
                    <Route path="/profile/settings" component={ProfileSettings} />
                    <Route path="/profile/payments" component={PaymentMethods} />
                    <Route path="/profile/addresses" component={DeliveryAddresses} />
                </Switch>
            </main>
        </div>
    );
};

export default UserProfile; 