import React from 'react';
import './PurchasedItemsModal.css';

function PurchasedItemsModal({ purchasedItems, onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>Close</button>
                <h2>Purchased Items</h2>
                <ul>
                    {purchasedItems.length > 0 ? (
                        purchasedItems.map((item, index) => (
                            <li key={index}>
                                <span>{item.name} - ${item.price.toFixed(2)}</span>
                            </li>
                        ))
                    ) : (
                        <li>No items purchased yet.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default PurchasedItemsModal;
