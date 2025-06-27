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
        <h2>Hospital Management System</h2>
        <form action="/add-hospital" method="POST">
            <label>Hospital ID:</label>
            <input type="text" name="hospital_id" required><br><br>
            
            <label>Name:</label>
            <input type="text" name="name" required><br><br>
            
            <label>Location:</label>
            <input type="text" name="location" required><br><br>
            
            <label>Total Beds:</label>
            <input type="number" name="total_beds" min="1" required><br><br>
            
            <label>Occupied Beds:</label>
            <input type="number" name="occupied_beds" min="0" required><br><br>
            
            <input type="submit" value="Add Hospital">
        </form>
        <br>
        <a href="/available-beds">View Hospitals with Available Beds < 10</a><br>
        <a href="/admit-patient">Admit Patient</a><br>
        
    `);
});

app.post('/add-hospital', async (req, res) => {
    
        const hospital = {
            hospital_id: req.body.hospital_id,
            name: req.body.name,
            location: req.body.location,
            total_beds: parseInt(req.body.total_beds),
            occupied_beds: parseInt(req.body.occupied_beds)
        };
        
        await db.collection('hospitals').insertOne(hospital);
        res.send(`
            <h2>✅ Hospital Added Successfully!</h2>
            <p>Name: ${hospital.name}</p>
            <p>Available Beds: ${hospital.total_beds - hospital.occupied_beds}</p>
            <a href="/">Add Another Hospital</a>
        `);
    
});

app.get('/available-beds', async (req, res) => {
    const hospitals = await db.collection('hospitals').aggregate([
        { $addFields: { available_beds: { $subtract: ["$total_beds", "$occupied_beds"] } } },
        { $match: { available_beds: { $lt: 10 } } }
    ]).toArray();
    
    let html = '<h2>Hospitals with Available Beds < 10</h2>';
    hospitals.forEach(hospital => {
        html += `
            <div style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
                <p><strong>Hospital:</strong> ${hospital.name}</p>
                <p><strong>Location:</strong> ${hospital.location}</p>
                <p><strong>Total Beds:</strong> ${hospital.total_beds}</p>
                <p><strong>Occupied:</strong> ${hospital.occupied_beds}</p>
                <p><strong>Available:</strong> <span style="color: red; font-weight: bold;">${hospital.available_beds}</span></p>
            </div>
        `;
    });
    html += '<a href="/">Back to Home</a>';
    res.send(html);
});


app.get('/admit-patient', async (req, res) => {
    const hospitals = await db.collection('hospitals').find({}).toArray();
    let html = `
        <h2>Admit Patient</h2>
        <form action="/admit-patient" method="POST">
            <select name="hospital_id" required>
    `;
    hospitals.forEach(h => {
        html += `<option value="${h.hospital_id}">${h.name}</option>`;
    });
    html += `
            </select><br>
            <input type="submit" value="Admit Patient">
        </form>
        <a href="/">Back</a>
    `;
    res.send(html);
});

app.post('/admit-patient', async (req, res) => {
    await db.collection('hospitals').updateOne(
        { hospital_id: req.body.hospital_id },
        { $inc: { occupied_beds: 1 } }
    );
    res.send('Patient admitted! <a href="/">Back</a>');
});