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
    
        const hospitals = await db.collection('hospitals').find({}).toArray();
        const filteredHospitals = hospitals.filter(h => (h.total_beds - h.occupied_beds) < 10);
        
        let html = '<h2>Hospitals with Available Beds < 10</h2>';
        
        if (filteredHospitals.length === 0) {
            html += '<p>No hospitals found with available beds less than 10</p>';
        } else {
            html += '<table border="1"><tr><th>Hospital</th><th>Location</th><th>Total Beds</th><th>Occupied</th><th>Available</th></tr>';
            filteredHospitals.forEach(hospital => {
                const available = hospital.total_beds - hospital.occupied_beds;
                html += `<tr>
                    <td>${hospital.name}</td>
                    <td>${hospital.location}</td>
                    <td>${hospital.total_beds}</td>
                    <td>${hospital.occupied_beds}</td>
                    <td style="color: red; font-weight: bold;">${available}</td>
                </tr>`;
            });
            html += '</table>';
        }
        
        html += '<br><a href="/hospital">Back to Home</a>';
        res.send(html);
    
});

app.post('/admit-patient/:hospitalId', async (req, res) => {
    
        const result = await db.collection('hospitals').updateOne(
            { hospital_id: req.params.hospitalId },
            { $inc: { occupied_beds: 1 } }
        );
        
        if (result.modifiedCount > 0) {
            res.json({ success: true, message: 'Patient admitted successfully' });
        } else {
            res.status(404).json({ error: 'Hospital not found' });
        }
    
});