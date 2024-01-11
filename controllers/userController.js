// pull in bcrypt
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const User = require('../models/user');

const generateToken = (userId) => {
  // Create JWT with user id expiration after 2 hours
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '2h' });
};

const createUser = async (userData) => {
  try {
    const { first_name, last_name, username, password } = userData;

    // Hashing password 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      first_name,
      last_name,
      username,
      password: hashedPassword,
    });

    const newUser = await user.save();

    return { user: newUser };
  } catch (error) {
    throw error;
  }
};

const loginUser = async (username, password) => {
  try {
    // Get user from database with username
    const user = await User.findOne({ username });

    if (user) {
      // compare login password with saved password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Generate a JWT 
        const token = generateToken(user._id);

        return { user, token };
      } else {
        throw new Error('Fel lösenord');
      }
    } else {
      throw new Error('Användaren finns inte');
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  loginUser,
};


