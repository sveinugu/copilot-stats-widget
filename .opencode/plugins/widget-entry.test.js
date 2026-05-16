const plugin = require('./widget-entry')

describe('widget entry plugin', () => {
  test('plugin registers sidebar card when host provides sidebar.registerCard', async () => {
    const mockHost = { sidebar: { registerCard: jest.fn() } }
    const exported = plugin.default || plugin
    if (typeof exported !== 'function') throw new Error('plugin export is not a function')
    await exported({ client: {}, host: mockHost })
    expect(mockHost.sidebar.registerCard).toHaveBeenCalled()
  })
})
