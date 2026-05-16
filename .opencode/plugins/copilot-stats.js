// Adapter shim: prefer the installed upstream package, otherwise provide a
// minimal local fallback implementation so tests and development work offline.
let upstream;
try {
  upstream = require('copilot-stats');
} catch (e) {
  upstream = {
    getSummary: async function getSummary() {
      return {
        requests_count: 0,
        tokens: 0,
        premium_requests: 0,
        premium_quota: null,
        premium_usage_percent: null,
        top_model: null,
        last_request_iso: null,
        per_agent: []
      };
    }
  };
}

// Ensure compatibility aliases for consumers that expect different names
const exportsObj = Object.assign({}, upstream);
if (!exportsObj.getSummary) {
  if (typeof upstream.summarizeEvents === 'function') exportsObj.getSummary = upstream.summarizeEvents;
  if (typeof upstream.summarize === 'function') exportsObj.getSummary = upstream.summarize;
}
if (!exportsObj.summary) exportsObj.summary = exportsObj.getSummary;
if (!exportsObj.handler) exportsObj.handler = exportsObj.getSummary;
if (!exportsObj.default) exportsObj.default = exportsObj.getSummary;

module.exports = exportsObj;
