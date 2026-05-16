# 2026-05-16 — OpenCode Copilot Stats Sidebar report (Part 1: Implementation, reconstructed)

This document reconstructs the main implementation work performed on branch `changes-from-opencode-adapter` and explains what was implemented, how it fits together, and why certain choices appear to have been made. Sections labeled "SPECULATIVE" contain inferred motivation, trade-offs, or intent that are not present verbatim in the repository; those items are explicitly called out so reviewers can treat them as hypotheses rather than facts.

1) Verifiable facts (what is in the repository now)
- Branch: changes-from-opencode-adapter (present in the workspace).
- Adapter files:
  - .opencode/plugins/copilot-stats.js — JavaScript adapter shim normalizing upstream export shapes (present in the tree).
  - .opencode/plugins/copilot-stats.ts — TypeScript bridge delegating to the JS shim (present in the tree).
- Widget adapter:
  - .opencode/plugins/widget-adapter.js — registers a sidebar widget and delegates to the copilot-stats adapter (present).
- Vendored upstream:
  - vendor/copilot-stats/plugins/copilot-stats.ts — vendored upstream plugin source (present).
  - vendor/copilot-stats/LICENSE — Apache-2.0 license file (present).
  - vendor/README.md — provenance and pinned SHA information (present).
- Tests & fixtures:
  - .opencode/plugins/copilot-stats.test.js — unit tests for adapter aliasing / fallback.
  - .opencode/plugins/widget-adapter.fetch.test.js — node-only E2E test exercising fetch path.
  - tests/integration/test_summary.integration.test.js — integration test for summary contract.
  - .opencode/plugins/__fixtures__/vendored-summary.json — fixture used by tests.
- Tooling and CI:
  - package.json + package-lock.json updated for deterministic installs; jest tests run via npm test.
  - .github/workflows/ci.yml updated to prefer committed vendor files and otherwise fetch a pinned upstream SHA and verify provenance before running tests.

2) Reconstructed implementation steps (what likely happened)
These steps are a best-effort reconstruction derived from the code and tests in the tree.

- Step A — Add adapter shim
  - Purpose: normalize upstream export shapes so OpenCode can load a stable plugin interface regardless of how upstream exports the module (default export, named functions, handler-style). The shim exports a predictable API (getSummary/summary) and falls back to vendored or stub behavior when necessary.
  - Files changed: .opencode/plugins/copilot-stats.js and .opencode/plugins/copilot-stats.ts.

- Step B — Implement widget adapter
  - Purpose: provide a lightweight widget implementation that registers with OpenCode and calls the adapter's API to gather summary data asynchronously. It handles the situation where no data exists by rendering a friendly message.
  - Files changed: .opencode/plugins/widget-adapter.js and associated test harness.

- Step C — Vendor upstream plugin for CI determinism
  - Purpose: CI environments often restrict network access or need reproducible builds. A pinned copy of the upstream plugin was added to vendor/ with a recorded SHA and license to make CI deterministic and auditable.
  - Files changed: vendor/copilot-stats/plugins/copilot-stats.ts, vendor/copilot-stats/LICENSE, vendor/README.md.

- Step D — Add tests (TDD-first approach)
  - Unit tests validate adapter aliasing and fallback behavior.
  - Integration/E2E tests exercise the widget + adapter end-to-end using a JSON fixture.
  - The added tests run under jest and pass locally.

- Step E — Harden CI
  - CI workflow updated to prefer vendor/ files; when vendor/ is absent it fetches an exact pinned upstream commit and verifies the SHA and license before running tests.

3) What the adapter API looks like (high-level, verifiable surface)
- The adapter provides one or more of these shapes and normalizes them:
  - default export (function or object)
  - named exports: summarize, summarizeEvents, getSummary
  - handler-like function (.handler or .default that expects an event list)
- The shim exposes a unified method the widget uses (getSummary or summary) that the widget calls asynchronously.

4) Testing and verification performed locally
- I ran the test suite on branch `changes-from-opencode-adapter` and observed all tests passing (4 suites, 6 tests).

5) SPECULATIVE — motivations, trade-offs, and inferred rationale
The following items are plausible reasons for choices made; they are not recorded in the repo and are therefore marked SPECULATIVE. Treat these as hypotheses to validate with the author/reviewer.

- SPECULATIVE: Why an adapter shim? — Likely because upstream nilcaream/copilot-stats has changed its export shape over time or different consumers expect different shapes; a shim avoids conditional logic across the codebase and centralizes the compatibility logic.

- SPECULATIVE: Why vendor upstream copy? — To make CI deterministic and auditable. Some CI providers block network access or repositories want to pin third-party code so builds are reproducible and faster. Tracking the license file and a pinned SHA supports auditing requirements.

- SPECULATIVE: Why both .js and .ts plugin files? — To maximize compatibility: some OpenCode installations prefer TypeScript plugin files while others prefer JS; the .ts file delegates to the JS shim so behavior is identical while supporting TypeScript-aware loaders.

- SPECULATIVE: Why node-only E2E tests? — The widget likely depends on OpenCode runtime features not available in a browser test harness; node-only tests are simpler to run in CI and validate the integration logic that doesn't require a browser UI.

6) Places where future reviewers should pay attention (risks & follow-ups)
- Confirm the pinned upstream SHA and the provenance messages in vendor/README.md; update if necessary when upstream is intentionally changed.
- Decide whether CI should prefer vendor/ always or allow fetching when vendor/ is absent; document the policy.
- Confirm whether the adapter should be exported under other names for backwards compatibility; consider adding a short compatibility test matrix in docs.

7) Suggested changelog entry (copyable)
"Adapter shim + vendored upstream: Added an OpenCode adapter shim for nilcaream/copilot-stats to normalize export shapes, vendored the upstream plugin for CI determinism, added unit/integration/E2E tests, and updated CI to verify pinned upstream SHA and license." (Mark speculative reasoning as assumptions if included in release notes.)

8) Appendix — exact files to review (paths)
- .opencode/plugins/copilot-stats.js
- .opencode/plugins/copilot-stats.ts
- .opencode/plugins/widget-adapter.js
- vendor/copilot-stats/plugins/copilot-stats.ts
- vendor/copilot-stats/LICENSE
- vendor/README.md
- .github/workflows/ci.yml
- .opencode/plugins/copilot-stats.test.js
- .opencode/plugins/widget-adapter.fetch.test.js
- tests/integration/test_summary.integration.test.js

If you'd like, I will commit this document as docs/2026-05-16-opencode-copilot-stats-sidebar-report-part1.md on branch changes-from-opencode-adapter and push nothing. Confirm and I'll commit it now.
