import http from 'http';
import { routes } from './routes/tasks.js';

const server = http.createServer(async (req, res) => {
  for (const route of routes) {
    if (req.url?.startsWith(route.path) && req.method === route.method) {
      return route.handler(req, res);
    }
  }

  res.writeHead(404).end('Not Found');
});

server.listen(3333, () => {
  console.log('🚀 Server running on http://localhost:3333');
});
