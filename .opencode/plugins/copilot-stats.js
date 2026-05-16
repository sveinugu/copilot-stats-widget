// Adapter shim: prefer the installed upstream package, otherwise provide a
// minimal local fallback implementation so tests and development work offline.
let cachedUpstream = undefined;

function loadUpstream() {
  if (cachedUpstream !== undefined) return cachedUpstream;
  try {
    cachedUpstream = require('copilot-stats');
  } catch (e) {
    // fallback minimal implementation
    cachedUpstream = {
      summarizeEvents: async function () { return { requests_count: 0, tokens: 0, premium_requests: 0, premium_quota: null, premium_usage_percent: null, top_model: null, last_request_iso: null, per_agent: [] } }
    };
  }
  return cachedUpstream;
}

async function callUpstreamAsSummary(upstream) {
  // upstream may be function or object with various names
  if (typeof upstream === 'function') {
    try { return await upstream([]) } catch (e) { return await upstream() }
  }
  if (typeof upstream.summarizeEvents === 'function') {
    try { return await upstream.summarizeEvents([]) } catch (e) { return await upstream.summarizeEvents() }
  }
  if (typeof upstream.summarize === 'function') {
    try { return await upstream.summarize([]) } catch (e) { return await upstream.summarize() }
  }
  if (typeof upstream.getSummary === 'function') {
    try { return await upstream.getSummary() } catch (e) { return await upstream.getSummary([]) }
  }
  // as last resort, if upstream provides an object-based summary, return it or an empty contract
  return { requests_count: 0, tokens: 0, premium_requests: 0, premium_quota: null, premium_usage_percent: null, top_model: null, last_request_iso: null, per_agent: [] };
}

module.exports = {
  getSummary: async function() {
    const up = loadUpstream();
    return await callUpstreamAsSummary(up);
  },
  summary: async function() { const up = loadUpstream(); return await callUpstreamAsSummary(up); },
  handler: async function() { const up = loadUpstream(); return await callUpstreamAsSummary(up); },
  default: async function() { const up = loadUpstream(); return await callUpstreamAsSummary(up); }
};
