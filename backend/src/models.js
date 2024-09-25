import mongoose from 'mongoose';


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));


/***************************************************************
                      User Schema
***************************************************************/
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['consumer', 'provider', 'admin'],
      default: 'consumer'
    },
    sessionActive: { type: Boolean, default: false }
  });

// User Model
export const User = mongoose.model('User', userSchema);


/***************************************************************
                      Listing Schema
***************************************************************/
const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    address: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, default: '../../frontend/src/assets/login2.png' },  // Thumbnail URL or path
    metadata: {
        host_email: { type: String },  // You could link this to the User model via email
        availableFrom: { type: Date, required: true }, 
        availableUntil: { type: Date, required: true }, 
        createdAt: { type: Date, default: Date.now },
        public: { type: Boolean, default: true},
        coordinates: {type: Array, default: null}
    }
  });
  
// Listing Model
export const Listing = mongoose.model('Listing', listingSchema);

/***************************************************************
                      Listing Schema
***************************************************************/
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  address: { type: String, required: true},
});

// Listing Model
export const Booking = mongoose.model('Booking', bookingSchema);
