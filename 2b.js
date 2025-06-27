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
        <h2>Student Exam Fee Management</h2>
        <form action="/add-student-fee" method="POST">
            <label>Student Name:</label>
            <input type="text" name="student_name" required><br><br>
            
            <label>USN:</label>
            <input type="text" name="usn" required><br><br>
            
            <label>Semester:</label>
            <input type="number" name="semester" min="1" max="8" required><br><br>
            
            <label>Exam Fee Paid:</label>
            <select name="exam_fee" required>
                
                <option value="true">Yes - Paid</option>
                <option value="false">No - Not Paid</option>
            </select><br><br>
            
            <input type="submit" value="Add Student">
        </form>
        <br>
        <a href="/delete-unpaid">Delete Students Who Haven't Paid Fees</a><br>
        <a href="/all-fee-students">View All Students</a>
    `);
});

app.post('/add-student-fee', async (req, res) => {
    
        const student = {
            student_name: req.body.student_name,
            usn: req.body.usn,
            semester: parseInt(req.body.semester),
            exam_fee_paid: req.body.exam_fee===true
        };
        
        await db.collection('fee_students').insertOne(student);
        res.send(`
            <h2>✅ Student Added Successfully!</h2>
            <p>Name: ${student.student_name}</p>
            <p>Fee Status: ${student.exam_fee_paid ? 'Paid' : 'Not Paid'}</p>
            <a href="/">Add Another Student</a>
        `);
    
});

app.get('/delete-unpaid', async (req, res) => {
    
        const result = await db.collection('fee_students').deleteMany({ exam_fee_paid: 'false' });
        res.send(`
            <h2>🗑️ Deletion Complete</h2>
            <p>Deleted ${result.deletedCount} students who haven't paid exam fees</p>
            <a href="/">Back to Home</a>
        `);
    
});

app.get("/all-fee-students",async(req,res)=>{

    const students=await db.collection('fee_students').find().toArray();
    let html=`<h2> All Students</h2>`;

    students.forEach(s=>{
        html+=
            `
            <div style="border:1px solid #ccc; padding:10px; margin:10px;">
                <p><strong>NAME:</strong> ${s.student_name}</p>
                <p><strong>USN:</strong> ${s.usn}</p>
                <p><strong>SEM:</strong> ${s.semester}</p>
                <p><strong>paid fees:</strong> ${s.exam_fee_paid}</p>
            </div>
            `;
    });

    html+=`<a href="/">BACK HOME </a>`;
    res.send(html);

})
