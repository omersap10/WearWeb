import React from 'react';
import './ProductsPage.css';

const ProductsPage = ({ products, addToCart }) => {
    console.log('Products received:', products); // Add this line
    return (
        <div className="products-list">
            {products.map((product) => (
                <div key={product.id} className="product-item">
                    <img src={product.images[0]} alt={product.title} className="product-image" />
                    <h3>{product.title}</h3>
                    <p>${product.price.toFixed(2)}</p>
                    <button onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
            ))}
        </div>
    );
};

export default ProductsPage;
