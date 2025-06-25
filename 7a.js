app.get('/branches', (req, res) => {
    res.send(`
        <h1>Engineering College Branches</h1>
        <nav style="margin: 20px 0;">
            <a href="/branch/cse" style="margin-right: 20px;">Computer Science</a>
            <a href="/branch/ece" style="margin-right: 20px;">Electronics</a>
            <a href="/branch/mechanical" style="margin-right: 20px;">Mechanical</a>
            <a href="/branch/civil">Civil</a>
        </nav>
        <p>Select a branch to view detailed information.</p>
    `);
});
app.get('/branch/cse', (req, res) => {
    res.send(`
        <div style="background-color: #e3f2fd; font-family: Arial, sans-serif; padding: 30px; color: #1976d2;">
            <h1 style="color: #0d47a1; font-size: 2.5em;">Computer Science & Engineering</h1>
            <nav style="margin: 20px 0;">
                <a href="/branches" style="margin-right: 20px; color: #1976d2;">Home</a>
                <a href="/branch/ece" style="margin-right: 20px; color: #1976d2;">Electronics</a>
                <a href="/branch/mechanical" style="margin-right: 20px; color: #1976d2;">Mechanical</a>
                <a href="/branch/civil" style="color: #1976d2;">Civil</a>
            </nav>
            <div style="background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <h2>Department Overview</h2>
                <p style="font-size: 18px; line-height: 1.6;">Computer Science & Engineering focuses on software development, algorithms, data structures, and emerging technologies.</p>
                <h3>Core Subjects:</h3>
                <ul style="font-size: 16px;">
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
        <div style="background-color: #fff3e0; font-family: Georgia, serif; padding: 30px; color: #e65100;">
            <h1 style="color: #bf360c; font-size: 2.5em;">Electronics & Communication Engineering</h1>
            <nav style="margin: 20px 0;">
                <a href="/branches" style="margin-right: 20px; color: #e65100;">Home</a>
                <a href="/branch/cse" style="margin-right: 20px; color: #e65100;">Computer Science</a>
                <a href="/branch/mechanical" style="margin-right: 20px; color: #e65100;">Mechanical</a>
                <a href="/branch/civil" style="color: #e65100;">Civil</a>
            </nav>
            <div style="background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <h2>Department Overview</h2>
                <p style="font-size: 18px; line-height: 1.6;">Electronics & Communication Engineering deals with electronic devices, circuits, communication equipment, and systems.</p>
                <h3>Core Subjects:</h3>
                <ul style="font-size: 16px;">
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
        <div style="background-color: #f3e5f5; font-family: Times, serif; padding: 30px; color: #4a148c;">
            <h1 style="color: #6a1b9a; font-size: 2.5em;">Mechanical Engineering</h1>
            <nav style="margin: 20px 0;">
                <a href="/branches" style="margin-right: 20px; color: #4a148c;">Home</a>
                <a href="/branch/cse" style="margin-right: 20px; color: #4a148c;">Computer Science</a>
                <a href="/branch/ece" style="margin-right: 20px; color: #4a148c;">Electronics</a>
                <a href="/branch/civil" style="color: #4a148c;">Civil</a>
            </nav>
            <div style="background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <h2>Department Overview</h2>
                <p style="font-size: 18px; line-height: 1.6;">Mechanical Engineering involves design, manufacturing, and maintenance of mechanical systems and machines.</p>
                <h3>Core Subjects:</h3>
                <ul style="font-size: 16px;">
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

app.get('/branch/civil', (req, res) => {
    res.send(`
        <div style="background-color: #e8f5e8; font-family: Verdana, sans-serif; padding: 30px; color: #2e7d32;">
            <h1 style="color: #1b5e20; font-size: 2.5em;">Civil Engineering</h1>
            <nav style="margin: 20px 0;">
                <a href="/branches" style="margin-right: 20px; color: #2e7d32;">Home</a>
                <a href="/branch/cse" style="margin-right: 20px; color: #2e7d32;">Computer Science</a>
                <a href="/branch/ece" style="margin-right: 20px; color: #2e7d32;">Electronics</a>
                <a href="/branch/mechanical" style="color: #2e7d32;">Mechanical</a>
            </nav>
            <div style="background-color: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <h2>Department Overview</h2>
                <p style="font-size: 18px; line-height: 1.6;">Civil Engineering focuses on infrastructure development, construction, and environmental engineering.</p>
                <h3>Core Subjects:</h3>
                <ul style="font-size: 16px;">
                    <li>Structural Engineering</li>
                    <li>Transportation Engineering</li>
                    <li>Environmental Engineering</li>
                    <li>Geotechnical Engineering</li>
                    <li>Water Resources Engineering</li>
                    <li>Construction Management</li>
                </ul>
                <h3>Career Opportunities:</h3>
                <p>Structural Engineer, Construction Manager, Urban Planner, Environmental Consultant</p>
            </div>
        </div>
    `);
});