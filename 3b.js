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
        <h2>HR Employee Management</h2>
        <form action="/add-employee" method="POST">
            <label>Employee Name:</label>
            <input type="text" name="emp_name" required><br><br>
            
            <label>Email:</label>
            <input type="email" name="email" required><br><br>
            
            <label>Phone:</label>
            <input type="tel" name="phone" required><br><br>
            
            <label>Hire Date:</label>
            <input type="date" name="hire_date" required><br><br>
            
            <label>Job Title:</label>
            <input type="text" name="job_title" required><br><br>
            
            <label>Salary:</label>
            <input type="number" name="salary" min="0" required><br><br>
            
            <input type="submit" value="Add Employee">
        </form>
        <br>
        <a href="/high-salary-employees">View Employees with Salary > 50,000</a>
    `);
});

app.post('/add-employee', async (req, res) => {
    
        const employee = {
            emp_name: req.body.emp_name,
            email: req.body.email,
            phone: req.body.phone,
            hire_date: new Date(req.body.hire_date),
            job_title: req.body.job_title,
            salary: parseInt(req.body.salary)
        };
        
        await db.collection('employees').insertOne(employee);
        res.send(`
            <h2>✅ Employee Added Successfully!</h2>
            <p>Name: ${employee.emp_name}</p>
            <p>Salary: ₹${employee.salary}</p>
            <a href="/">Add Another Employee</a>
        `);
    
});

app.get('/high-salary-employees', async (req, res) => {
    
        const employees = await db.collection('employees').find({ salary: { $gt: 50000 } }).toArray();
        let html = '<h2>Employees with Salary > ₹50,000</h2>';
        
        
            employees.forEach(emp => {
                html += `
                    <div style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
                        <p><strong>Name:</strong> ${emp.emp_name}</p>
                        <p><strong>Email:</strong> ${emp.email}</p>
                        <p><strong>Phone:</strong> ${emp.phone}</p>
                        <p><strong>Job Title:</strong> ${emp.job_title}</p>
                        <p><strong>Salary:</strong> ₹${emp.salary}</p>
                    </div>
                `;
            });
            
            html += '<a href="/hr-employees">Back to Home</a>';
            res.send(html);
});
