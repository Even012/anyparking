const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const app = express();
const cors = require('cors');

app.use(cors());
// Middleware for parsing form data (urlencoded) and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// // Mock User Data (Model)
// const users = [
//   { email: 'admin', password: '12345' }
// ];

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));
// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: {
    type: String,
    enum: ['consumer', 'provider', 'admin'],
    default: 'consumer'
  }
});
// User Model
const User = mongoose.model('User', userSchema);


// POST route for handling login request
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Find user by email
  const user = User.find(user => user.email === email);
  if (user) {
    if (user.password === password) {
      return res.status(200).send('Login successfully!');
    } else {
      return res.status(401).send('Invalid password!');
    }
  } else {
    return res.status(404).send('User not found!');
  }
});

// Register API
app.post('/register', async (req, res) => {
  const { name, email, password, passwordConfirmed, phoneNumber, role } = req.body;

  console.log(req.body);
  // Check if all required fields are provided
  if (!name || !email || !password || !passwordConfirmed || !phoneNumber || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate passwords
  if (password !== passwordConfirmed) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the Server
app.listen(8888, () => {
  console.log('Server is running on port 8888');
});