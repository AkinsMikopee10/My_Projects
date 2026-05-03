const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // JWT is sent in the Authorization header as: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1]; // Extract just the token part
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized — no token provided",
    });
  }

  try {
    // Verify the token — throws if expired or tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id: '664abc...', iat: 1234567890, exp: 1237159890 }

    // Fetch the user and attach to request (minus password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized — user no longer exists",
      });
    }

    next(); // ✅ Token valid — proceed to route handler
  } catch (error) {
    // jwt.verify throws TokenExpiredError or JsonWebTokenError
    const message =
      error.name === "TokenExpiredError"
        ? "Session expired — please log in again"
        : "Not authorized — invalid token";

    return res.status(401).json({ success: false, message });
  }
};

/**
 * Optional: restrict certain routes to admins only
 * Usage: router.delete('/jobs/:id', protect, adminOnly, handler)
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({
    success: false,
    message: "Forbidden — admin access required",
  });
};

/**
 * Like protect, but doesn't reject unauthenticated requests.
 * If a valid token is present, attaches req.user.
 * If no token or invalid, just continues without req.user.
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch {
      // Invalid token — just ignore it, don't block the request
      req.user = null;
    }
  }

  next(); // Always continue
};

module.exports = { protect, adminOnly, optionalAuth };
