const jwt = require("jsonwebtoken");

/**
 * Creates a signed JWT containing the user's ID.
 * Expires in 30 days — user stays logged in.
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload — what we store inside the token
    process.env.JWT_SECRET, // Secret key — NEVER expose this
    { expiresIn: "30d" }, // Expiry — token becomes invalid after this
  );
};

module.exports = generateToken;
