import { User, Listing } from './models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AsyncLock from 'async-lock';

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
export const createListing = async ({ title, address, price, thumbnail, metadata }) => {
  
  return resourceLock('resourceLock', async (resolve, reject) => {
    try {  
      // Create a new listing
      const newListing = new Listing({
        title,
        address,
        price, 
        thumbnail,
        metadata
      });
      // Save the listing
      await newListing.save();
      return resolve({message: 'Listing created!'});
    } catch (error) {
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
