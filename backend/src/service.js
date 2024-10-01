import { User, Listing, Booking, UserDetail, UserVehicle } from './models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AsyncLock from 'async-lock';
import mongoose from 'mongoose';

const lock = new AsyncLock();
const JWT_SECRET = 'giraffegiraffebeetroot';


/***************************************************************
                       Helper Functions
***************************************************************/

export const resourceLock = (key, callback) =>
  new Promise((resolve, reject) => {
    lock.acquire(key, () => {
      callback(resolve, reject);
    }, (err) => {
      if (err) {
        reject(new Error('Failed to acquire lock'));
      }
    });
  });



/***************************************************************
                       Auth Functions
***************************************************************/

export const getEmailFromAuthorization = async (authorization) => {
  try {
    const token = authorization.replace('Bearer ', '');
    const { email } = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email });
    if (!user || user.sessionActive === false) {
      throw new Error('Invalid Token');
    }
    return email;
  } catch {
    throw new Error('Invalid Token');
  }
};
  
export const login = (email, password, role) => 
  resourceLock('resourceLock', async (resolve, reject) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return reject(new Error('User not found! Please provide a valid email!'));
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (user.role !== role) {
        return reject(new Error('Invalid role!'));
      } else if (isPasswordValid) {
        user.sessionActive = true;
        await user.save();
        const token = jwt.sign({ email }, JWT_SECRET, { algorithm: 'HS256' });
        return resolve({ token, message: 'Login successfully!' });
      } else {
        return reject(new Error('Invalid password!'));
      }
    } catch (err) {
      return reject(new Error("Server error!"));
    }
  });
  

export const register = async (props) => {
  const { email, password, passwordConfirmed, role } = props;

  return resourceLock('resourceLock', async (resolve, reject) => {
    if (!email || !password || !passwordConfirmed || !role) {
      return reject(new Error('All fields are required'));
    } else if (password !== passwordConfirmed) {
      return reject(new Error('Passwords do not match'));
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return reject(new Error('User already exists' ))
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        password: hashedPassword,
        role,
        sessionActive: true
      });
      await newUser.save();
      const token = jwt.sign({ email }, JWT_SECRET, { algorithm: 'HS256' });
      return resolve({ token, message: 'Register successfully!' });
    } catch (err) {
      return reject(new Error("Server error!"));
    }
  })
}

export const logout = async (email) => {
  return resourceLock('resourceLock', async (resolve, reject) => {
    try {
      const user = await User.findOne({ email });

      user.sessionActive = false;
      await user.save(); // Save the updated user status
  
      return resolve({message: 'Logged out successfully'});
    } catch (error) {
      return reject(new Error('Server error' ));
    }
  })
};

/***************************************************************
                       Listing Functions
***************************************************************/
export const createListing = async ({ title, address, pricePerHour, pricePerDay, thumbnail, metadata }) => {
  
  return resourceLock('resourceLock', async (resolve, reject) => {
    try {  
      // Create a new listing
      const newListing = new Listing({
        title,
        address,
        pricePerHour, 
        pricePerDay, 
        thumbnail,
        metadata
      });
      // Save the listing
      await newListing.save();
      return resolve({message: 'Listing created!'});
    } catch (error) {
      console.log(error);
      return reject(new Error('Server error' ));
    }
  })
};

export const getAllListings = async () => {
  
  return resourceLock('resourceLock', async (resolve, reject) => {
    try {  
      const listings = await Listing.find();
      console.log(listings);
      return resolve(listings);
    } catch (error) {
      console.log(error);
      return reject(new Error('Server error' ));
    }
  })
};

