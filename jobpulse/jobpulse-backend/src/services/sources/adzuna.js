const axios = require("axios");

const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;
const BASE_URL = "https://api.adzuna.com/v1/api/jobs";

/**
 * Normalize a raw Adzuna job into our Job schema shape
 */
const normalizeJob = (raw) => ({
  externalId: `adzuna_${raw.id}`,
  source: "adzuna",

  title: raw.title,
  company: raw.company?.display_name || "Unknown Company",
  location: raw.location?.display_name || "Remote",
  isRemote:
    raw.title?.toLowerCase().includes("remote") ||
    raw.location?.display_name?.toLowerCase().includes("remote"),

  description: raw.description,
  descriptionHtml: null, // Adzuna gives plain text

  salary: {
    min: raw.salary_min || null,
    max: raw.salary_max || null,
    currency: "USD",
    period: "yearly",
  },

  category: raw.category?.label || "General",
  tags: extractTags(raw.title, raw.description),
  jobType: detectJobType(raw.contract_time),
  experienceLevel: detectExperienceLevel(raw.title),

  applyUrl: raw.redirect_url,
  companyLogo: null,
  postedAt: new Date(raw.created),
});

/**
 * Pull tech keywords out of title + description to use as tags
 */
const extractTags = (title = "", description = "") => {
  const text = `${title} ${description}`.toLowerCase();

  const techKeywords = [
    "javascript",
    "typescript",
    "python",
    "java",
    "react",
    "node.js",
    "aws",
    "docker",
    "kubernetes",
    "sql",
    "mongodb",
    "graphql",
    "vue",
    "angular",
    "next.js",
    "django",
    "flask",
    "golang",
  ];

  return techKeywords.filter((keyword) => text.includes(keyword));
};

const detectJobType = (contractTime) => {
  if (!contractTime) return null;
  if (contractTime === "full_time") return "full-time";
  if (contractTime === "part_time") return "part-time";
  return null;
};

const detectExperienceLevel = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("senior") || t.includes("sr.")) return "senior";
  if (t.includes("lead") || t.includes("principal")) return "lead";
  if (t.includes("junior") || t.includes("jr.") || t.includes("entry"))
    return "entry";
  return "mid";
};

/**
 * Fetch one page of jobs from Adzuna
 * category: e.g. 'it-jobs', 'engineering-jobs'
 * page: 1-based page number
 */
const fetchAdzunaJobs = async (category = "it-jobs", page = 1) => {
  if (!APP_ID || !APP_KEY) {
    console.warn("⚠️  Adzuna API keys missing — skipping");
    return [];
  }

  try {
    const response = await axios.get(`${BASE_URL}/us/search/${page}`, {
      params: {
        app_id: APP_ID,
        app_key: APP_KEY,
        results_per_page: 50, // Max allowed
        category,
        "content-type": "application/json",
      },
      timeout: 10000, // 10 second timeout
    });

    const jobs = response.data.results || [];
    console.log(`  📥 Adzuna [${category}] page ${page}: ${jobs.length} jobs`);

    return jobs.map(normalizeJob);
  } catch (error) {
    // Don't crash the whole aggregator for one source failing
    console.error(`  ❌ Adzuna error: ${error.message}`);
    return [];
  }
};

module.exports = { fetchAdzunaJobs };
