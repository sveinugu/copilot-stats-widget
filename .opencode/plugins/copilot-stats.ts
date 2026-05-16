// Adapter shim: re-export from upstream copilot-stats package to keep local import path stable
// This file intentionally keeps a thin compatibility layer so consumers import from
// .opencode/plugins/copilot-stats
try {
  // prefer the installed package
  // @ts-ignore
  module.exports = require('copilot-stats');
} catch (e) {
  // fallback to a minimal local shim when upstream package is not installed.
  // This keeps tests and development usable even when the upstream package
  // cannot be fetched in the environment.
  // Provide a minimal getSummary handler that matches the widget contract.
  // @ts-ignore
  module.exports = {
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
    },
    // compatibility aliases
    summary: async function summary() { return module.exports.getSummary(); },
    handler: async function handler() { return module.exports.getSummary(); }
  };
}
