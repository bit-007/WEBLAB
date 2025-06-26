const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const url = 'mongodb://127.0.0.1:27017';
let db;

MongoClient.connect(url)
    .then(client => {
        console.log('✅ Connected to MongoDB');
        db = client.db('college');
        app.listen(3001, () => {
            console.log('🚀 Server running on http://localhost:3001');
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection failed:', err.message);
    });

app.get('/', (req, res) => {
    res.send(`
        <h2>Product Management System</h2>
        <form action="/add-product" method="POST">
            <label>Product ID:</label>
            <input type="text" name="product_id" required><br><br>
            
            <label>Name:</label>
            <input type="text" name="name" required><br><br>
            
            <label>Price (₹):</label>
            <input type="number" name="price" min="0" step="0.01" required><br><br>
            
            <label>Discount (%):</label>
            <input type="number" name="discount" min="0" max="100" required><br><br>
            
            <label>Stock:</label>
            <input type="number" name="stock" min="0" required><br><br>
            
            <input type="submit" value="Add Product">
        </form>
        <br>
        <a href="/affordable-products">View Products with Final Price < ₹1000</a><br>
        <a href="/all-products">View All Products</a>
    `);
});

app.post('/add-product', async (req, res) => {
    
        const price = parseFloat(req.body.price);
        const discount = parseFloat(req.body.discount);
        const finalPrice = price - (price * discount / 100);
        
        const product = {
            product_id: req.body.product_id,
            name: req.body.name,
            price: price,
            discount: discount,
            final_price: finalPrice,
            stock: parseInt(req.body.stock),
            created_date: new Date()
        };
        
        await db.collection('products').insertOne(product);
        res.send(`
            <h2>✅ Product Added Successfully!</h2>
            <p>Product: ${product.name}</p>
            <p>Original Price: ₹${product.price}</p>
            <p>Discount: ${product.discount}%</p>
            <p>Final Price: ₹${product.final_price.toFixed(2)}</p>
            <a href="/">Add Another Product</a>
        `);
    
});

app.get('/affordable-products', async (req, res) => {
    
        const products = await db.collection('products').find({ final_price: { $lt: 1000 } }).toArray();
        let html = '<h2>Products with Final Price < ₹1000</h2>';
        
        if (products.length === 0) {
            html += '<p>No products found with final price less than ₹1000</p>';
        } else {
            products.forEach(product => {
            html += `
                <div style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
                    <p><strong>Product ID:</strong> ${product.product_id}</p>
                    <p><strong>Name:</strong> ${product.name}</p>
                    <p><strong>Original Price:</strong> ₹${product.price}</p>
                    <p><strong>Discount:</strong> ${product.discount}%</p>
                    <p><strong>Final Price:</strong> <span style="color: green; font-weight: bold;">₹${product.final_price.toFixed(2)}</span></p>
                    <p><strong>Stock:</strong> ${product.stock}</p>
                </div>
            `;
        });
    }
    
    html += '<a href="/">Back to Home</a>';
    res.send(html);
});