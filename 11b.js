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

app.get('/attendance', (req, res) => {
    res.send(`
        <h2>Attendance Management System</h2>
        <form action="/add-attendance" method="POST">
            <label>Student ID:</label>
            <input type="text" name="student_id" required><br><br>
            
            <label>Name:</label>
            <input type="text" name="name" required><br><br>
            
            <label>Course:</label>
            <input type="text" name="course" required><br><br>
            
            <label>Total Classes:</label>
            <input type="number" name="total_classes" min="1" required><br><br>
            
            <label>Classes Attended:</label>
            <input type="number" name="classes_attended" min="0" required><br><br>
            
            <input type="submit" value="Add Student">
        </form>
        <br>
        <a href="/low-attendance">View Students with Attendance < 75%</a><br>
        <a href="/all-attendance">View All Students</a>
    `);
});

app.post('/add-attendance', async (req, res) => {
    
        const totalClasses = parseInt(req.body.total_classes);
        const classesAttended = parseInt(req.body.classes_attended);
        const attendancePercentage = (classesAttended / totalClasses) * 100;
        
        const student = {
            student_id: req.body.student_id,
            name: req.body.name,
            course: req.body.course,
            total_classes: totalClasses,
            classes_attended: classesAttended,
            attendance_percentage: attendancePercentage
        };
        
        await db.collection('attendance').insertOne(student);
        res.send(`
            <h2>✅ Student Added Successfully!</h2>
            <p>Name: ${student.name}</p>
            <p>Attendance: ${student.attendance_percentage.toFixed(2)}%</p>
            <a href="/attendance">Add Another Student</a>
        `);
    
});

app.get('/low-attendance', async (req, res) => {
    try {
        const students = await db.collection('attendance').find({ 
            attendance_percentage: { $lt: 75 } 
        }).toArray();
        
        let html = '<h2>Students with Attendance Below 75%</h2>';
        
        if (students.length === 0) {
            html += '<p>No students found with attendance below 75%</p>';
        } else {
            html += '<table border="1"><tr><th>Student ID</th><th>Name</th><th>Course</th><th>Attended</th><th>Total</th><th>Percentage</th></tr>';
            students.forEach(student => {
                html += `<tr>
                    <td>${student.student_id}</td>
                    <td>${student.name}</td>
                    <td>${student.course}</td>
                    <td>${student.classes_attended}</td>
                    <td>${student.total_classes}</td>
                    <td style="color: red;">${student.attendance_percentage.toFixed(2)}%</td>
                </tr>`;
            });
            html += '</table>';
        }
        
        html += '<br><a href="/attendance">Back to Home</a>';
        res.send(html);
    } catch (error) {
        res.status(500).send('Error retrieving attendance data');
    }
});