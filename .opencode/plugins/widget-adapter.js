// CommonJS adapter for widget tests — uses local adapter at ./copilot-stats
const cs = require('./copilot-stats')

async function registerSidebarFromStore(host, events) {
  // Try multiple adapter entry points (upstream may export different names)
  const getter = cs.getSummary || cs.summary || cs.handler || cs.default || cs.summarizeEvents || cs.summarize
  let summary
  try {
    if (!getter) summary = { requests_count: 0, tokens: 0, premium_requests: 0, premium_usage_percent: null, top_model: null, last_request_iso: null, per_agent: [] }
    else {
      // support both sync and async getters
      summary = getter.length >= 1 ? await getter(events) : await getter()
    }
  } catch (e) {
    // On error, fall back to empty summary but keep the widget available
    summary = { requests_count: 0, tokens: 0, premium_requests: 0, premium_usage_percent: null, top_model: null, last_request_iso: null, per_agent: [] }
  }

  if (!host.sidebar || !host.sidebar.registerCard) return { registered: false, fallbackCommand: '/copilot-stats' }

  const lines = [
    `Requests: ${summary.requests_count}`,
    `Tokens: ${summary.tokens}`,
    summary.premium_usage_percent === null
      ? `Premium requests: ${summary.premium_requests} (quota unset)`
      : `Premium usage: ${summary.premium_usage_percent}% of quota`,
    `Top model: ${summary.top_model ?? '—'}`,
    `Last request: ${summary.last_request_iso ?? 'never'}`,
    `By agent: ${summary.per_agent.map((a) => `${a.agent} ${a.requests} (${a.premium_requests} premium)`).join(', ')}`,
  ]

  host.sidebar.registerCard({
    id: 'copilot-stats',
    title: 'Copilot Stats',
    lines,
    live: summary.requests_count > 0,
    actionLabel: 'Open details',
    actionCommand: '/copilot-stats',
  })

  return { registered: true }
}

module.exports = { registerSidebarFromStore }
