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

app.get('/startup-ideas', (req, res) => {
    res.send(`
        <h2>Startup Ideas Portal</h2>
        <form action="/add-startup-idea" method="POST">
            <label>ID:</label>
            <input type="text" name="id" required><br><br>
            
            <label>Team Name:</label>
            <input type="text" name="team_name" required><br><br>
            
            <label>Title:</label>
            <input type="text" name="title" required><br><br>
            
            <label>Domain:</label>
            <select name="domain" required>
                <option value="">Select Domain</option>
                <option value="EdTech">EdTech</option>
                <option value="FinTech">FinTech</option>
                <option value="HealthTech">HealthTech</option>
                <option value="E-commerce">E-commerce</option>
                <option value="AI/ML">AI/ML</option>
                <option value="IoT">IoT</option>
                <option value="Other">Other</option>
            </select><br><br>
            
            <label>Funding Required (₹ in lakhs):</label>
            <input type="number" name="funding_required" min="0" step="0.1" required><br><br>
            
            <input type="submit" value="Submit Idea">
        </form>
        <br>
        <a href="/edtech-high-funding">View EdTech Ideas with Funding > ₹5 Lakhs</a><br>
        <a href="/all-startup-ideas">View All Startup Ideas</a>
    `);
});

app.post('/add-startup-idea', async (req, res) => {
    try {
        const startupIdea = {
            id: req.body.id,
            team_name: req.body.team_name,
            title: req.body.title,
            domain: req.body.domain,
            funding_required: parseFloat(req.body.funding_required),
            submitted_date: new Date()
        };
        
        await db.collection('startup_ideas').insertOne(startupIdea);
        res.send(`
            <h2>✅ Startup Idea Submitted Successfully!</h2>
            <p>Team: ${startupIdea.team_name}</p>
            <p>Title: ${startupIdea.title}</p>
            <p>Domain: ${startupIdea.domain}</p>
            <p>Funding Required: ₹${startupIdea.funding_required} Lakhs</p>
            <a href="/startup-ideas">Submit Another Idea</a>
        `);
    } catch (error) {
        res.status(500).send('Error submitting startup idea');
    }
});

app.get('/edtech-high-funding', async (req, res) => {
    try {
        const ideas = await db.collection('startup_ideas').find({ 
            domain: 'EdTech',
            funding_required: { $gt: 5 }
        }).toArray();
        
        let html = '<h2>EdTech Startup Ideas with Funding > ₹5 Lakhs</h2>';
        
        if (ideas.length === 0) {
            html += '<p>No EdTech ideas found requiring funding more than ₹5 lakhs</p>';
        } else {
            html += '<table border="1"><tr><th>ID</th><th>Team</th><th>Title</th><th>Domain</th><th>Funding Required</th></tr>';
            ideas.forEach(idea => {
                html += `<tr>
                    <td>${idea.id}</td>
                    <td>${idea.team_name}</td>
                    <td>${idea.title}</td>
                    <td style="color: blue; font-weight: bold;">${idea.domain}</td>
                    <td style="color: red; font-weight: bold;">₹${idea.funding_required} Lakhs</td>
                </tr>`;
            });
            html += '</table>';
        }
        
        html += '<br><a href="/startup-ideas">Back to Home</a>';
        res.send(html);
    } catch (error) {
        res.status(500).send('Error retrieving startup ideas');
    }
});