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
        <h2>Internship Tracking System</h2>
        <form action="/add-internship" method="POST">
            <label>Student ID:</label>
            <input type="text" name="student_id" required><br><br>
            
            <label>Name:</label>
            <input type="text" name="name" required><br><br>
            
            <label>Company:</label>
            <input type="text" name="company" required><br><br>
            
            <label>Duration (months):</label>
            <input type="number" name="duration" min="1" required><br><br>
            
            <label>Status:</label>
            <select name="status" required>
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
            </select><br><br>
            
            <input type="submit" value="Add Internship">
        </form>
        <br>
        <a href="/infosys-interns">View Infosys Interns</a><br>
        <a href="/update-form">Update Internship Status</a>
    `);
});

app.post('/add-internship', async (req, res) => {
    try {
        console.log("Received data:", req.body); // Debug log
        const internship = {
            student_id: req.body.student_id,
            name: req.body.name,
            company: req.body.company,
            duration: parseInt(req.body.duration),
            status: req.body.status,
            created_date: new Date()
        };
        
        console.log("Inserting:", internship); // Debug log
        await db.collection('internships').insertOne(internship);
        res.send(`
            <h2>✅ Internship Record Added!</h2>
            <p>Student: ${internship.name}</p>
            <p>Company: ${internship.company}</p>
            <p>Status: ${internship.status}</p>
            <a href="/">Add Another Record</a>
        `);
    } catch (error) {
        console.error("Error adding internship:", error);
        res.status(500).send('Error adding internship record');
    }
});

app.get('/infosys-interns', async (req, res) => {
    try {
        const interns = await db.collection('internships').find({ company: 'Infosys' }).toArray();
        let html = '<h2>Students Interning at Infosys</h2>';
        
        if (interns.length === 0) {
            html += '<p>No students found interning at Infosys</p>';
        } else {
            interns.forEach(intern => {
                html += `
                    <div style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
                        <p><strong>Student ID:</strong> ${intern.student_id}</p>
                        <p><strong>Name:</strong> ${intern.name}</p>
                        <p><strong>Company:</strong> ${intern.company}</p>
                        <p><strong>Duration:</strong> ${intern.duration} months</p>
                        <p><strong>Status:</strong> ${intern.status}</p>
                    </div>
                `;
            });
        }
        
        html += '<br><a href="/">Back to Home</a>';
        res.send(html);
    } catch (error) {
        console.error("Error retrieving interns:", error);
        res.status(500).send('Error retrieving internship data');
    }
});

// GET route for update form
app.get('/update-form', (req, res) => {
    res.send(`
        <h2>Update Internship Status</h2>
        <form action="/update-status" method="POST">
            <label>Student ID:</label>
            <input type="text" name="student_id" required><br><br>
            
            <label>New Status:</label>
            <select name="status" required>
                
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                
            </select><br><br>
            
            <input type="submit" value="Update Status">
        </form>
        <br>
        <a href="/">Back to Home</a>
    `);
});

// POST route to handle form submission (THIS WAS MISSING!)
app.post('/update-status', async (req, res) => {
    
        const { student_id, status } = req.body;
        const result = await db.collection('internships').updateOne(
            { student_id: student_id },
            { $set: { status: status, updated_date: new Date() } }
        );
        
        
            res.send(`
                <h2>✅ Status Updated Successfully!</h2>
                <p>Student ID: ${student_id}</p>
                <p>New Status: ${status}</p>
                <a href="/">Back to Home</a>
            `);       
});

