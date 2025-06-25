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
            <select name="branch" required>
                <option value="">Select Branch</option>
                <option value="CSE">Computer Science Engineering</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="CE">Civil Engineering</option>
            </select><br><br>
            
            <label>Semester:</label>
            <select name="semester" required>
                <option value="">Select Semester</option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="3">3rd Semester</option>
                <option value="4">4th Semester</option>
                <option value="5">5th Semester</option>
                <option value="6">6th Semester</option>
                <option value="7">7th Semester</option>
                <option value="8">8th Semester</option>
            </select><br><br>
            
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
            semester: parseInt(req.body.semester),
            created_date: new Date()
        };
        
        await db.collection('user_students').insertOne(student);
        res.send(`
            <h2>✅ Student Added Successfully!</h2>
            <p>Name: ${student.user_name}</p>
            <p>Branch: ${student.branch}</p>
            <p>Semester: ${student.semester}</p>
            <a href="/">Add Another Student</a>
        `);
    
});

app.get('/cse-6th-semester', async (req, res) => {
   
        const students = await db.collection('user_students').find({ 
            semester: 6, 
            branch: 'CSE' 
        }).toArray();
        
        let html = '<h2>6th Semester CSE Students</h2>';
        
        if (students.length === 0) {
            html += '<p>No 6th semester CSE students found</p>';
        } else {
            html += '<table border="1"><tr><th>Name</th><th>Branch</th><th>Semester</th><th>Added Date</th></tr>';
            students.forEach(student => {
                html += `<tr>
                    <td>${student.user_name}</td>
                    <td style="color: blue; font-weight: bold;">${student.branch}</td>
                    <td style="color: green; font-weight: bold;">${student.semester}</td>
                    <td>${student.created_date.toDateString()}</td>
                </tr>`;
            });
            html += '</table>';
            html += `<br><p><strong>Total 6th Semester CSE Students: ${students.length}</strong></p>`;
        }
        
        html += '<br><a href="/">Back to Home</a>';
        res.send(html);
    
});