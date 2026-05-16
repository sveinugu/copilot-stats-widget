const fetch = require('node-fetch');
const http = require('http');
const fs = require('fs');
const path = require('path');

describe('widget adapter fetch E2E (node-only)', () => {
  let server;
  let url;
  beforeAll((done) => {
    const data = fs.readFileSync(path.join(__dirname, '__fixtures__', 'vendored-summary.json'));
    server = http.createServer((req, res) => {
      if (req.url === '/copilot-stats/summary') {
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
        return;
      }
      res.statusCode = 404; res.end('not found');
    }).listen(0, () => {
      const port = server.address().port;
      url = `http://127.0.0.1:${port}`;
      done();
    });
  });
  afterAll(() => server.close());

  test('fetches and parses vendored summary', async () => {
    const resp = await fetch(`${url}/copilot-stats/summary`);
    expect(resp.ok).toBe(true);
    const body = await resp.json();
    expect(body).toEqual(expect.objectContaining({ requests_count: 3, top_model: 'gpt-5-mini' }));
  });
});
