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
        <h2>Student Management - CSE Department</h2>
        <form action="/add-user-student" method="POST">
            <label>User Name:</label>
            <input type="text" name="user_name" required><br><br>
            
            <label>Branch:</label>
            <input type="text" name="branch" required><br><br>
            
            
            <label>Semester:</label>
            <input type="text" name="sem" required><br><br>
            
            
            <input type="submit" value="Add Student">
        </form>
        <br>
        <a href="/cse-6th-semester">View 6th Semester CSE Students</a><br>
        
    `);
});

app.post('/add-user-student', async (req, res) => {
    
        const student = {
            user_name: req.body.user_name,
            branch: req.body.branch,
            sem: parseInt(req.body.sem),
            created_date: new Date()
        };
        
        await db.collection('user_students').insertOne(student);
        res.send(`
            <h2>✅ Student Added Successfully!</h2>
            <p>Name: ${student.user_name}</p>
            <p>Branch: ${student.branch}</p>
            <p>Semester: ${student.sem}</p>
            <a href="/">Add Another Student</a>
        `);
    
});

app.get('/cse-6th-semester', async (req, res) => {
   
        const students = await db.collection('user_students').find({ 
            sem: 6, 
           branch: { $in: ['CSE', 'cse'] }
        }).toArray();
        
        let html = '<h2>6th Semester CSE Students</h2>';
        
            students.forEach(student => {
            html += `
                <div style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
                    <p><strong>Name:</strong> ${student.user_name}</p>
                    <p><strong>Branch:</strong> <span style="color: blue; font-weight: bold;">${student.branch}</span></p>
                    <p><strong>Semester:</strong> <span style="color: green; font-weight: bold;">${student.sem}</span></p>
                    <p><strong>Added Date:</strong> ${student.created_date.toDateString()}</p>
                </div>
            `;
        });
        html += `<p><strong>Total 6th Semester CSE Students: ${students.length}</strong></p>`;
    
    
    html += '<a href="/">Back to Home</a>';
    res.send(html);
});
