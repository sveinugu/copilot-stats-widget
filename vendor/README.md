This directory contains a vendored copy of the upstream `copilot-stats` plugin used as a local fallback for CI and development.

Provenance and license:
- Source: https://github.com/nilcaream/copilot-stats (cloned into vendor/copilot-stats)
- Upstream commit pinned in CI: 1f8b031
- License: Apache-2.0 (see vendor/copilot-stats/LICENSE if present)

How to update the pinned SHA:
1. Clone upstream locally: `git clone https://github.com/nilcaream/copilot-stats.git`
2. Checkout and test the desired commit (e.g., `git checkout <sha>`), run local tests.
3. Update `.github/workflows/ci.yml` replacing the SHA with the new one.
4. Update this README: replace the pinned commit line with the new SHA.
5. Run CI and confirm tests pass.

If you prefer to install the upstream repo separately, remove vendor/ and adjust CI accordingly.
