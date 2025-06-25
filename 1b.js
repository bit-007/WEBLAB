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
        <h2>Complaint Management System</h2>
        <form action="/submit-complaint" method="POST">
            <label>Complaint ID:</label>
            <input type="text" name="complaint_id" required><br><br>
            
            <label>User Name:</label>
            <input type="text" name="user_name" required><br><br>
            
            <label>Issue:</label>
            <textarea name="issue" required></textarea><br><br>
            
            <label>Status:</label>
            <select name="status" required>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
            </select><br><br>
            
            <input type="submit" value="Submit Complaint">
        </form>
        <br>
        <a href="/pending-complaints">View Pending Complaints</a><br>
        <a href="/update-form">Update Complaints</a>
    `);
});

// POST route to submit new complaint
app.post('/submit-complaint', async (req, res) => {
    
        const complaint = {
            complaint_id: req.body.complaint_id,
            user_name: req.body.user_name,
            issue: req.body.issue,
            status: req.body.status,
            created_date: new Date()
        };
        
        await db.collection('complaints').insertOne(complaint);
        res.send(`
            <h2>✅ Complaint Submitted Successfully!</h2>
            <p>Complaint ID: ${complaint.complaint_id}</p>
            <p>Status: ${complaint.status}</p>
            <a href="/">Back to Home</a>
        `);  
});

// GET route for update form
app.get('/update-form', (req, res) => {
    res.send(`
        <h2>Update Complaint Status</h2>
        <form action="/update-status" method="POST">
            <label>Complaint ID:</label>
            <input type="text" name="complaint_id" required><br><br>
            
            <label>New Status:</label>
            <select name="status" required>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
            </select><br><br>
            
            <input type="submit" value="Update Status">
        </form>
        <br>
        <a href="/">Back to Home</a>
    `);
});

// POST route to update complaint status
app.post('/update-status', async (req, res) => {
    
        const { complaint_id, status } = req.body;
        const result = await db.collection('complaints').updateOne(
            { complaint_id: complaint_id },
            { $set: { status: status, updated_date: new Date() } }
        );
        
            res.send(`
                <h2>✅ Status Updated Successfully!</h2>
                <p>Complaint ID: ${complaint_id}</p>
                <p>New Status: ${status}</p>
                <a href="/">Back to Home</a>
            `);    
});

// GET route to retrieve pending complaints
app.get('/pending-complaints', async (req, res) => {
    
        const complaints = await db.collection('complaints').find({ status: 'Pending' }).toArray();
        let html = '<h2>Pending Complaints</h2>';
        
        if (complaints.length == 0) {
            html += '<p>No pending complaints</p>';
        } else {
            complaints.forEach(complaint => {
                html += `
                    <div style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
                        <p><strong>ID:</strong> ${complaint.complaint_id}</p>
                        <p><strong>User:</strong> ${complaint.user_name}</p>
                        <p><strong>Issue:</strong> ${complaint.issue}</p>
                        <p><strong>Status:</strong> ${complaint.status}</p>
                    </div>
                `;
            });
        }
        
        html += '<a href="/">Back to Home</a>';
        res.send(html);
    
});