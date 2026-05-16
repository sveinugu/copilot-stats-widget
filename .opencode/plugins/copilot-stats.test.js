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
    jest.doMock('copilot-stats', () => ({ summarizeEvents: jest.fn(async () => ({ requests_count: 1 })) }), { virtual: true });
    const plugin = require('./copilot-stats');
    await expect(plugin.getSummary()).resolves.toMatchObject({ requests_count: 1 });
  });

  test('adapter supports function default export upstream', async () => {
    const fn = jest.fn(async () => ({ requests_count: 2 }));
    jest.doMock('copilot-stats', () => fn, { virtual: true });
    const plugin = require('./copilot-stats');
    await expect(plugin.getSummary()).resolves.toMatchObject({ requests_count: 2 });
  });
});
