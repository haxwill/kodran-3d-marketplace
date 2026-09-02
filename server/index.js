import express from 'express';
import path from 'path';
import apiApp from './server.js';

const app = express();
app.disable('x-powered-by');
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.resolve(process.cwd(), 'dist');

// Mount API middleware
app.use(apiApp);

// Serve static frontend in production
app.use(express.static(DIST_DIR));

// SPA fallback for HTML5 History API
app.use((req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[KODRAN PRODUCTION SERVER] Running at http://localhost:${PORT}`);
});
