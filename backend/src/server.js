import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { openDb } from './db.js';
import { createApp } from './app.js';

const here = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 5000;
const DB_FILE = process.env.DB_FILE || join(here, '..', 'data', 'employees.db');

const app = createApp(openDb(DB_FILE));
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT} (db: ${DB_FILE})`));
