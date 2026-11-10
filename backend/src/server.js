import { app } from './app.js';
import { config } from './config.js';
import { db } from './db/index.js';

console.log(`Database connected: ${config.dbPath}`);

const server = app.listen(config.port, () => {
  console.log(`Server starting on http://localhost:${config.port}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
