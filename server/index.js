const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt"); // Import bcrypt
const app = express();
const mysql = require("mysql");

// --- db connection ---
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "user_management",
});

// --- middleware ---
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- Get api ---
app.get("/api/users", (req, res) => {
  const sqlSelect = "SELECT * FROM user";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while fetching data." });
    } else {
      if (result.length > 0) {
        // If users found, return all user details
        res.status(200).json({ message: "Users fetched successfully.", data: result });
      } else {
        // If no users found, return an appropriate message
        res.status(404).json({ message: "No users found." });
      }
    }
  });
});

// --- create user api ---
app.post('/api/insert', async (req, res) => {
    const { firstname, lastname, email, mobileNumber, userRole, password } = req.body;
//   console.log(req.body);
    // Validate the data (simplified validation for demonstration)
    if (!firstname ||!lastname ||!email ||!mobileNumber ||!userRole ||!password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
  
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    // Insert the user into the database
    const sqlInsert = 'INSERT INTO user (firstname, lastname, email, mobile_number, user_role, password) VALUES (?,?,?,?,?,?)';
    db.query(sqlInsert, [firstname, lastname, email, mobileNumber, userRole, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while inserting data.' });
      }
  
      // If the user is inserted successfully, send a success response
      res.status(201).json({ message: 'User inserted successfully.', data: result });
    });
  });

// --- login fetch api ---
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
//   console.log(req.body)
    try {
      const sqlSelect = "SELECT * FROM user WHERE email =?";
      db.query(sqlSelect, [email], async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "An error occurred while fetching data." });
        }
  
        if (result.length === 0) {
          return res.status(404).json({ message: "No user found with this email." });
        }
  
        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
  
        if (!isMatch) {
          return res.status(401).json({ message: "Incorrect password." });
        }
  
        // If the password matches, you can return a success response
        res.status(200).json({ message: "Login successful.", data: user });
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "An error occurred during login." });
    }
  });

// --- Delete user by email api ---
app.delete("/api/delete/:email", (req, res) => {
    const email = req.params.email;
    const sqlDelete = "DELETE FROM user WHERE email =?";
    db.query(sqlDelete, [email], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while deleting data." });
      } else {
        res.status(200).json({ message: "User deleted successfully.", data: result });
      }
    });
  });
  
  // --- update api ---
  app.put("/api/update", (req, res) => {
    const email = req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const mobileNumber = req.body.mobile_number;
    const userRole = req.body.user_role;
    const password= req.body.password;
  // console.log(req.body)
    const sqlUpdate = "UPDATE user SET firstname =?, lastname =?, mobile_number =?, user_role =? WHERE email =?";
    db.query(sqlUpdate, [firstname, lastname, mobileNumber, userRole, email], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error updating user");
      } else {
        res.status(200).json({ message: "User updated successfully.", data: result });
      }
    });
  });


  // --- port ---
app.listen(3001, () => {
  console.log("Server running on port 3001");
});