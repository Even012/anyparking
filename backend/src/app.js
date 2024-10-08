import { 
  getEmailFromAuthorization, 
  login, 
  register, 
  logout,
  createListing,
  getAllListings,
  getLikedListings,
  createBooking,
  updateListing,
  publishListing,
  unpublishListing,
  likeListing,
  unlikeListing,
  reviewListing,
  getAllBookings,
  deleteBooking,
  updateUserDetail,
  getUserDetail,
  getUserVehicle,
  newVehicle,
  deleteUserVehicle
} from './service.js';

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
// Middleware to parse incoming JSON requests
app.use(express.json());

import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'yaml';

const swaggerDocument = yaml.parse(fs.readFileSync('./src/swagger.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

app.get('/listings/liked', authenticateToken, async (req, res) => {
  const email = req.email; 
  try {
    const result = await getLikedListings(email);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
});

app.put('/listings/:listingId/update', authenticateToken, async (req, res) => {
  const listingId = req.params.listingId;
  const body = req.body;
  try {
    const result = await updateListing({listingId, body});
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
})

app.put('/listings/:listingId/publish', authenticateToken, async (req, res) => {
  const listingId = req.params.listingId;
  try {
    const result = await publishListing(listingId);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
})

app.put('/listings/:listingId/unpublish', authenticateToken, async (req, res) => {
  const listingId = req.params.listingId;
  try {
    const result = await unpublishListing(listingId);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
})

app.put('/listings/:listingId/like', authenticateToken, async (req, res) => {
  const listingId = req.params.listingId;
  const email = req.email;
  try {
    const result = await likeListing({listingId, email});
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
})

app.put('/listings/:listingId/unlike', authenticateToken, async (req, res) => {
  const listingId = req.params.listingId;
  const email = req.email;
  try {
    const result = await unlikeListing({listingId, email});
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
})

app.put('/listings/:listingId/review', authenticateToken, async (req, res) => {
  const listingId = req.params.listingId;
  const body = req.body;
  const email = req.email;
  try {
    const result = await reviewListing({listingId, body, email});
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
})

/***************************************************************
                       Booking Functions
***************************************************************/
app.post('/bookings/new', authenticateToken, async (req, res) => {
  try {
    const result = await createBooking({body: req.body, email: req.email});
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
});

app.get('/bookings/all', authenticateToken, async (req, res) => {
  try {
    const result = await getAllBookings();
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
});

app.delete('/bookings/:id', authenticateToken, async (req, res) => {
  const bookingId = req.params.id;
  try {
    const result = await deleteBooking(bookingId);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
});

/***************************************************************
                       UserDetail Functions
***************************************************************/
app.put('/user/details', authenticateToken, async (req, res) => {
  try {
    const result = await updateUserDetail({body: req.body, email: req.email});
    res.status(200).json(result);
  } catch(error) {
    res.status(400).json({error: error.message});
  }
});

app.get('/user/details', authenticateToken, async (req, res) => {
  const email = req.email;
  try {
    const result = await getUserDetail(email);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
});

/***************************************************************
                       userVehicle Functions
***************************************************************/
app.post('/user/vehicles/new', authenticateToken, async (req, res) => {
  try {
    const result = await newVehicle({body: req.body, email: req.email});
    res.status(200).json(result);
  } catch(error) {
    res.status(400).json({error: error.message});
  }
});

app.get('/user/vehicles', authenticateToken, async (req, res) => {
  const email = req.email;

  try {
    const result = await getUserVehicle(email);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
});

app.delete('/user/vehicles/:id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  const email = req.email;

  try {
    const result = await deleteUserVehicle({id, email});
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({error: error.message});
  }
});


const PORT = process.env.PORT || 8888;
// Start the Server
app.listen(PORT, () => {
  console.log('Server is running on port 8888');
});