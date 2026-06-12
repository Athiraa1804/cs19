import fs from 'node:fs';
import path from 'node:path';
import type { FAQ } from '../types/faq.js';
import type { Query } from '../types/query.js';
import type { Reply } from '../types/reply.js';
import type { User } from '../types/user.js';
import { seedFaqs } from '../data/faq.data.js';
import { seedQueries } from '../data/query.data.js';
import { seedReplies } from '../data/reply.data.js';

export interface StoreData {
  users: User[];
  faqs: FAQ[];
  queries: Query[];
  replies: Reply[];
}

const storePath = process.env.DATA_FILE_PATH ?? path.join(process.cwd(), 'data', 'store.json');

function now(): string {
  return new Date().toISOString();
}

function defaultStore(): StoreData {
  const timestamp = now();
  return {
    users: [
      {
        id: 'admin-seed',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        passwordHash: 'deprecated-json-store',
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: 'intern-seed',
        name: 'Intern User',
        email: 'intern@example.com',
        role: 'intern',
        passwordHash: 'deprecated-json-store',
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    faqs: [...seedFaqs],
    queries: seedQueries.map((query) => ({ ...query, createdBy: 'intern-seed' })),
    replies: [...seedReplies],
  };
}

class JsonStore {
  private data: StoreData;

  constructor() {
    this.data = this.load();
  }

  get snapshot(): StoreData {
    return this.data;
  }

  save(): void {
    fs.mkdirSync(path.dirname(storePath), { recursive: true });
    fs.writeFileSync(storePath, JSON.stringify(this.data, null, 2), 'utf8');
  }

  private load(): StoreData {
    if (!fs.existsSync(storePath)) {
      const seeded = defaultStore();
      fs.mkdirSync(path.dirname(storePath), { recursive: true });
      fs.writeFileSync(storePath, JSON.stringify(seeded, null, 2), 'utf8');
      return seeded;
    }

    const raw = fs.readFileSync(storePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    return {
      users: parsed.users ?? [],
      faqs: parsed.faqs ?? [],
      queries: parsed.queries ?? [],
      replies: parsed.replies ?? [],
    };
  }
}

export const jsonStore = new JsonStore();
