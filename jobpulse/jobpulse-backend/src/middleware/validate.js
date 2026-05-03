/**
 * Validates and sanitizes query params for GET /api/jobs
 * Attaches a clean `req.query` so the service never receives garbage
 */
const validateJobsQuery = (req, res, next) => {
  const {
    search,
    location,
    category,
    source,
    jobType,
    experienceLevel,
    isRemote,
    salaryMin,
    salaryMax,
    tags,
    sortBy,
    page,
    limit,
  } = req.query;

  const cleaned = {};

  // ── Text search ────────────────────────────────────────────
  if (search && typeof search === "string") {
    // Strip characters that break MongoDB $text search
    cleaned.search = search
      .trim()
      .replace(/[^\w\s-]/g, "")
      .substring(0, 100);
  }

  // ── String filters ─────────────────────────────────────────
  const VALID_JOB_TYPES = [
    "full-time",
    "part-time",
    "contract",
    "internship",
    "freelance",
  ];
  const VALID_LEVELS = ["entry", "mid", "senior", "lead"];
  const VALID_SOURCES = ["adzuna", "remotive", "remoteok", "jsearch"];
  const VALID_SORTS = [
    "newest",
    "oldest",
    "salary-high",
    "salary-low",
    "relevant",
  ];

  if (location) cleaned.location = String(location).trim().substring(0, 100);
  if (category) cleaned.category = String(category).trim().substring(0, 100);

  if (source && VALID_SOURCES.includes(source)) cleaned.source = source;
  if (jobType && VALID_JOB_TYPES.includes(jobType)) cleaned.jobType = jobType;
  if (experienceLevel && VALID_LEVELS.includes(experienceLevel)) {
    cleaned.experienceLevel = experienceLevel;
  }

  // ── Boolean ────────────────────────────────────────────────
  if (isRemote !== undefined) {
    cleaned.isRemote = isRemote === "true";
  }

  // ── Salary range ───────────────────────────────────────────
  const minVal = parseInt(salaryMin);
  const maxVal = parseInt(salaryMax);
  if (!isNaN(minVal) && minVal >= 0) cleaned.salaryMin = minVal;
  if (!isNaN(maxVal) && maxVal > 0) cleaned.salaryMax = maxVal;

  if (
    cleaned.salaryMin &&
    cleaned.salaryMax &&
    cleaned.salaryMin > cleaned.salaryMax
  ) {
    return res.status(400).json({
      success: false,
      message: "salaryMin cannot be greater than salaryMax",
    });
  }

  // ── Tags — comma-separated string → array ──────────────────
  if (tags) {
    cleaned.tags = String(tags)
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 10); // Max 10 tags
  }

  // ── Sorting ────────────────────────────────────────────────
  cleaned.sortBy = VALID_SORTS.includes(sortBy) ? sortBy : "newest";

  // ── Pagination ─────────────────────────────────────────────
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  cleaned.page = !isNaN(pageNum) && pageNum > 0 ? pageNum : 1;
  cleaned.limit =
    !isNaN(limitNum) && limitNum > 0
      ? Math.min(limitNum, 50) // Hard cap — never return more than 50
      : 20;

  req.cleanQuery = cleaned; // Attach to request for the route to use
  next();
};

module.exports = { validateJobsQuery };
