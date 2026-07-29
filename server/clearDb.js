import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Resource from './models/Resource.js';
import User from './models/User.js';
import Transaction from './models/Transaction.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

function uriForDatabase(baseUri, dbName) {
  const [withoutQuery, query = ''] = baseUri.split('?');
  const hostPart = withoutQuery.replace(/\/[^/]*$/, '');
  return query ? `${hostPart}/${dbName}?${query}` : `${hostPart}/${dbName}`;
}

async function clearDatabase(uri, label) {
  await mongoose.connect(uri);
  const [transactions, resources, users] = await Promise.all([
    Transaction.deleteMany({}),
    Resource.deleteMany({}),
    User.deleteMany({}),
  ]);
  console.log(
    `Cleared ${label}: ${users.deletedCount} users, ${resources.deletedCount} resources, ${transactions.deletedCount} transactions`
  );
  await mongoose.disconnect();
}

const baseUri = process.env.MONGO_URI;
if (!baseUri) {
  console.error('MONGO_URI is missing from server/.env');
  process.exit(1);
}

const targetDb = baseUri.match(/\.mongodb\.net\/([^/?]+)/)?.[1] || 'mydukaan';

try {
  await clearDatabase(uriForDatabase(baseUri, 'test'), 'test');
  if (targetDb !== 'test') {
    await clearDatabase(uriForDatabase(baseUri, targetDb), targetDb);
  }
  console.log('Done. Your app now uses the', targetDb, 'database.');
} catch (error) {
  console.error('Clear failed:', error.message);
  process.exit(1);
}
