const express = require("express");
const router = express.Router();
const {
  searchJobs,
  getJobById,
  toggleSaveJob,
  applyToJob,
  getSimilarJobs,
  getJobStats,
} = require("../services/jobService");
const { protect } = require("../middleware/auth");
const { validateJobsQuery } = require("../middleware/validate");
const { optionalAuth } = require("../middleware/auth");

// ── GET /api/jobs/stats ──────────────────────────────────────
// Must be ABOVE /:id — otherwise Express matches "stats" as an ID
router.get("/stats", async (req, res, next) => {
  try {
    const stats = await getJobStats();
    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
});

// ── GET /api/jobs ────────────────────────────────────────────
// validateJobsQuery runs first, cleaning all params
// protect is optional — if token present, attach user; if not, continue
router.get("/", validateJobsQuery, optionalAuth, async (req, res, next) => {
  try {
    const data = await searchJobs(req.cleanQuery, req.user?._id);
    res.json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
});

// ── GET /api/jobs/:id ────────────────────────────────────────
router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    const job = await getJobById(req.params.id, req.user?._id);
    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
});

// ── GET /api/jobs/:id/similar ────────────────────────────────
router.get("/:id/similar", async (req, res, next) => {
  try {
    const jobs = await getSimilarJobs(req.params.id);
    res.json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
});

// ── POST /api/jobs/:id/save ──────────────────────────────────
router.post("/:id/save", protect, async (req, res, next) => {
  try {
    const result = await toggleSaveJob(req.params.id, req.user._id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// ── POST /api/jobs/:id/apply ─────────────────────────────────
router.post("/:id/apply", protect, async (req, res, next) => {
  try {
    const application = await applyToJob(req.params.id, req.user._id);
    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
