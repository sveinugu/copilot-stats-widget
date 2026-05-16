// Adapter that depends on upstream nilcaream/copilot-stats plugin. This file
// calls the upstream plugin's exported helpers where appropriate and provides
// the sidebar adapter glue.

import { summarizeEvents, type CopilotEvent } from 'copilot-stats'

export function registerSidebarFromStore(host: any, events: CopilotEvent[]) {
  const summary = summarizeEvents(events as any)
  if (!host.sidebar?.registerCard) return { registered: false, fallbackCommand: '/copilot-stats' }

  host.sidebar.registerCard({
    id: 'copilot-stats',
    title: 'Copilot Stats',
    lines: [
      `Requests: ${summary.requests_count}`,
      `Tokens: ${summary.tokens}`,
      summary.premium_usage_percent === null
        ? `Premium requests: ${summary.premium_requests} (quota unset)`
        : `Premium usage: ${summary.premium_usage_percent}% of quota`,
      `Top model: ${summary.top_model ?? '—'}`,
      `Last request: ${summary.last_request_iso ?? 'never'}`,
      `By agent: ${summary.per_agent.map((a) => `${a.agent} ${a.requests} (${a.premium_requests} premium)`).join(', ')}`,
    ],
    live: summary.requests_count > 0,
    actionLabel: 'Open details',
    actionCommand: '/copilot-stats',
  })

  return { registered: true }
}
