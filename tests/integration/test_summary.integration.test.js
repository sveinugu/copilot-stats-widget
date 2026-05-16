const plugin = require('../../.opencode/plugins/copilot-stats');

describe('integration: copilot-stats adapter with upstream/vendor', () => {
  test('getSummary returns expected shape', async () => {
    const getter = plugin.getSummary || plugin.summary || plugin.handler || plugin.default || plugin.summarizeEvents;
    const data = await getter();
    // allow nullable values for optional fields while asserting core numeric fields
    expect(data).toEqual(expect.objectContaining({
      requests_count: expect.any(Number),
      premium_requests: expect.any(Number),
      per_agent: expect.any(Array),
    }));
  });
});
