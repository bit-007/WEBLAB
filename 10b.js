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
                
            </select><br><br>
            
            <label>Funding Required (₹ in lakhs):</label>
            <input type="number" name="funding_required" min="0" step="0.1" required><br><br>
            
            <input type="submit" value="Submit Idea">
        </form>
        <br>
        <a href="/edtech-high-funding">View EdTech Ideas with Funding > ₹5 Lakhs</a><br>
        
    `);
});

app.post('/add-startup-idea', async (req, res) => {
    
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
            <a href="/s">Submit Another Idea</a>
        `);
    
});

app.get('/edtech-high-funding', async (req, res) => {
    
        const ideas = await db.collection('startup_ideas').find({ 
            domain: 'EdTech',
            funding_required: { $gt: 5 }
        }).toArray();
        
        let html = '<h2>EdTech Startup Ideas with Funding > ₹5 Lakhs</h2>';
        
            ideas.forEach(idea => {
            html += `
                <div style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
                    <p><strong>ID:</strong> ${idea.id}</p>
                    <p><strong>Team:</strong> ${idea.team_name}</p>
                    <p><strong>Title:</strong> ${idea.title}</p>
                    <p><strong>Domain:</strong> <span style="color: blue; font-weight: bold;">${idea.domain}</span></p>
                    <p><strong>Funding Required:</strong> <span style="color: red; font-weight: bold;">₹${idea.funding_required} Lakhs</span></p>
                </div>
            `;
        });
    
    
    html += '<a href="/">Back to Home</a>';
    res.send(html);
});