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
    pricePerHour: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    thumbnail: { type: String, default: "https://gumtreeau-res.cloudinary.com/image/private/t_$_s-l400/gumtree/9f6bfdcc-274f-4b4f-8ba2-b6c909d59171.jpg" },  // Thumbnail URL or path
    metadata: {
        host_email: { type: String },  // You could link this to the User model via email
        availableFrom: { type: Date, required: true }, 
        availableUntil: { type: Date, required: true }, 
        createdAt: { type: Date, default: Date.now },
        public: { type: Boolean, default: true},
        coordinates: {type: Array, default: null}
    },
  });
  
// Listing Model
export const Listing = mongoose.model('Listing', listingSchema);

/***************************************************************
                      Booking Schema
***************************************************************/
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  listingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Listing', 
    required: true 
  },
});

// Booking Model
export const Booking = mongoose.model('Booking', bookingSchema);

/***************************************************************
                      UserDetail Schema
***************************************************************/
const userDetailSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String},
  phone: { type: String},
  address: { type: String},
  cardNumber: { type: String},  // Store only last 4 digits for security
  expiryDate: { type: String},  // Format: MM/YY
  cvv: { type: String}  // Store only encrypted or hashed value for security
});

export const UserDetail = mongoose.model('UserDetail', userDetailSchema);

/***************************************************************
                      UserDetail Schema
***************************************************************/
const userVehicleSchema = new mongoose.Schema({
  email: { type: String, required: true },
  make: { type: String, required: true },   // e.g., Toyota
  model: { type: String, required: true },  // e.g., Camry
  year: { type: String, required: true },   // e.g., 2020
  licensePlate: { type: String, required: true }, // e.g., XYZ123
  color: { type: String, required: true },  // e.g., Black
}, { timestamps: true });

export const UserVehicle = mongoose.model('UserVehicle', userVehicleSchema);
