#!/usr/bin/env node
// Simple demo runner for copilot-stats-widget in this workspace.
// Invokes the copilot-stats adapter and the widget adapter with a mock host
// to demonstrate end-to-end behavior without an OpenCode UI.

const path = require('path')

const cs = require(path.join(__dirname, '..', 'plugins', 'copilot-stats'))
const widget = require(path.join(__dirname, '..', 'plugins', 'widget-adapter'))

async function run() {
  console.log('=== copilot-stats-widget demo ===')

  // Call upstream adapter summary getter
  console.log('\n1) Calling copilot-stats adapter getSummary...')
  const getter = cs.getSummary || cs.summary || cs.handler || cs.default || cs.summarizeEvents
  try {
    const summary = await getter()
    console.log('getSummary result:')
    console.log(JSON.stringify(summary, null, 2))
  } catch (e) {
    console.error('getSummary threw error:')
    console.error(e)
  }

  // Mock host to capture sidebar registration
  console.log('\n2) Invoking widget.registerSidebarFromStore with mock host...')
  const mockHost = {
    sidebar: {
      registerCard: (card) => {
        console.log('sidebar.registerCard called with:')
        console.log(JSON.stringify(card, null, 2))
      }
    }
  }

  try {
    const result = await widget.registerSidebarFromStore(mockHost, [])
    console.log('registerSidebarFromStore returned:', result)
  } catch (e) {
    console.error('registerSidebarFromStore threw error:')
    console.error(e)
  }
}

run().catch((e) => {
  console.error('Demo runner failed:')
  console.error(e)
  process.exitCode = 1
})
