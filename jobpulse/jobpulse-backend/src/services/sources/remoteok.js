const axios = require("axios");

const BASE_URL = "https://remoteok.com/api";

const normalizeJob = (raw) => ({
  externalId: `remoteok_${raw.id}`,
  source: "remoteok",

  title: raw.position,
  company: raw.company,
  location: "Remote",
  isRemote: true,

  description: raw.description || raw.tags?.join(", ") || "",
  descriptionHtml: raw.description || null,

  salary: {
    min: raw.salary_min || null,
    max: raw.salary_max || null,
    currency: "USD",
    period: "yearly",
  },

  category: raw.tags?.[0] || "Tech",
  tags: raw.tags || [],
  jobType: "full-time",
  experienceLevel: detectExperienceLevel(raw.position),

  applyUrl: raw.apply_url || raw.url,
  companyLogo: raw.company_logo || null,
  postedAt: raw.date ? new Date(raw.date) : new Date(), // Unix timestamp → Date
});

const detectExperienceLevel = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("senior") || t.includes("sr.")) return "senior";
  if (t.includes("lead") || t.includes("principal")) return "lead";
  if (t.includes("junior") || t.includes("jr.") || t.includes("entry"))
    return "entry";
  return "mid";
};

const fetchRemoteOKJobs = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        // RemoteOK requires a User-Agent or it blocks the request
        "User-Agent": "JobPulse/1.0 (job aggregator app)",
      },
      timeout: 10000,
    });

    // First element is always a legal notice object — skip it
    const raw = response.data.slice(1);
    const jobs = raw.filter((j) => j.id && j.position); // Filter malformed entries

    console.log(`  📥 RemoteOK: ${jobs.length} jobs`);
    return jobs.map(normalizeJob);
  } catch (error) {
    console.error(`  ❌ RemoteOK error: ${error.message}`);
    return [];
  }
};

module.exports = { fetchRemoteOKJobs };
