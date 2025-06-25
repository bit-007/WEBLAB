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

app.get('/exam-management', (req, res) => {
    res.send(`
        <h2>Exam Management System</h2>
        <form action="/add-exam-result" method="POST">
            <label>Student ID:</label>
            <input type="text" name="student_id" required><br><br>
            
            <label>Name:</label>
            <input type="text" name="name" required><br><br>
            
            <label>Subject:</label>
            <input type="text" name="subject" required><br><br>
            
            <label>Marks:</label>
            <input type="number" name="marks" min="0" max="100" required><br><br>
            
            <input type="submit" value="Add Result">
        </form>
        <br>
        <a href="/not-eligible">View Not Eligible Students (Marks < 20)</a><br>
        <a href="/all-results">View All Results</a>
    `);
});

app.post('/add-exam-result', async (req, res) => {
    try {
        const marks = parseInt(req.body.marks);
        const eligibilityStatus = marks < 20 ? "Not Eligible" : "Eligible";
        
        const examResult = {
            student_id: req.body.student_id,
            name: req.body.name,
            subject: req.body.subject,
            marks: marks,
            eligibility_status: eligibilityStatus
        };
        
        await db.collection('exam_results').insertOne(examResult);
        res.send(`
            <h2>✅ Exam Result Added!</h2>
            <p>Student: ${examResult.name}</p>
            <p>Marks: ${examResult.marks}</p>
            <p>Status: ${examResult.eligibility_status}</p>
            <a href="/exam-management">Add Another Result</a>
        `);
    } catch (error) {
        res.status(500).send('Error adding exam result');
    }
});

app.get('/not-eligible', async (req, res) => {
    try {
        const students = await db.collection('exam_results').find({ 
            marks: { $lt: 20 } 
        }).toArray();
        
        let html = '<h2>Not Eligible Students (Marks < 20)</h2>';
        
        if (students.length === 0) {
            html += '<p>No students found with marks below 20</p>';
        } else {
            html += '<table border="1"><tr><th>Student ID</th><th>Name</th><th>Subject</th><th>Marks</th><th>Status</th></tr>';
            students.forEach(student => {
                html += `<tr>
                    <td>${student.student_id}</td>
                    <td>${student.name}</td>
                    <td>${student.subject}</td>
                    <td style="color: red;">${student.marks}</td>
                    <td style="color: red;">${student.eligibility_status}</td>
                </tr>`;
            });
            html += '</table>';
        }
        
        html += '<br><a href="/exam-management">Back to Home</a>';
        res.send(html);
    } catch (error) {
        res.status(500).send('Error retrieving exam results');
    }
});