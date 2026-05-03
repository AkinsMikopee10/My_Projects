const Job = require("../models/Job");
const UserJobMeta = require("../models/UserJobMeta");
const Application = require("../models/Application");

/**
 * Build a MongoDB filter object from cleaned query params.
 * This is the core of the search system.
 */
const buildFilter = (query) => {
  const filter = { isActive: true }; // Always only show active jobs

  // ── Full-text search ───────────────────────────────────────
  // Uses the text index we defined on title + company + description
  if (query.search) {
    filter.$text = { $search: query.search };
  }

  // ── Location — case-insensitive partial match ──────────────
  // "new york" matches "New York, NY" and "New York (Remote)"
  if (query.location) {
    filter.location = { $regex: query.location, $options: "i" };
  }

  // ── Exact match filters ────────────────────────────────────
  if (query.category) filter.category = query.category;
  if (query.source) filter.source = query.source;
  if (query.jobType) filter.jobType = query.jobType;
  if (query.experienceLevel) filter.experienceLevel = query.experienceLevel;
  if (query.isRemote !== undefined) filter.isRemote = query.isRemote;

  // ── Salary range ───────────────────────────────────────────
  // Match jobs where salary.min falls within the requested range
  if (query.salaryMin || query.salaryMax) {
    filter["salary.min"] = {};
    if (query.salaryMin) filter["salary.min"].$gte = query.salaryMin;
    if (query.salaryMax) filter["salary.min"].$lte = query.salaryMax;
  }

  // ── Tags — job must have ALL requested tags ────────────────
  // $all means every tag in the array must exist in the job's tags
  if (query.tags?.length) {
    filter.tags = { $all: query.tags };
  }

  return filter;
};

/**
 * Build the sort object from a sortBy string.
 */
const buildSort = (sortBy, hasSearch) => {
  switch (sortBy) {
    case "oldest":
      return { postedAt: 1 };
    case "salary-high":
      return { "salary.max": -1, postedAt: -1 };
    case "salary-low":
      return { "salary.min": 1, postedAt: -1 };
    case "relevant":
      // If there's a text search, sort by text relevance score
      return hasSearch
        ? { score: { $meta: "textScore" }, postedAt: -1 }
        : { postedAt: -1 };
    case "newest":
    default:
      return { postedAt: -1 };
  }
};

/**
 * Main search function — returns paginated jobs + metadata.
 */
