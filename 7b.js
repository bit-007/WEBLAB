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
        <h2>Course Enrollment Management</h2>
        <form action="/add-enrollment" method="POST">
            <label>Student ID:</label>
            <input type="text" name="student_id" required><br><br>
            
            <label>Name:</label>
            <input type="text" name="name" required><br><br>
            
            <label>Course Name:</label>
            <input type="text" name="course_name" required><br><br>
            
            <label>Duration (months):</label>
            <input type="number" name="duration" min="1" required><br><br>
            
            <label>Status:</label>
            <select name="status" required>
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
            </select><br><br>
            
            <input type="submit" value="Add Enrollment">
        </form>
        <br>
        <a href="/active-enrollments">View Active Enrollments</a><br>
        <a href="/all-enrollments">View All Enrollments</a>
    `);
});

app.post('/add-enrollment', async (req, res) => {
    try {
        const enrollment = {
            student_id: req.body.student_id,
            name: req.body.name,
            course_name: req.body.course_name,
            duration: parseInt(req.body.duration),
            status: req.body.status,
            enrolled_date: new Date()
        };
        
        await db.collection('enrollments').insertOne(enrollment);
        res.send(`
            <h2>✅ Enrollment Added Successfully!</h2>
            <p>Student: ${enrollment.name}</p>
            <p>Course: ${enrollment.course_name}</p>
            <p>Status: ${enrollment.status}</p>
            <a href="/">Add Another Enrollment</a>
        `);
    } catch (error) {
        res.status(500).send('Error adding enrollment');
    }
});

app.get('/active-enrollments', async (req, res) => {
    try {
        const enrollments = await db.collection('enrollments').find({ status: 'active' }).toArray();
        let html = '<h2>Active Course Enrollments</h2>';
        
        if (enrollments.length === 0) {
            html += '<p>No active enrollments found</p>';
        } else {
            html += '<table border="1"><tr><th>Student ID</th><th>Name</th><th>Course</th><th>Duration</th><th>Status</th></tr>';
            enrollments.forEach(enrollment => {
                html += `<tr>
                    <td>${enrollment.student_id}</td>
                    <td>${enrollment.name}</td>
                    <td>${enrollment.course_name}</td>
                    <td>${enrollment.duration} months</td>
                    <td style="color: green; font-weight: bold;">${enrollment.status}</td>
                </tr>`;
            });
            html += '</table>';
        }
        
        html += '<br><a href="/">Back to Home</a>';
        res.send(html);
    } catch (error) {
        res.status(500).send('Error retrieving enrollments');
    }
});

app.put('/update-enrollment-status/:studentId/:courseName', async (req, res) => {
    try {
        const { status } = req.body;
        const result = await db.collection('enrollments').updateOne(
            { 
                student_id: req.params.studentId,
                course_name: req.params.courseName 
            },
            { $set: { status: status, updated_date: new Date() } }
        );
        res.json({ modified: result.modifiedCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update enrollment status' });
    }
});