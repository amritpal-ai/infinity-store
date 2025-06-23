require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// PostgreSQL pool setup
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in .env");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Root route
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

// Signup route
app.post('/signup', async (req, res) => {
  const { fullName, eMail, password, cpassword } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO "Customer_Data" (name, email, password, cpassword) VALUES ($1, $2, $3, $4) RETURNING *',
      [fullName, eMail, password, cpassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { credential, password } = req.body;
    const userQuery = `SELECT * FROM "Customer_Data" WHERE email = $1`;
    const userResult = await pool.query(userQuery, [credential]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    if (password !== user.password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful!", user });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Payment route
app.post('/payment', async (req, res) => {
  const { fullName, cardNo, expDate, cvvNo } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO "Payment_Data" (name, card_no, exp_date, cvv) VALUES ($1, $2, $3, $4) RETURNING *',
      [fullName, cardNo, expDate, cvvNo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ error: "Payment submission failed. Please try again." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running locally at http://localhost:${port}`);
  console.log(`🌐 Or check Render deployment at https://infinity-backend-eopv.onrender.com`);
});