const searchJobs = async (query, userId = null) => {
  const { page, limit, sortBy } = query;
  const skip = (page - 1) * limit;

  const filter = buildFilter(query);
  const sort = buildSort(sortBy, !!query.search);

  // If sorting by text relevance, we need to project the score
  const projection =
    sortBy === "relevant" && query.search
      ? { score: { $meta: "textScore" } }
      : {};

  // Run the query and count in parallel — faster than sequential
  const [jobs, total] = await Promise.all([
    Job.find(filter, projection).sort(sort).skip(skip).limit(limit).lean(), // .lean() returns plain JS objects — much faster than Mongoose docs
    Job.countDocuments(filter),
  ]);

  // ── Attach user-specific meta if logged in ─────────────────
  // Tells the frontend: "has this user saved or applied to this job?"
  let metaMap = {};
  if (userId && jobs.length) {
    const jobIds = jobs.map((j) => j._id);

    const [metas, applications] = await Promise.all([
      UserJobMeta.find({ user: userId, job: { $in: jobIds } }).lean(),
      Application.find({ user: userId, job: { $in: jobIds } }).lean(),
    ]);

    // Build lookup maps keyed by jobId string for O(1) access
    const metaById = Object.fromEntries(
      metas.map((m) => [m.job.toString(), m]),
    );
    const appById = Object.fromEntries(
      applications.map((a) => [a.job.toString(), a]),
    );

    metaMap = { metaById, appById };
  }

  // Attach isSaved / isApplied flags to each job
  const enrichedJobs = jobs.map((job) => {
    const id = job._id.toString();
    return {
      ...job,
      isSaved: metaMap.metaById?.[id]?.isSaved || false,
      isApplied: !!metaMap.appById?.[id],
      appStatus: metaMap.appById?.[id]?.status || null,
    };
  });

  return {
    jobs: enrichedJobs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
};

/**
 * Fetch a single job by ID and increment its view counter.
 */
const getJobById = async (jobId, userId = null) => {
  // findByIdAndUpdate with $inc is atomic — no race condition
  const job = await Job.findByIdAndUpdate(
    jobId,
    { $inc: { viewCount: 1 } },
    { new: true },
  ).lean();

  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  // Mark as viewed in UserJobMeta
  if (userId) {
    await UserJobMeta.findOneAndUpdate(
      { user: userId, job: jobId },
      { $set: { isViewed: true, viewedAt: new Date() } },
      { upsert: true, new: true },
    );

    // Attach user-specific flags
    const [meta, application] = await Promise.all([
      UserJobMeta.findOne({ user: userId, job: jobId }).lean(),
      Application.findOne({ user: userId, job: jobId }).lean(),
    ]);

    return {
      ...job,
      isSaved: meta?.isSaved || false,
      isApplied: !!application,
      appStatus: application?.status || null,
    };
  }

  return job;
};

/**
 * Save or unsave a job (toggle).
 */
const toggleSaveJob = async (jobId, userId) => {
  // Verify job exists
  const job = await Job.findById(jobId);
  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  // Get or create the meta record
  const meta = await UserJobMeta.findOneAndUpdate(
    { user: userId, job: jobId },
    {}, // No changes yet — just upsert the document
    { upsert: true, new: true },
  );

  const nowSaved = !meta.isSaved; // Toggle

  await UserJobMeta.findByIdAndUpdate(meta._id, {
    isSaved: nowSaved,
    savedAt: nowSaved ? new Date() : null,
  });

  // Keep the job's saveCount accurate
  await Job.findByIdAndUpdate(jobId, {
    $inc: { saveCount: nowSaved ? 1 : -1 },
  });

  return { isSaved: nowSaved };
};

/**
 * Record that a user applied to a job.
 */
const applyToJob = async (jobId, userId) => {
  const job = await Job.findById(jobId);
  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  // Check if already applied
  const existing = await Application.findOne({ user: userId, job: jobId });
  if (existing) {
    const error = new Error("You have already applied to this job");
    error.statusCode = 400;
    throw error;
  }

  const application = await Application.create({
    user: userId,
    job: jobId,
    status: "applied",
  });

  // Increment job apply counter
  await Job.findByIdAndUpdate(jobId, { $inc: { applyCount: 1 } });

  return application;
};

/**
 * Fetch jobs with similar tags or category — used for "You might also like"
 */
const getSimilarJobs = async (jobId, limit = 5) => {
  const job = await Job.findById(jobId).lean();
  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  const similar = await Job.find({
    _id: { $ne: jobId }, // Exclude the current job
    isActive: true,
    $or: [
      { tags: { $in: job.tags } }, // Same tags
      { category: job.category }, // Same category
    ],
  })
    .sort({ postedAt: -1 })
    .limit(limit)
    .lean();

  return similar;
};

/**
 * Aggregate stats — category counts, source counts, total active jobs.
 * Used for sidebar filters and dashboard widgets.
 */
const getJobStats = async () => {
  const [categoryStats, sourceStats, totalActive] = await Promise.all([
    // Count jobs per category
    Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]),

    // Count jobs per source
    Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$source", count: { $sum: 1 } } },
    ]),

    Job.countDocuments({ isActive: true }),
  ]);

  return {
    totalActive,
    byCategory: categoryStats.map((s) => ({ category: s._id, count: s.count })),
    bySource: sourceStats.map((s) => ({ source: s._id, count: s.count })),
  };
};

module.exports = {
  searchJobs,
  getJobById,
  toggleSaveJob,
  applyToJob,
  getSimilarJobs,
  getJobStats,
};
