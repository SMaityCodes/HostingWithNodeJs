const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route for handling calculations
app.post("/calculate", (req, res) => {
    const { num1, num2, operator } = req.body;

    let result;
    if (isNaN(num1) || isNaN(num2)) {
        return res.json({ error: "Invalid input" });
    }

    switch (operator) {
        case "+":
            result = num1 + num2;
            break;
        case "-":
            result = num1 - num2;
            break;
        case "*":
            result = num1 * num2;
            break;
        case "/":
            result = num2 !== 0 ? num1 / num2 : "Cannot divide by zero";
            break;
        default:
            return res.json({ error: "Invalid operation" });
    }

    res.json({ result });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

