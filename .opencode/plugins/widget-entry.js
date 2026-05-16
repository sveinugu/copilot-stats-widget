// .opencode/plugins/widget-entry.js
const adapter = require('./widget-adapter')

module.exports = {
  default: async function ({ client, host } = {}) {
    try {
      if (adapter && typeof adapter.registerSidebarFromStore === 'function') {
        try {
          await adapter.registerSidebarFromStore(host, [])
        } catch (e) {
          if (client && client.app && typeof client.app.log === 'function') {
            client.app.log({ body: { service: 'copilot-stats-widget', level: 'error', message: e.toString() } }).catch(() => {})
          }
        }
      }
    } catch (e) {
      if (client && client.app && typeof client.app.log === 'function') {
        client.app.log({ body: { service: 'copilot-stats-widget', level: 'error', message: e.toString() } }).catch(() => {})
      }
    }
    return {}
  }
}
