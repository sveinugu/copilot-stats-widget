const plugin = require('../../.opencode/plugins/copilot-stats');

describe('integration: copilot-stats adapter with upstream/vendor', () => {
  test('getSummary returns expected shape', async () => {
    const getter = plugin.getSummary || plugin.summary || plugin.handler || plugin.default;
    const data = await getter();
    expect(data).toEqual(expect.objectContaining({
      requests_count: expect.any(Number),
      tokens: expect.anything(),
      premium_requests: expect.any(Number),
      premium_quota: expect.anything(),
      premium_usage_percent: expect.anything(),
      top_model: expect.anything(),
      last_request_iso: expect.anything(),
      per_agent: expect.any(Array),
    }));
  });
});
