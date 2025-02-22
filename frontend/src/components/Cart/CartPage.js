import React, { useState } from 'react';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [promoCode, setPromoCode] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('delivery');

    return (
        <div className="cart-page">
            <div className="cart-items">
                {cart.map(item => (
                    <CartItem 
                        key={item.id}
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemove}
                    />
                ))}
            </div>

            <div className="cart-sidebar">
                <div className="promo-code">
                    <input 
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button onClick={applyPromoCode}>Apply</button>
                </div>

                <div className="delivery-options">
                    <h3>Delivery Method</h3>
                    <select value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)}>
                        <option value="delivery">Home Delivery</option>
                        <option value="pickup">Pickup from Store</option>
                    </select>
                </div>

                <OrderSummary 
                    items={cart}
                    promoCode={promoCode}
                    deliveryMethod={deliveryMethod}
                />

                <button className="checkout-button" onClick={proceedToCheckout}>
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default CartPage; 