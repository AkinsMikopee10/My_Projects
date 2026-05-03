const Job = require("../models/Job");
const { fetchAdzunaJobs } = require("./sources/adzuna");
const { fetchRemotiveJobs } = require("./sources/remotive");
const { fetchRemoteOKJobs } = require("./sources/remoteok");

/**
 * Save an array of normalized jobs to MongoDB.
 * Uses upsert so re-running never creates duplicates.
 */
const saveJobs = async (jobs) => {
  if (!jobs.length) return { saved: 0, updated: 0, errors: 0 };

  let saved = 0,
    updated = 0,
    errors = 0;

  // Process in parallel batches of 10 for speed
  const BATCH_SIZE = 10;

  for (let i = 0; i < jobs.length; i += BATCH_SIZE) {
    const batch = jobs.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (job) => {
        try {
          const result = await Job.findOneAndUpdate(
            { externalId: job.externalId }, // Find by unique external ID
            { $set: job }, // Update all fields
            {
              upsert: true, // Create if doesn't exist
              returnDocument: "after", // Return the new document
              runValidators: true,
            },
          );

          // Mongoose sets __v on new docs — we check if it's brand new
          if (result.__v === 0) {
            saved++;
          } else {
            updated++;
          }
        } catch (err) {
          // Log but don't crash — one bad job shouldn't stop the rest
          console.error(`    ⚠️  Failed to save job: ${err.message}`);
          errors++;
        }
      }),
    );
  }

  return { saved, updated, errors };
};

/**
 * Main aggregation function — fetches from all sources
 */
const aggregateJobs = async () => {
  console.log("\n🔄 Starting job aggregation...\n");
  const startTime = Date.now();

  const results = {
    adzuna: { fetched: 0, saved: 0, updated: 0, errors: 0 },
    remotive: { fetched: 0, saved: 0, updated: 0, errors: 0 },
    remoteok: { fetched: 0, saved: 0, updated: 0, errors: 0 },
  };

  // ── Adzuna ──────────────────────────────────────────────────
  console.log("📡 Fetching from Adzuna...");
  const adzunaCategories = ["it-jobs", "engineering-jobs"];
  const adzunaJobs = [];

  for (const category of adzunaCategories) {
    const jobs = await fetchAdzunaJobs(category, 1);
    adzunaJobs.push(...jobs);
  }

  results.adzuna.fetched = adzunaJobs.length;
  Object.assign(results.adzuna, await saveJobs(adzunaJobs));

  // ── Remotive ─────────────────────────────────────────────────
  console.log("\n📡 Fetching from Remotive...");
  const remotiveCategories = ["software-dev", "devops-sysadmin", "data"];
  const remotiveJobs = [];

  for (const category of remotiveCategories) {
    const jobs = await fetchRemotiveJobs(category);
    remotiveJobs.push(...jobs);
  }

  results.remotive.fetched = remotiveJobs.length;
  Object.assign(results.remotive, await saveJobs(remotiveJobs));

  // ── RemoteOK ──────────────────────────────────────────────────
  console.log("\n📡 Fetching from RemoteOK...");
  const remoteokJobs = await fetchRemoteOKJobs();
  results.remoteok.fetched = remoteokJobs.length;
  Object.assign(results.remoteok, await saveJobs(remoteokJobs));

  // ── Summary ───────────────────────────────────────────────────
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalFetched = Object.values(results).reduce(
    (sum, r) => sum + r.fetched,
    0,
  );
  const totalSaved = Object.values(results).reduce(
    (sum, r) => sum + r.saved,
    0,
  );
  const totalUpdated = Object.values(results).reduce(
    (sum, r) => sum + r.updated,
    0,
  );

  console.log(`
✅ Aggregation complete in ${elapsed}s
─────────────────────────────
  Total fetched : ${totalFetched}
  New jobs saved: ${totalSaved}
  Jobs updated  : ${totalUpdated}
─────────────────────────────
  Adzuna   → ${results.adzuna.fetched} fetched, ${results.adzuna.saved} new
  Remotive → ${results.remotive.fetched} fetched, ${results.remotive.saved} new
  RemoteOK → ${results.remoteok.fetched} fetched, ${results.remoteok.saved} new
  `);

  return results;
};

module.exports = { aggregateJobs };
