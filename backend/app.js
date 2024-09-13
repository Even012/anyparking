const express = require('express');
const app = express();

// Middleware for parsing form data (urlencoded) and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Mock User Data (Model)
const users = [
  { username: 'admin', password: '12345' }
];

// Function to find user by username (This mimics the "Model" part)
function findUserByUsername(username) {
  return users.find(user => user.username === username);
}

// Controller Function for Login
const login = (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = findUserByUsername(username);

  if (user) {
    if (user.password === password) {
      return res.status(200).send('Login successful!');
    } else {
      return res.status(401).send('Invalid password!');
    }
  } else {
    return res.status(404).send('User not found!');
  }
};

// POST route for handling login request
app.post('/login', login);

// Start the Server
app.listen(8888, () => {
  console.log('Server is running on port 8888');
});