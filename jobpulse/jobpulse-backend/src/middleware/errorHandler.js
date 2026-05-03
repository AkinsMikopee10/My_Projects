/**
 * Global error handling middleware.
 * Express recognizes it as error middleware because it has 4 params: (err, req, res, next)
 * Usage in routes: next(error) — Express forwards it here automatically
 */
const errorHandler = (err, req, res, next) => {
  console.error("FULL ERROR:", err);
  // Log full error in development, minimal in production
  if (process.env.NODE_ENV === "development") {
    console.error("❌", err.stack);
  } else {
    console.error("❌", err.message);
  }

  // Mongoose duplicate key error (e.g. email already registered)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]; // Which field caused the duplicate
    return res.status(400).json({
      success: false,
      message: `${field} is already registered`,
    });
  }

  // Mongoose validation error (e.g. required field missing)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  // Mongoose bad ObjectId (e.g. /api/jobs/not-a-real-id)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  // Default — use the error's own status code or 500
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
