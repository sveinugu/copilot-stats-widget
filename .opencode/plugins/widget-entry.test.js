describe('widget entry plugin', () => {
  beforeEach(() => jest.resetModules())

  function getExportedPlugin() {
    const plugin = require('./widget-entry')
    const exported = plugin.default || plugin
    if (typeof exported !== 'function') throw new Error('plugin export is not a function')
    return exported
  }

  test('plugin registers sidebar card when host provides sidebar.registerCard', async () => {
    const exported = getExportedPlugin()
    const mockHost = { sidebar: { registerCard: jest.fn() } }

    const result = await exported({ client: {}, host: mockHost })

    expect(mockHost.sidebar.registerCard).toHaveBeenCalled()
    expect(result).toEqual({})
  })

  test('plugin is resilient when host has no sidebar API', async () => {
    const exported = getExportedPlugin()

    await expect(exported({ client: {}, host: {} })).resolves.toEqual({})
  })

  test('plugin tolerates synchronous logging implementations', async () => {
    jest.doMock('./widget-adapter', () => ({
      registerSidebarFromStore: jest.fn().mockRejectedValue(new Error('boom')),
    }))
    const exported = getExportedPlugin()
    const log = jest.fn()

    await expect(exported({ client: { app: { log } }, host: {} })).resolves.toEqual({})

    expect(log).toHaveBeenCalled()
  })
})
