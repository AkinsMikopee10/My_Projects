const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/**
 * Register a new user.
 * Returns the new user object + a JWT.
 */
const registerUser = async ({ name, email, password }) => {
  // 1. Check if email already taken
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 400;
    throw error;
  }

  // 2. Create user — password hashing happens automatically
  //    via the pre-save hook we wrote in User.js (Day 2)
  const user = await User.create({ name, email, password });

  // 3. Generate token
  const token = generateToken(user._id);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
    token,
  };
};

/**
 * Log in an existing user.
 * Returns the user object + a fresh JWT.
 */
const loginUser = async ({ email, password }) => {
  // 1. Find user — must explicitly request password (select: false in schema)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    // Deliberately vague — don't reveal whether email exists
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // 2. Compare entered password against stored hash
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // 3. Update last login timestamp
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false }); // Skip full validation on timestamp update

  // 4. Generate token
  const token = generateToken(user._id);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      lastLoginAt: user.lastLoginAt,
    },
    token,
  };
};

/**
 * Get the currently logged-in user's profile.
 * req.user is already attached by the protect middleware.
 */
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

/**
 * Update preferences (job roles, locations, salary etc.)
 */
const updatePreferences = async (userId, preferences) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { preferences } },
    { new: true, runValidators: true },
  );
  return user;
};

module.exports = { registerUser, loginUser, getMe, updatePreferences };
