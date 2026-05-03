const NodeCache = require("node-cache");

// stdTTL = seconds before cached data expires (1 hour)
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

module.exports = cache;
