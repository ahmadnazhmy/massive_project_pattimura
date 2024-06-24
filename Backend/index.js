const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3002; 

app.get('/', (req, res) => {
  res.send('Server is running on port ' + PORT);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads folder if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '',
  database: 'holify',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Endpoint to receive reports
app.post('/reports', upload.array('photos', 1), (req, res) => {
  const { location, numberOfPotholes, additionalDetails, status, category, iduser } = req.body;

  // Ensure all required fields are provided
  if (!location || !numberOfPotholes || !additionalDetails || !status || !category || !iduser) {
    return res.status(400).send('Missing required fields');
  }

  let photo;
  if (req.files.length > 0) {
    const file = req.files[0];
    photo = file.filename; // Get the file name
  }

  console.log('Received report data:', req.body); // Debugging
  console.log('Received photo data:', photo); // Debugging

  const query = 'INSERT INTO laporan (iduser, laporan_date, location, description, status, category, photo, numberOfPotholes) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)';
  const values = [iduser, location, additionalDetails, status, category, photo, numberOfPotholes];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting report:', err);
      return res.status(500).send('Error inserting report');
    }
    console.log('Report inserted successfully:', result); // Debugging
    res.status(200).send('Report submitted successfully');
  });
});

// Endpoint to fetch all reports
app.get('/reports', (req, res) => {
  const sql = 'SELECT * FROM laporan';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ message: 'Error retrieving reports' });
    }
    res.status(200).json({ message: 'Get reports success', data: results });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Backend server is running');
});

app.use('/auth', authRoutes);

app.post('/register', async (req, res) => {
  const { name, username, email, telp, password } = req.body;

  if (!name || !username || !email || !telp || !password) {
    return res.status(400).send('Missing fields');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO user (name, username, email, telp, password) VALUES (?, ?, ?, ?, ?)';
    const values = [name, username, email, telp, hashedPassword];

    db.query(sql, values, (err, results) => {
      if (err) {
        return res.status(500).send('Error inserting user');
      } else {
        return res.status(200).send({
          message: 'User added!',
        });
      }
    });
  } catch (error) {
    return res.status(500).send('Error hashing password');
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send('Access denied. Token is required.');
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(403).send('Invalid token.');
    }
    req.iduser = decoded.id;
    next();
  });
};

// Endpoint to handle login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM user WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.iduser }, 'your_secret_key', { expiresIn: '1h' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      username: user.username,
      iduser: user.iduser
    });
  });
});

// Endpoint to update user profile data
app.put('/api/profile', verifyToken, async (req, res) => {
  const iduser = req.iduser;
  const { name, email, username, telp, newPass } = req.body;

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPass, 10);
    
    // Define the SQL query
    const sql = 'UPDATE user SET name = ?, email = ?, username = ?, telp = ?, password = ? WHERE iduser = ?';

    // Log the SQL query and parameters for debugging
    console.log('SQL Query:', sql);
    console.log('Parameters:', [name, email, username, telp, hashedPassword, iduser]);
    
    // Execute the query
    db.query(sql, [name, email, username, telp, hashedPassword, iduser], (err, results) => {
      if (err) {
        console.error('Error updating profile in the database:', err);
        return res.status(500).json({ message: 'Error updating profile in the database' });
      }
      res.status(200).json({ message: 'Profile updated successfully' });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ message: 'Error hashing password' });
  }
});


// Endpoint to fetch user profile data
app.get('/api/profile', (req, res) => {
  const iduser = req.query.iduser; // Assuming iduser is passed as a query parameter

  const sql = 'SELECT name, email, username, telp FROM user WHERE iduser = ?';
  db.query(sql, [iduser], (err, results) => {
    if (err) {
      console.error('Error fetching profile:', err);
      return res.status(500).json({ message: 'Error fetching profile' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const profileData = results[0];
    res.status(200).json({ message: 'Profile data retrieved successfully', data: profileData });
  });
});