describe('copilot-stats plugin wrapper', () => {
  beforeEach(() => jest.resetModules());

  test('exports expected summary handler or function (fallback or upstream)', async () => {
    const plugin = require('./copilot-stats');
    expect(plugin).toBeDefined();
    const possible = plugin.getSummary || plugin.summary || plugin.default || plugin.handler;
    expect(possible).toBeDefined();
    const data = await possible();
    expect(data).toBeDefined();
  });

  test('adapter maps upstream summarizeEvents to getSummary', async () => {
    jest.mock('copilot-stats', () => ({ summarizeEvents: async () => ({ requests_count: 1 }) }));
    const plugin = require('./copilot-stats');
    await expect(plugin.getSummary()).resolves.toMatchObject({ requests_count: 1 });
  });

  test('adapter supports function default export upstream', async () => {
    jest.mock('copilot-stats', () => (async () => ({ requests_count: 2 })));
    const plugin = require('./copilot-stats');
    await expect(plugin.getSummary()).resolves.toMatchObject({ requests_count: 2 });
  });
});
