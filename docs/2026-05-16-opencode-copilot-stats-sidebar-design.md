Title: Copilot Stats — Right Sidebar Summary Widget
Date: 2026-05-16

Summary
-------
Add a lightweight "Copilot Stats" card into the OpenCode terminal right-hand sidebar (the same area that holds Session title, Contexts, and LSP). The card shows a compact, privacy-respecting summary of Copilot/Copilot-like requests served by the local copilot-stats plugin and updates regularly. This document captures the MVP design approved by the user: polling summary widget (default 10s), no cost estimate, show percentage of premium-model usage vs. a configurable premium quota, and include per-agent usage as an extra field.

Assumptions
-----------
- OpenCode supports adding a custom sidebar card in the terminal UI and that card can make local plugin calls (same-origin or internal IPC) to a user-local plugin. If this is not available, the UI will degrade to an "Open details" button that runs the /copilot-stats command instead.
- A copilot-stats plugin exists or will be provided locally that exposes simple HTTP/IPC endpoints for summary and recent events and that aggregates/redacts sensitive prompt content by default.
- The widget must be opt-in or enabled with privacy defaults; it will not transmit raw prompts externally unless the user explicitly opts-in.

Design (MVP - Polling Summary Widget)
------------------------------------

UX / UI
- Placement: add a new collapsible card in the right-hand sidebar titled "Copilot Stats". Match existing OpenCode styles (dark theme, compact spacing).
- Collapsed state: default collapsed. When new activity is detected since last view, show a subtle badge/dot.
- Compact card contents (collapsed/compact view):
  - Header: "Copilot Stats" and an ellipsis menu for settings
  - Summary metrics (single-line each, compact):
    - Requests (session or last 24h) — integer
    - Tokens (approximate) — integer
    - Premium usage: X% of premium quota (see Data & API)
    - Top model (name)
    - Last request (relative time)
  - Small live indicator: green pulse when recent activity detected
  - Link/Button: "Open details" (opens details drawer or runs /copilot-stats)

Settings (reachable from ellipsis menu)
- Refresh interval: 5s / 10s (default) / 30s / manual
- Privacy: "Aggregated-only (default)" / "Allow detailed view (explicit opt-in)"
- Enable/Disable widget
- Clear local history
- Premium quota config: numeric field for "premium requests per period" (used to compute % usage)

Data & API
- Source: copilot-stats plugin running from user's OpenCode config.
- Required endpoints (MVP):
  - GET /copilot-stats/summary
    - Response: {
        requests_count: int,
        tokens: int,
        premium_requests: int,        # number of requests served by premium models
        premium_quota: int|null,      # configured quota (or null if unset)
        premium_usage_percent: float|null, # derived by plugin if quota provided
        top_model: string|null,
        last_request_iso: string|null,
        per_agent: [{ agent: string, requests: int, premium_requests: int }]
      }
  - GET /copilot-stats/recent?limit=20
    - Returns recent events (redacted by default). If user opts into detailed logging, return fuller entries.
  - GET /copilot-stats/config
    - Returns user-visible settings and privacy state
  - POST /copilot-stats/clear
    - Clears local history (user action)

Notes on premium quota and percentage
- The widget will display premium_usage_percent computed as (premium_requests / premium_quota) * 100 when premium_quota is set. If premium_quota is not configured, show "premium requests: N (quota unset)" and expose a quick link to set quota in settings. The plugin may compute the percent or the UI may compute it from returned fields; either is acceptable but the plugin should return premium_quota when available to avoid guessing.

Per-agent usage
- The summary endpoint includes a per_agent array of { agent, requests, premium_requests } so the UI can show an extra compact line like: "By agent: AgentA 12 (3 premium), AgentB 4 (0 premium)" or a link to open details.

Privacy & Security
- Default behavior: aggregated metrics only. All prompt texts and full request payloads are redacted by default.
- Detailed view requires explicit user opt-in and a visible warning that enabling detailed logging will retain more data locally.
- The plugin and UI only operate on the local user's config and do not transmit raw prompt text externally.

Storage & Retention
- Keep only a small ring buffer of recent events in memory and optionally persist a small JSON file under the user's OpenCode config (e.g., ~/.config/opencode/copilot-stats.json). Default retention: last 7 days or last 2000 events (configurable).
- Provide a clear UI control to wipe stored history.

Runtime / Implementation notes (MVP)
- Frontend: small TypeScript/React component following OpenCode sidebar extension pattern; performs periodic fetch to GET /copilot-stats/summary at the configured interval. Minimal local state; keep UI rendering light.
- Backend: copilot-stats plugin exposes lightweight endpoints (GET summary + recent + config + clear). For MVP the plugin can compute aggregates in memory; persistent store optional.
- Polling interval default: 10s. If fetch fails repeatedly, show "Stats unavailable" and back off (exponential) until manual retry.
- The frontend should gracefully fallback to running the existing /copilot-stats command if the plugin endpoint is not available.

Error handling & UX fallbacks
- Unreachable plugin: show "Stats unavailable — plugin not installed or disabled" and a button to run installation/enable instructions.
- Stale data: show last-updated timestamp and a small warning icon.

Testing
- Unit:
  - UI renders the compact card with mocked summary responses (normal + premium quota unset + error cases)
  - Settings toggles change refresh behavior
- Integration:
  - Mock plugin endpoints to simulate normal operation and error modes; verify UI polling, backoff, and privacy toggle behavior
  - Verify per-agent breakdown populates and is shown in compact line or details view
- Manual E2E:
  - Install copilot-stats plugin locally, generate a few Copilot requests, and verify the sidebar updates and the premium usage % reflects configured quota

Success criteria
- The widget appears in the right-hand sidebar and matches OpenCode styles.
- Summary metrics populate from the plugin within the configured interval.
- Premium usage % is shown when quota is set and computed correctly.
- Per-agent usage is visible in the compact summary or in details and matches plugin data.
- Privacy defaults to aggregated-only; enabling detailed logging requires explicit opt-in and a visible warning.

Contact/Notes
- This design intentionally omits any cost-estimate field per user's request. If you later decide to reintroduce an estimate, add a model->tokens->USD mapping in the plugin (non-blocking).
