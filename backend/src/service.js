import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AsyncLock from 'async-lock';

const lock = new AsyncLock();
const JWT_SECRET = 'giraffegiraffebeetroot';
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));


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
                      User Schema
***************************************************************/
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: {
    type: String,
    enum: ['consumer', 'provider', 'admin'],
    default: 'consumer'
  },
  sessionActive: { type: Boolean, default: false }
});
// User Model
const User = mongoose.model('User', userSchema);

/***************************************************************
                       Auth Functions
***************************************************************/

export const getEmailFromAuthorization = async (authorization) => {
  try {
    const token = authorization.replace('Bearer ', '');
    const { email } = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid Token');
    }
    return email;
  } catch {
    throw new Error('Invalid Token');
  }
};
  
export const login = (email, password) => 
  resourceLock('resourceLock', async (resolve, reject) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return reject(new Error('User not found! Please provide a valid email!'));
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
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
  const { name, email, password, passwordConfirmed, phoneNumber, role } = props;

  return resourceLock('resourceLock', async (resolve, reject) => {
    if (!name || !email || !password || !passwordConfirmed || !phoneNumber || !role) {
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
        name,
        email,
        password: hashedPassword,
        phoneNumber,
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
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { status: 404, message: 'User not found' };
    }
    if (user.sessionActive == false) {
      return { status: 400, message: 'Please Login first!' };
    }
    user.sessionActive = false;
    await user.save(); // Save the updated user status

    return { status: 200, message: 'Logged out successfully' };
  } catch (error) {
    return { status: 500, message: 'Server error' };
  }
};