const { registerSidebarFromStore } = require('./widget-adapter.js')

describe('widget-adapter', () => {
  test('registers card when host supports sidebar', () => {
    const calls = []
    const host = { sidebar: { registerCard: (c) => calls.push(c) } }
    const events = [
      { agent: 'A', model: 'm', tokens: 10, premium: false, timestamp: '2026-05-16T00:00:00Z' },
    ]
    const r = registerSidebarFromStore(host, events)
    expect(r.registered).toBe(true)
    expect(calls.length).toBe(1)
  })
})
