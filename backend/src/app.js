import { 
  getEmailFromAuthorization, 
  login, 
  register, 
  logout,
  createListing,
  getAllListings
} from './service.js';

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
// Middleware to parse incoming JSON requests
app.use(express.json());


/***************************************************************
                       User Auth Functions
***************************************************************/

const authenticateToken = async (req, res, next) => {
  try {
    const email = await getEmailFromAuthorization(req.header('Authorization'));
    if (!email) {
      return res.status(401).json({ message: 'Token not provided' });
    }
    req.email = email;
    next(); 
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


app.post('/user/auth/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const result = await login(email, password, role);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

app.post('/user/auth/register', async (req, res) => {
  const props = req.body;
  try {
    const result = await register(props);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

app.post('/user/auth/logout', authenticateToken, async (req, res) => {
  try {
    const result = await logout(req.email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});


/***************************************************************
                       Listing Functions
***************************************************************/
app.post('/listings/new', authenticateToken, async (req, res) => {
  try {
    const result = await createListing(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

app.get('/listings/all', async (req, res) => {
  try {
    const result = await getAllListings();
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
});

// Start the Server
app.listen(8888, () => {
  console.log('Server is running on port 8888');
});