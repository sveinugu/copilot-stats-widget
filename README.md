Copilot Stats Widget
====================

Lightweight widget that provides a compact Copilot/Copilot-like usage summary for OpenCode's right-hand sidebar.

Docs
----
Docs live under docs/superpowers/ in this repository. See:

- docs/superpowers/2026-05-16-opencode-copilot-stats-sidebar-design.md
- docs/superpowers/2026-05-16-opencode-copilot-stats-sidebar-plan.md

Notes
-----
- This project is intended to be used alongside the upstream `nilcaream/copilot-stats` tooling. The widget depends on a local copilot-stats plugin exposing summary endpoints. See the design doc for the expected API.

Development
-----------
- To run tests and build, install dependencies with your preferred package manager (example):

  npm install

  # then run the configured scripts
  npm test

This repository intentionally contains only the widget adapter and docs; implementation and CI specifics belong to the widget package maintainer.
