const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updatePreferences,
} = require("../services/authService");
const { protect } = require("../middleware/auth");

// ── POST /api/auth/register ──────────────────────────────────
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const data = await registerUser({ name, email, password });

    res.status(201).json({ success: true, ...data });
  } catch (error) {
    next(error); // Forward to errorHandler middleware
  }
});

// ── POST /api/auth/login ─────────────────────────────────────
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const data = await loginUser({ email, password });

    res.status(200).json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
});

// ── GET /api/auth/me ─────────────────────────────────────────
// protect middleware runs first — attaches req.user if token is valid
router.get("/me", protect, async (req, res, next) => {
  try {
    const user = await getMe(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// ── PUT /api/auth/preferences ────────────────────────────────
router.put("/preferences", protect, async (req, res, next) => {
  try {
    const user = await updatePreferences(req.user._id, req.body.preferences);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// ── POST /api/auth/logout ────────────────────────────────────
// JWTs are stateless — "logout" just means the client deletes the token.
// This endpoint exists so the frontend has a clean place to call.
router.post("/logout", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;
