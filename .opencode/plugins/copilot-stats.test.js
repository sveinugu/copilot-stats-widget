const plugin = require('./copilot-stats');

describe('copilot-stats plugin wrapper', () => {
  test('exports expected summary handler or function', () => {
    // The wrapper should export a function or handler that can provide summary data
    expect(plugin).toBeDefined();
    // allow either a named export or default
    const possible = plugin.getSummary || plugin.summary || plugin.default || plugin.handler;
    expect(possible).toBeDefined();
  });
});
