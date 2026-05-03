const axios = require("axios");

const BASE_URL = "https://remotive.com/api/remote-jobs";

const normalizeJob = (raw) => ({
  externalId: `remotive_${raw.id}`,
  source: "remotive",

  title: raw.title,
  company: raw.company_name,
  location: raw.candidate_required_location || "Worldwide",
  isRemote: true, // Remotive is ALL remote jobs

  description: raw.description, // HTML string
  descriptionHtml: raw.description,

  salary: parseSalary(raw.salary),

  category: raw.category || "Software Development",
  tags: raw.tags || [],
  jobType: "full-time", // Remotive default
  experienceLevel: detectExperienceLevel(raw.title),

  applyUrl: raw.url,
  companyLogo: raw.company_logo || null,
  postedAt: new Date(raw.publication_date),
});

/**
 * Remotive salary comes as a free-text string like "$80k - $120k"
 * We do a best-effort parse
 */
const parseSalary = (salaryStr) => {
  if (!salaryStr)
    return { min: null, max: null, currency: "USD", period: null };

  // Match patterns like $80,000 or $80k
  const numbers = salaryStr.match(/\$?([\d,]+)k?/gi) || [];
  const parsed = numbers.map((n) => {
    const clean = n.replace(/[$,k]/gi, "");
    const val = parseFloat(clean);
    return n.toLowerCase().includes("k") ? val * 1000 : val;
  });

  return {
    min: parsed[0] || null,
    max: parsed[1] || null,
    currency: "USD",
    period: "yearly",
  };
};

const detectExperienceLevel = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("senior") || t.includes("sr.")) return "senior";
  if (t.includes("lead") || t.includes("principal")) return "lead";
  if (t.includes("junior") || t.includes("jr.") || t.includes("entry"))
    return "entry";
  return "mid";
};

const fetchRemotiveJobs = async (category = "software-dev") => {
  try {
    const response = await axios.get(BASE_URL, {
      params: { category, limit: 100 },
      timeout: 10000,
    });

    const jobs = response.data.jobs || [];
    console.log(`  📥 Remotive [${category}]: ${jobs.length} jobs`);

    return jobs.map(normalizeJob);
  } catch (error) {
    console.error(`  ❌ Remotive error: ${error.message}`);
    return [];
  }
};

module.exports = { fetchRemotiveJobs };
