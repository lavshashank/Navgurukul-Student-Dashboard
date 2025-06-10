const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Enable CORS for all routes
server.use(cors({
  origin: ['http://localhost:3000', 'https://student-dashboard-frontend.onrender.com'],
  credentials: true
}));

// Use default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes if needed
server.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Use the router
server.use(router);

const port = process.env.PORT || 3001;
server.listen(port, '0.0.0.0', () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
}); 