// Logger Middleware
const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip}`);
    next();
};

// Visitor Counter Middleware
let visitorCount = 0;
const visitorCounter = (req, res, next) => {
    visitorCount++;
    req.visitorCount = visitorCount;
    console.log(`Visitor #${visitorCount} accessed the website`);
    next();
};

// Apply middleware
app.use(logger);
app.use(visitorCounter);

app.get('/middleware-demo', (req, res) => {
    res.send(`
        <h2>Custom Middleware Demo</h2>
        <div style="border: 1px solid #ccc; padding: 20px; margin: 20px; border-radius: 5px;">
            <h3>Logger Middleware</h3>
            <p>✅ Every request is being logged to the console with timestamp, method, URL, and IP address.</p>
            
            <h3>Visitor Counter Middleware</h3>
            <p>You are visitor number: <strong style="color: blue; font-size: 24px;">${req.visitorCount}</strong></p>
            
            <p style="color: green;">Check your console to see the logged information!</p>
        </div>
        <br>
        <a href="/startup-ideas">Go to Startup Ideas Portal</a>
    `);
});