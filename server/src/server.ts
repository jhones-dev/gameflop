import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

import app from './app.js';
import { startApolloServer } from './apollo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 4000;

async function startServer() {
  const server = https.createServer(
    {
      key: fs.readFileSync(path.join(__dirname, '..', 'certs', 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, '..', 'certs', 'cert.pem')),
    },
    app
  );

  await startApolloServer(app);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
  });
}

await startServer();