/***************************************************************
                       Booking Functions
***************************************************************/
export const createBooking = async ({body, email}) => {
  const { name, startTime, endTime, listingId } = body;
  
  return resourceLock('resourceLock', async (resolve, reject) => {
    try {  
      const conflictingBookings = await Booking.find({
        listingId: listingId,
        $or: [
          // New booking starts within an existing booking
          {
            startTime: { $lt: startTime }, // Existing booking starts before the new booking ends
            endTime: { $gt: startTime }, // Existing booking ends after the new booking starts
          },
          // Existing booking starts within the new booking range
          {
            startTime: { $lt: endTime }, // Existing booking starts before the new booking ends
            endTime: { $gte: endTime },  // Existing booking ends after or at the new booking end
          },
        ]
      });

      if (conflictingBookings.length > 0) {
        return reject(new Error('This listing is not available for the requested time.' ));
      }
  
      // Create a new booking
      const newBooking = new Booking({
        name,
        email,
        startTime,
        endTime,
        listingId
      });
      // Save the booking
      await newBooking.save();
      return resolve({message: 'Listing created!'});
    } catch (error) {
      console.log(error);
      return reject(new Error('Server error' ));
    }
  })
};

export const getAllBookings = async () => {
  
  return resourceLock('resourceLock', async (resolve, reject) => {
    try {  
      const bookings = await Booking.find();
      return resolve(bookings);
    } catch (error) {
      console.log(error);
      return reject(new Error('Server error' ));
    }
  })
};

export const deleteBooking = async (bookingId) => {

  return resourceLock('resourceLock', async (resolve, reject) => {
    try {  
      const objectId = new mongoose.Types.ObjectId(bookingId);
      await Booking.deleteOne({ _id: objectId }); 
      return resolve("Booking deleted");
    } catch (error) {
      console.log(error);
      return reject(new Error('Server error' ));
    }
  })
};


/***************************************************************
                      UserDetail Functions
***************************************************************/
export const updateUserDetail = async ({body, email }) => {

  return resourceLock('resourceLock', async (resolve, reject) => {
    try {  
      let userDetail = await UserDetail.findOne({ email });
      if (userDetail) {
        // If user detail exists, update it
        userDetail = await UserDetail.findOneAndUpdate({ email }, body, {
          new: true, // Return the updated document
          runValidators: true, // Validate against the schema
        });
      } else {
        // If user detail doesn't exist, create a new entry
        userDetail = new UserDetail({
          email,
          ...body, // Spread the updated fields here
        });
        await userDetail.save();
      }
      return resolve({message: 'Listing created!'});
    } catch (error) {
      console.log(error);
      return reject(new Error('Server error' ));
    }
  })
};

export const getUserDetail = async (email) => {
  
  return resourceLock('resourceLock', async (resolve, reject) => {
    try {  
      const userDetail = await UserDetail.findOne({ email });
      return resolve(userDetail);
    } catch (error) {
      console.log(error);
      return reject(new Error('Server error' ));
    }
  })
};

/***************************************************************
                      UserVehicle Functions
***************************************************************/
export const getUserVehicle = async (email) => {
  
  return resourceLock('resourceLock', async (resolve, reject) => {
    try {  
      const vehicles = await UserVehicle.find({ email });
      return resolve(vehicles);
    } catch (error) {
      console.log(error);
      return reject(new Error('Server error' ));
    }
  })
};

export const newVehicle = async ({body, email}) => {
  const { make, model, year, licensePlate, color } = body;
  return resourceLock('resourceLock', async (resolve, reject) => {
    try {  
      const newVehicle = new UserVehicle({
        email,
        make,
        model,
        year,
        licensePlate,
        color
      });

      await newVehicle.save();
      return resolve("New vehicle created!");
    } catch (error) {
      console.log(error);
      return reject(new Error('Server error' ));
    }
  })
};

export const deleteUserVehicle = async ({id, email}) => {
  
  return resourceLock('resourceLock', async (resolve, reject) => {
    try {  
      const vehicle = await UserVehicle.findOne({ _id: id, email });

      if (!vehicle) {
        return reject(new Error('Vehicle not found or does not belong to the user!'));
      }
      await UserVehicle.deleteOne({ _id: id });
      return resolve('Vehicle deleted!');
    } catch (error) {
      console.log(error);
      return reject(new Error('Server error' ));
    }
  })
};