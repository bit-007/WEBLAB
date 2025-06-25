const cssBoxModelHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>CSS Box Model Exercise</title>
    <style>
        /* Question 11a Requirements */
        h1 {
            border: 1px solid red;
            background-color: #D18C1D;
            padding: 10px;
        }
        
        li {
            margin: 15px;
            background-color: #C0A9DB;
        }
        
        p {
            width: 600px;
            height: 400px;
            border: 2px dotted black;
            background-color: #D1D631;
        }
        
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
    </style>
</head>
<body>
    <h1>CSS Box Model Demonstration</h1>
    
    <p>This paragraph demonstrates the CSS Box Model with the specified requirements: 
    600px width, 400px height, 2px dotted black border, and #D1D631 background color.
    The box model consists of content, padding, border, and margin components.</p>
    
    <h1>Another H1 Element</h1>
    
    <ul>
        <li>First list item with 15px margin and #C0A9DB background</li>
        <li>Second list item demonstrating consistent styling</li>
        <li>Third list item showing margin spacing effect</li>
    </ul>
    
    <h1>Box Model Components Explained</h1>
</body>
</html>`;

