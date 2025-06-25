const reactEmployeeComponent = `
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
        function Employee() {
            const [employee, setEmployee] = React.useState({
                name: "John Doe",
                address: "123 Main Street, City, State",
                company: "Tech Solutions Inc"
            });
            
            const handleChange = () => {
                setEmployee({
                    name: "Jane Smith",
                    address: "456 Oak Avenue, Town, State",
                    company: "Innovation Corp"
                });
            };
            
            return (
                <div style={{padding: '20px', fontFamily: 'Arial'}}>
                    <h1>Employee Information</h1>
                    <div style={{border: '1px solid #ccc', padding: '15px', margin: '10px 0'}}>
                        <p><strong>Name:</strong> {employee.name}</p>
                        <p><strong>Address:</strong> {employee.address}</p>
                        <p><strong>Company:</strong> {employee.company}</p>
                    </div>
                    <button onClick={handleChange} style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>
                        CHANGE
                    </button>
                </div>
            );
        }
        
        ReactDOM.render(<Employee />, document.getElementById('root'));
    </script>
</body>
</html>`;