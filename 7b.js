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
                <h2>Course Enrollment</h2>
                <form action="/add-enrollment" method="POST">
                    Student ID: <input name="student_id" required><br><br>
                    Name: <input name="name" required><br><br>
                    Course: <input name="course_name" required><br><br>
                    Duration: <input type="number" name="duration" required><br><br>
                    Status: <select name="status" required>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select><br><br>
                    <input type="submit" value="Add">
                </form>
                <a href="/active-enrollments">View Active</a> | 
                <a href="/update-form">Update Status</a>
            `);
        });

app.post('/add-enrollment', async (req, res) => {
            await db.collection('enrollments').insertOne({
                student_id: req.body.student_id,
                name: req.body.name,
                course_name: req.body.course_name,
                duration: parseInt(req.body.duration),
                status: req.body.status,
                date: new Date()
            });
            res.send('<h2>✅ Added!</h2><a href="/">Back</a>');
        });

app.get('/update-form', (req, res) => {
            res.send(`
                <h2>Update Status</h2>
                <form action="/update-status" method="POST">
                    Student ID: <input name="student_id" required><br><br>
                    New Status: <select name="status" required>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select><br><br>
                    <input type="submit" value="Update">
                </form>
                <a href="/">Back</a>
            `);
        });

app.post('/update-status', async (req, res) => {
     
            const{student_id,status}=req.body;
            const result = await db.collection('enrollments').updateOne(
                { student_id: student_id },
                { $set: { status:status,updated_date:new Date() } }
            );
            res.send(`<h2> '✅ Updated!' <a href="/">Back</a>`);
        });

app.get('/active-enrollments', async (req, res) => {
            const enrollments = await db.collection('enrollments').find({ status: 'active' }).toArray();
            let html = '<h2>Active Enrollments</h2>';
            enrollments.forEach(e => {
                html += `<p>${e.student_id} - ${e.name} - ${e.course_name}</p>`;
            });
            res.send(html + '<a href="/">Back</a>');
        });

