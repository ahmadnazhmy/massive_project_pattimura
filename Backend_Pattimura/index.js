const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // Sesuaikan dengan host MySQL Anda
  user: 'root',      // Sesuaikan dengan user MySQL Anda
  password: '',  // Sesuaikan dengan password MySQL Anda
  database: 'holify' // Sesuaikan dengan nama database Anda
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Create uploads folder if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

// Initialize Multer upload middleware
const upload = multer({ storage: storage });
// Function to convert image to HEX
const convertImageToHex = (imageUrl) => {
  return new Promise((resolve, reject) => {
    fs.readFile(imageUrl, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const hexImage = data.toString('hex');
        resolve(hexImage);
      }
    });
  });
};

// Function to convert HEX back to image
const convertHexToImage = (hexImage, outputPath) => {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(hexImage, 'hex');
    fs.writeFile(outputPath, buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(outputPath);
      }
    });
  });
};

// Upload endpoint for single image
app.post('/uploadImage', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }

  try {
    const hexImage = await convertImageToHex(req.file.path);
    res.send({ hexImage });
  } catch (error) {
    console.error('Error converting image to hex:', error);
    res.status(500).send('Error converting image to hex');
  }
});

// Endpoint to manage reports
app.post('/reports', upload.array('photos', 1), async (req, res) => {
  const { iduser, location, additionalDetails, status, category } = req.body;

  if (!iduser || !location || !additionalDetails || !status || !category) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const file = req.files[0];
    const photo = file.filename;

    const hexImage = await convertImageToHex(file.path);

    const url = 'https://pothole-detection.1iev9smru8jl.us-south.codeengine.appdomain.cloud/predict';
    const response = await axios.post(url, { image_hex: hexImage }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const numberOfPotholes = response.data.count_pothole;

    const query = 'INSERT INTO laporan (iduser, laporan_date, location, description, status, category, photo, numberOfPotholes) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)';
    const values = [iduser, location, additionalDetails, status, category, photo, numberOfPotholes];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error inserting report:', err);
        return res.status(500).send('Error inserting report');
      }
      res.status(200).json({ message: 'Report submitted successfully', count_pothole: numberOfPotholes });
    });
  } catch (error) {
    console.error('Error processing report:', error);
    res.status(500).send('Error processing report');
  }
});

// Endpoint to fetch all reports
app.get('/reports', (req, res) => {
  const sql = `
     SELECT 
          l.idlaporan, 
          l.laporan_date, 
          l.location, 
          l.description, 
          l.status,
          l.category,
          l.numberOfPotholes,
          l.photo,
          u.name AS nama_pengguna, 
          u.email AS email_pengguna
      FROM 
          laporan l
      JOIN 
          user u 
      ON 
          l.iduser = u.iduser
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ message: 'Error retrieving reports' });
    }
    res.status(200).json({ message: 'Get reports success', data: results });
  });
});

// Endpoint to handle user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const sql = 'SELECT * FROM user WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      iduser: user.iduser,
      username: user.username,
    });
  });
});

// Endpoint to update report status
app.put('/reports/:idlaporan/status', async (req, res) => {
  const { idlaporan } = req.params;
  let { status } = req.body;

  // Validate status against enum ('Menunggu', 'Diproses', 'Selesai')
  if (!['Menunggu', 'Diproses', 'Selesai'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const sql = 'UPDATE laporan SET status = ? WHERE idlaporan = ?';
    const result = await db.query(sql, [status, idlaporan]);

    if (result && result.affectedRows === 1) {
      res.status(200).json({ message: 'Report status updated successfully' });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    console.error('Error updating report status:', error);
    res.status(500).json({ message: 'Failed to update report status' });
  }
});

// Endpoint to handle user registration
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
        console.error('Error inserting user:', err);
        return res.status(500).send('Error inserting user');
      } else {
        return res.status(200).send({
          message: 'User added successfully!',
        });
      }
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    return res.status(500).send('Error hashing password');
  }
});

// Endpoint to update user profile
app.put('/api/profile', async (req, res) => {
  const { iduser, name, email, username, telp, newPassword } = req.body;

  // Ensure all required fields are provided
  if (!iduser || !name || !email || !username || !telp || !newPassword) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Hash the new password if provided
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user profile in the database
    const sql = 'UPDATE user SET name = ?, email = ?, username = ?, telp = ?, password = ? WHERE iduser = ?';
    db.query(sql, [name, email, username, telp, hashedPassword, iduser], (err, results) => {
      if (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ message: 'Failed to update profile' });
      }
      res.status(200).json({ message: 'Profile updated successfully' });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Endpoint to fetch user profile
app.get('/api/profile', (req, res) => {
  const iduser = req.query.iduser;

  const sql = 'SELECT name, email, username, telp FROM user WHERE iduser = ?';
  db.query(sql, [iduser], (err, results) => {
    if (err) {
      console.error('Error fetching profile:', err);
      return res.status(500).json({ message: 'Failed to fetch profile' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const profileData = results[0];
    res.status(200).json({ message: 'Profile data retrieved successfully', data: profileData });
  });
});

// Endpoint to fetch all users
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM user';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Failed to fetch users' });
    }
    res.status(200).json({ message: 'Users retrieved successfully', data: results });
  });
});

// Endpoint to delete a user
app.delete('/user/:iduser', (req, res) => {
  const iduser = req.params.iduser;

  const sql = 'DELETE FROM user WHERE iduser = ?';

  db.query(sql, [iduser], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Failed to delete user' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
});

// Default route
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
