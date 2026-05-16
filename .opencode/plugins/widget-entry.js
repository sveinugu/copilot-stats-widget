// .opencode/plugins/widget-entry.js
const adapter = require('./widget-adapter')

function logPluginError(client, error) {
  if (!(client && client.app && typeof client.app.log === 'function')) return
  try {
    const result = client.app.log({
      body: {
        service: 'copilot-stats-widget',
        level: 'error',
        message: String(error),
      },
    })
    if (result && typeof result.catch === 'function') result.catch(() => {})
  } catch (_) {}
}

module.exports = {
  default: async function ({ client, host } = {}) {
    try {
      if (adapter && typeof adapter.registerSidebarFromStore === 'function') {
        await adapter.registerSidebarFromStore(host, [])
      }
    } catch (e) {
      logPluginError(client, e)
    }
    return {}
  }
}
