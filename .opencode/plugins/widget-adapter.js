// CommonJS adapter for widget tests — uses upstream 'copilot-stats' package
const cs = require('copilot-stats')

function registerSidebarFromStore(host, events) {
  const summary = cs.summarizeEvents ? cs.summarizeEvents(events) : { requests_count: 0, tokens: 0, premium_requests: 0, premium_usage_percent: null, top_model: null, last_request_iso: null, per_agent: [] }
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
