import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import ProductsPage from './Components/ProductsPage';
import Cart from './Components/Cart';
import PurchasedItemsModal from './Components/PurchasedItemsModal';

function App() {
  const [view, setView] = useState('products');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showSortingOptions, setShowSortingOptions] = useState(false);
  const [showPurchasedItemsModal, setShowPurchasedItemsModal] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    filterProducts(sortOption);
  }, [sortOption, products, minPrice, maxPrice, categoryFilter, searchQuery]);

  const filterProducts = (option) => {
    let filteredArray = [...products];

    if (minPrice !== '' || maxPrice !== '') {
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Number.MAX_VALUE;
      filteredArray = filteredArray.filter(product => product.price >= min && product.price <= max);
    }

    if (categoryFilter) {
      filteredArray = filteredArray.filter(product => product.category.name.toLowerCase() === categoryFilter);
    }

    if (searchQuery) {
      filteredArray = filteredArray.filter(product => product.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (option === 'price') {
      filteredArray.sort((a, b) => a.price - b.price);
    } else if (option === 'alphabet') {
      filteredArray.sort((a, b) => a.title.localeCompare(b.title));
    }
    setFilteredProducts(filteredArray);
  };

  const handleLoginRegisterSuccess = (username) => {
    setUsername(username);
    setView('products');
    fetch(`http://localhost:3001/api/users/${username}/cart`)
      .then(response => response.json())
      .then(data => setCart(data.cart))
      .catch(error => console.error('Error fetching cart:', error));
    fetchPurchasedItems(username);
  };

  const fetchPurchasedItems = (username) => {
    fetch(`http://localhost:3001/api/users/${username}/purchasedItems`)
      .then(response => response.json())
      .then(data => setPurchasedItems(data.purchasedItems || []))
      .catch(error => console.error('Error fetching purchased items:', error));
  };

  const addToCart = (product) => {
    const updatedCart = [...cart, { name: product.title, price: product.price }];
    setCart(updatedCart);
    fetch(`http://localhost:3001/api/users/${username}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cart: updatedCart }),
    }).catch(error => console.error('Error updating cart:', error));
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    fetch(`http://localhost:3001/api/users/${username}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cart: updatedCart }),
    }).catch(error => console.error('Error updating cart:', error));
  };

  const buyItems = () => {
    fetch(`http://localhost:3001/api/users/${username}/buy`, {
      method: 'POST',
    })
      .then(() => {
        setCart([]);
        alert('Purchase successful');
      })
      .catch(error => console.error('Error processing purchase:', error));
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const toggleSortingOptions = () => {
    setShowSortingOptions(!showSortingOptions);
  };

  const handleLogout = () => {
    setUsername('');
    setCart([]);
    setView('products');
  };

  const openPurchasedItemsModal = () => {
    fetchPurchasedItems(username); // Fetch items when opening modal
    setShowPurchasedItemsModal(true);
  };

  const closePurchasedItemsModal = () => {
    setShowPurchasedItemsModal(false);
  };

  const totalCartPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>WearWeb</h1>
        <div className="nav-buttons">
          {username ? (
            <>
              <span>Welcome, {username}</span>
              <button onClick={toggleCart}>
                {showCart ? 'Hide Cart' : 'Show Cart'}
              </button>
              <button onClick={openPurchasedItemsModal}>View Purchased Items</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setView('login')}>Login</button>
              <button onClick={() => setView('register')}>Register</button>
            </>
          )}
        </div>
      </header>
      <video className="background-video" autoPlay loop muted>
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {showCart && (
        <Cart cart={cart} total={totalCartPrice} removeFromCart={removeFromCart} buyItems={buyItems} />
      )}
      {view === 'login' && <LoginPage onSuccess={handleLoginRegisterSuccess} />}
      {view === 'register' && <RegisterPage onSuccess={handleLoginRegisterSuccess} />}
      {view === 'products' && (
        <div className="content">
          <button className="toggle-sorting" onClick={toggleSortingOptions}>
            {showSortingOptions ? 'Hide Sorting Options' : 'Show Sorting Options'}
          </button>
          {showSortingOptions && (
            <div className="sorting-options">
              <div className="filter-container">
                <div>
                  <label>
                    Sort by:
                    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                      <option value="default">Default</option>
                      <option value="price">Price</option>
                      <option value="alphabet">Alphabet</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label>
                    Min Price:
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      style={{ width: '80px' }}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Max Price:
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      style={{ width: '80px' }}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    Category:
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                      <option value="">All</option>
                      <option value="clothes">Clothes</option>
                      <option value="electronics">Electronics</option>
                      <option value="furniture">Furniture</option>
                      <option value="shoes">Shoes</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label>
                    Search:
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: '150px' }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
          <ProductsPage products={filteredProducts} addToCart={addToCart} />
        </div>
      )}
      {showPurchasedItemsModal && (
        <PurchasedItemsModal
          purchasedItems={purchasedItems}
          onClose={closePurchasedItemsModal}
        />
      )}
    </div>
  );
}

export default App;
