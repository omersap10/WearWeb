import React from 'react';
import './Cart.css';

const Cart = ({ cart, total, removeFromCart, buyItems }) => (
    <div className="cart">
        <h2>Shopping Cart</h2>
        <ul>
            {cart.map((item, index) => (
                <li key={index}>
                    {item.name} - ${item.price.toFixed(2)}
                    <button onClick={() => removeFromCart(index)}>Remove</button>
                </li>
            ))}
        </ul>
        <h3>Total: ${total.toFixed(2)}</h3>
        <button onClick={buyItems}>Buy</button>
    </div>
);

export default Cart;
