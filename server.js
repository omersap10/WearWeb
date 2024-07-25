const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./users');

const app = express();
const PORT = 3001;
const MONGODB_URI = 'mongodb+srv://ormiles:Or12345@wearweb.jlrmcet.mongodb.net/';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.post('/api/users/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username, password, cart: [] });
        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send('Error registering user');
    }
});

app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findByCredentials(username, password);
        if (!user) {
            return res.status(401).send('Invalid credentials');
        }
        res.send({ user });
    } catch (error) {
        res.status(400).send('Error logging in');
    }
});

app.get('/api/users/:username/cart', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        res.send({ cart: user.cart });
    } catch (error) {
        res.status(400).send('Error fetching cart');
    }
});

app.post('/api/users/:username/cart', async (req, res) => {
    const { username } = req.params;
    const { cart } = req.body;
    try {
        const user = await User.findOne({ username });
        user.cart = cart;
        await user.save();
        res.send('Cart updated');
    } catch (error) {
        res.status(400).send('Error updating cart');
    }
});

app.post('/api/users/:username/buy', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        user.purchasedItems = user.purchasedItems.concat(user.cart); // Add cart items to purchased items
        user.cart = []; // Clear the cart
        await user.save();
        res.send('Purchase successful');
    } catch (error) {
        res.status(400).send('Error processing purchase');
    }
});


app.get('/api/products', async (req, res) => {
    try {
        const response = await fetch('https://api.escuelajs.co/api/v1/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Failed to fetch products');
    }
});

app.get('/api/users/:username/purchasedItems', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send({ purchasedItems: user.purchasedItems });
    } catch (error) {
        res.status(400).send('Error fetching purchased items');
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
