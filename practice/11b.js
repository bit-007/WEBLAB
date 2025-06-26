const express=require('express');
const {MongoClient}=require('mongodb');
const app=express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const url="mongodb://127.0.0.1:27017";
let db;

MongoClient.connect(url)
    .then(client=>{
        console.log("Successfully connected to Mongodb");
        db=client.db('college');
        app.listen(3001,()=>{
            console.log("running on localhost:3001");
        });
    })
        .catch(err=>{
            console.err("error",err.message);
        });

app.get('/',(req,res)=>{
    res.send(`
        <h2> Attendance System</h2>
        <form action="/add" method="post">
        Student USN:<input type= "text" name="id"> <br><br>
        Student Name:<input type= "text" name="name"> <br><br>
        Course:<input type= "text" name="course"> <br><br>
        Total Attendance:<input type= "number" name="ta"> <br><br>
        Classes Attended:<input type= "number" name="ca"> <br><br>
        <input type="submit" value="add student"><br><br>
        </form>
        <a href="/low-attendance">All students below 75%</a>


        `);
});


app.post("/add",async(req,res)=>{
    const ta=parseInt(req.body.ta);
    const ca=parseInt(req.body.ca);
    const attendancePercentage = (ca / ta) * 100;
    const students=
    {
        id:req.body.id,
        name:req.body.name,
        course:req.body.course,
        ta:ta,
        ca:ca,
        attendancePercentage:attendancePercentage

    };

    await db.collection('attend').insertOne(students);
    res.send(`
        <h2>added successfully</h2>
        <p>Attendence Percentage:${students.attendancePercentage}</p>`);

});

app.get("/low-attendance",async(req,res)=>{

    const student=await db.collection('attend').find({attendancePercentage:{$lt:75}}).toArray();
    let html=`<h2>Attendance Below 75%</h2>`;
    student.forEach(s=>{
        html+=`
            <div style="border: 1px solid #ccc;padding:10px;margin:10px;">
                <p><strong>Name:</strong>${s.name}</p>
                <p><strong>USN:</strong>${s.id}</p>
                <p><strong>Total Classes:</strong>${s.ta}</p>
                <p><strong>Classes Attended:</strong>${s.ca}</p>
                <p><strong>Percentage:</strong>${s.attendancePercentage}</p>
            </div>
            `;
    });
    html += '<br><a href="/">Back to Home</a>';
        res.send(html);

})