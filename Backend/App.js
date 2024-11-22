// Author : Thabang Pila

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();


//--------------------------------------------- SQL Connection -------------------------------------------------------//
// Configure the MySQL connection to the database (secoms3190) in backend.
const mysql = require("mysql2");

// Set up MySQL connection
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "tpsoftdev",     // Your MySQL username
    password: "Cornw@ll7!", // Your MySQL password
    database: "secoms3190",  // The database to connect to
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
    } else {
        console.log("Connected to the MySQL database!");
    }
});


//----------------------------------------------- Multer Config ------------------------------------------------------//
// Set up file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Store files in the "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filenames
    },
});

const upload = multer({ storage: storage });

// Create "uploads" folder if it doesn't exist
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}


//------------------------------------------------- Middleware -------------------------------------------------------//
// Middleware in App.js to handle JSON requests and serve static files.
// Middleware setup
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON requests
app.use(express.json()); // Alternative for JSON parsing
//app.use("/uploads", express.static("uploads")); // Serve uploaded images
app.use("/uploads", express.static("uploads", {
    setHeaders: (res, path) => {
        console.log(`Serving file: ${path}`);  // This will log each file request
    }
}));


//----------------------------------------------- GET Contacts -------------------------------------------------------//
// Endpoint to fetch all contacts from the contact table.
app.get("/contact", (req, res) => {
    try {
        db.query("SELECT * FROM contact", (err, result) => {
            if (err) {
                console.error("Error reading contacts:", err);
                return res.status(500).send({ error: "Error reading contacts" });
            }
            res.status(200).send(result);  // Send the contacts as the response
        });
    } catch (err) {
        console.error("An unexpected error occurred", err);
        res.status(500).send({ error: "An unexpected error occurred" });
    }
});


//----------------------------------------------- Post Contacts ------------------------------------------------------//



//----------------------------------------------- Start Server -------------------------------------------------------//
const PORT = 8081; // Port for the server to listen on
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
