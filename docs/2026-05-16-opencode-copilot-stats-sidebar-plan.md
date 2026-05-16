# Copilot Stats Sidebar Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

Goal: Add a lightweight "Copilot Stats" card to the OpenCode terminal right-hand sidebar that polls a local copilot-stats plugin for summary metrics (requests, tokens, premium usage percent vs quota, top model, last request) and shows per-agent usage. Privacy defaults to aggregated-only. No cost estimates.

Architecture: Frontend TypeScript sidebar component polls a local plugin endpoint GET /copilot-stats/summary on a configurable interval. Backend copilot-stats plugin exposes summary/recent/config/clear endpoints and computes aggregates in memory. Polling with backoff, local JSON retention for history.

Tech Stack: TypeScript/React for UI (match OpenCode extension conventions), Node/TypeScript for local plugin (or follow existing plugin patterns used in .opencode). Testing with Jest for unit and Vitest if used in repo, integration tests using mocked HTTP endpoints.

---

### Files to create/modify

- Create: `src/omnipy/hub/ui/sidebar/copilot_stats_card.tsx` (UI component)
- Modify: `src/omnipy/hub/ui/sidebar/index.tsx` — register the card in sidebar (or the analogous registration point for sidebar widgets)
- Create: `src/omnipy/plugins/copilot_stats_plugin.ts` — lightweight plugin exposing endpoints (or adapt to existing plugins dir pattern)
- Create: `src/omnipy/plugins/_tests/test_copilot_stats_plugin.py` — integration tests for plugin (if plugin is Python). If OpenCode plugins are TypeScript, put tests under appropriate test runner.
- Create: `tests/ui/test_copilot_stats_card.tsx` — unit tests for UI component with mocked fetch
- Create: `tests/integration/test_sidebar_integration.py` — integration test that mocks plugin endpoints and verifies polling behavior
- Update: `package.json` / build config if needed to include new TS components (follow repo conventions)

Note: adapt exact paths to the repository's real extension/plugin patterns. The plan below uses the `src/omnipy` area since this repo is omnipy and the sidebar UI lives under hub/ui. If the OpenCode extension system requires different placement, adjust accordingly during implementation.

... (remaining plan tasks mirror original, retained in the copilot-stats-widget repo)
