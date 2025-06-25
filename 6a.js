const reactNameComponent = `
<!DOCTYPE html>
<html>
<head>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        function NameForm() {
            const [name, setName] = React.useState('');
            
            const handleChange = (e) => {
                setName(e.target.value);
            };
            
            return (
                <div style={{padding: '20px', fontFamily: 'Arial'}}>
                    <form>
                        <label htmlFor="nameInput">Enter Your Name:</label><br/>
                        <input 
                            type="text" 
                            id="nameInput"
                            value={name} 
                            onChange={handleChange}
                            placeholder="Type your name here..."
                            style={{
                                padding: '10px',
                                fontSize: '16px',
                                margin: '10px 0',
                                width: '300px',
                                border: '2px solid #ddd',
                                borderRadius: '5px'
                            }}
                        />
                    </form>
                    <h1 style={{color: '#007bff', marginTop: '20px'}}>
                        {name || 'Your name will appear here'}
                    </h1>
                </div>
            );
        }
        
        ReactDOM.render(<NameForm />, document.getElementById('root'));
    </script>
</body>
</html>`;