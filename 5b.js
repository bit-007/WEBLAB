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
        <h2>Student Grade Management</h2>
        <form action="/add-student-grade" method="POST">
            <label>Name:</label>
            <input type="text" name="name" required><br><br>
            
            <label>USN:</label>
            <input type="text" name="usn" required><br><br>
            
            <label>Department:</label>
            <input type="text" name="department" required><br><br>
            
            <label>Grade:</label>
            <select name="grade" required>
                <option value="">Select Grade</option>
                <option value="S">S</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
            </select><br><br>
            
            <input type="submit" value="Add Student">
        </form>
        <br>
        <form action="/update-grade" method="POST">
            <h3>Update Student Grade</h3>
            <label>Student Name:</label>
            <input type="text" name="name" required><br><br>
            
            <label>New Grade:</label>
            <select name="grade" required>
                <option value="">Select Grade</option>
                <option value="S">S</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
            </select><br><br>
            
            <input type="submit" value="Update Grade">
        </form>
        <br>
        <a href="/all-student-grades">View All Student Records</a>
    `);
});

app.post('/add-student-grade', async (req, res) => {
    
        const student = {
            name: req.body.name,
            usn: req.body.usn,
            department: req.body.department,
            grade: req.body.grade,
            created_date: new Date()
        };
        
        await db.collection('student_grades').insertOne(student);
        res.send(`
            <h2>✅ Student Added Successfully!</h2>
            <p>Name: ${student.name}</p>
            <p>USN: ${student.usn}</p>
            <p>Grade: ${student.grade}</p>
            <a href="/">Back to Home</a>
        `);
    
});

app.post('/update-grade', async (req, res) => {
    
        const { name, grade } = req.body;
        const result = await db.collection('student_grades').updateOne(
            { name: name },
            { $set: { grade: grade, updated_date: new Date() } }
        );
        
        
});

app.get('/all-student-grades', async (req, res) => {
    
        const students = await db.collection('student_grades').find({}).toArray();
        let html = '<h2>All Student Records</h2>';
        
        
            html += '<table border="1"><tr><th>Name</th><th>USN</th><th>Department</th><th>Grade</th></tr>';
            students.forEach(student => {
                html += `<tr>
                    <td>${student.name}</td>
                    <td>${student.usn}</td>
                    <td>${student.department}</td>
                    <td>${student.grade}</td>
                </tr>`;
            });
            html += '</table>';
        
        
        html += '<br><a href="/">Back to Home</a>';
        res.send(html);
    
});