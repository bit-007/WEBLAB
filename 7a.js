const express = require('express');
const path = require('path');
const app = express();

app.get('/branches', (req, res) => {
    res.send(`
        <h1>Engineering College Branches</h1>
        <nav>
            <a href="/branch/cse">Computer Science</a>
            <a href="/branch/ece">Electronics</a>
            <a href="/branch/mechanical">Mechanical</a>
            
        </nav>
        <p>Select a branch to view detailed information.</p>
    `);
});

app.get('/branch/cse', (req, res) => {
    res.send(`
        <div>
            <h1>Computer Science & Engineering</h1>
            <nav>
                <a href="/branches">Home</a>
                <a href="/branch/ece">Electronics</a>
                <a href="/branch/mechanical">Mechanical</a>
                
            </nav>
            <div>
                <h2>Department Overview</h2>
                <p>Computer Science & Engineering focuses on software development, algorithms, data structures, and emerging technologies.</p>
                <h3>Core Subjects:</h3>
                <ul>
                    <li>Programming Languages (C, C++, Java, Python)</li>
                    <li>Data Structures and Algorithms</li>
                    <li>Database Management Systems</li>
                    <li>Web Technologies</li>
                    <li>Machine Learning & AI</li>
                    <li>Computer Networks</li>
                </ul>
                <h3>Career Opportunities:</h3>
                <p>Software Developer, Data Scientist, Web Developer, System Analyst, Cybersecurity Specialist</p>
            </div>
        </div>
    `);
});

app.get('/branch/ece', (req, res) => {
    res.send(`
        <div>
            <h1>Electronics & Communication Engineering</h1>
            <nav>
                <a href="/branches">Home</a>
                <a href="/branch/cse">Computer Science</a>
                <a href="/branch/mechanical">Mechanical</a>
                
            </nav>
            <div>
                <h2>Department Overview</h2>
                <p>Electronics & Communication Engineering deals with electronic devices, circuits, communication equipment, and systems.</p>
                <h3>Core Subjects:</h3>
                <ul>
                    <li>Digital Electronics</li>
                    <li>Communication Systems</li>
                    <li>Signal Processing</li>
                    <li>VLSI Design</li>
                    <li>Embedded Systems</li>
                    <li>Microprocessors</li>
                </ul>
                <h3>Career Opportunities:</h3>
                <p>Electronics Engineer, Communication Engineer, VLSI Designer, Embedded Systems Developer</p>
            </div>
        </div>
    `);
});

app.get('/branch/mechanical', (req, res) => {
    res.send(`
        <div>
            <h1>Mechanical Engineering</h1>
            <nav>
                <a href="/branches">Home</a>
                <a href="/branch/cse">Computer Science</a>
                <a href="/branch/ece">Electronics</a>
                
            </nav>
            <div>
                <h2>Department Overview</h2>
                <p>Mechanical Engineering involves design, manufacturing, and maintenance of mechanical systems and machines.</p>
                <h3>Core Subjects:</h3>
                <ul>
                    <li>Thermodynamics</li>
                    <li>Machine Design</li>
                    <li>Manufacturing Processes</li>
                    <li>Fluid Mechanics</li>
                    <li>Heat Transfer</li>
                    <li>Automobile Engineering</li>
                </ul>
                <h3>Career Opportunities:</h3>
                <p>Design Engineer, Manufacturing Engineer, Automotive Engineer, Project Manager</p>
            </div>
        </div>
    `);
});

app.get('/', (req, res) => {
    res.redirect('/branches');
});

// Start server
app.listen(3000, () => {
    
    console.log('Visit: http://localhost:3000/branches');
});

module.exports = app;