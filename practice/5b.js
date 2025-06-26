const express = require('express');
const {MongoClient} = require('mongodb');
const app=express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const url = "mongodb://127.0.0.1:27017";
let db;

MongoClient.connect(url)
    .then(client=>{
        console.log("connected to mongo server");
        db=client.db('college');
        app.listen(3001,()=>{
            console.log("running on 3001");
        });

    })
        .catch(err=>{
            console.err("error",err.message);
        });

app.get('/',(req,res)=>{
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
            <input type="text" name="grade" required><br><br>

            <input type="submit" value="Add Student">
        </form>
            <a href="/all-student-grades">View All Student Records</a>
            <br><br>

        <form action="/update-grade" method="POST">
            <h3>Update Student Grade</h3>
            <label>Student Name:</label>
            <input type="text" name="name" required><br><br>
            
            <label>New Grade:</label>
            <input type="text" name="grade" required><br><br>
            <input type="submit" value="Update Grade">
        </form>

     `);
});

app.post("/add-student-grade",async(req,res)=>{

    const students={
        name:req.body.name,
        usn:req.body.usn,
        department:req.body.department,
        grade:req.body.grade,
        created_date:new Date()

    };

    await db.collection('sg').insertOne(students);

    res.send(`<h2> student record added successfully</h2>
        <p>Student: ${students.name}</p>
        <p>Grade: ${students.grade}</p>
        <a href="/">Back to Home</a>
        `);
    
});

app.post('/update-grade',async(req,res)=>{

    const{name,grade}=req.body;
    const result=await db.collection('sg').updateOne(
        {name:name},
        {$set:{grade:grade,updated_date:new Date()}}
    );
});

app.get('/all-student-grades',async(req,res)=>{

    const students= await db.collection('sg').find().toArray();
    let html=`<h2>all students</h2>`;

    students.forEach(s=>{

        html+= `
        <div style="border: 1px solid #ccc;padding:10px;margin:10px;">
            <p><strong>Name:</strong> ${s.name}</p>
            <p><strong>USN:</strong> ${s.usn}</p>
            <p><strong>Department:</strong> ${s.department}</p>
            <p><strong>Grade:</strong> ${s.grade}</p>
        </div>
        `;
        
    });

    html += '<a href="/">Back to Home</a>';
        res.send(html);
})