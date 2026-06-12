import 'dotenv/config';
import { connectMongo, disconnectMongo } from '../db/mongoose.js';
import { FaqModel } from '../models/Faq.js';
import { QueryModel } from '../models/Query.js';
import { ReplyModel } from '../models/Reply.js';
import { UserModel } from '../models/User.js';
import { seedFaqs } from '../data/faq.data.js';
import { seedQueries } from '../data/query.data.js';
import { seedReplies } from '../data/reply.data.js';
import { hashPassword } from '../utils/password.js';

async function seed(): Promise<void> {
  await connectMongo();

  const adminPassword = await hashPassword(process.env.SEED_ADMIN_PASSWORD ?? 'admin12345');
  const internPassword = await hashPassword(process.env.SEED_INTERN_PASSWORD ?? 'intern12345');

  await UserModel.updateOne(
    { email: 'admin@example.com' },
    {
      $setOnInsert: {
        id: 'admin-seed',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        passwordHash: adminPassword,
      },
    },
    { upsert: true },
  );

  await UserModel.updateOne(
    { email: 'intern@example.com' },
    {
      $setOnInsert: {
        id: 'intern-seed',
        name: 'Intern User',
        email: 'intern@example.com',
        role: 'intern',
        passwordHash: internPassword,
      },
    },
    { upsert: true },
  );

  for (const faq of seedFaqs) {
    await FaqModel.updateOne(
      { id: faq.id },
      {
        $setOnInsert: {
          ...faq,
          source: faq.source,
          createdAt: new Date(faq.createdAt),
          updatedAt: new Date(faq.updatedAt),
        },
      },
      { upsert: true, timestamps: false },
    );
  }

  for (const query of seedQueries) {
    await QueryModel.updateOne(
      { id: query.id },
      {
        $setOnInsert: {
          ...query,
          createdBy: 'intern-seed',
          matchedFaqIds: query.matchedFaqIds ?? [],
          createdAt: new Date(query.createdAt),
          updatedAt: new Date(query.updatedAt),
        },
      },
      { upsert: true, timestamps: false },
    );
  }

  for (const reply of seedReplies) {
    await ReplyModel.updateOne(
      { id: reply.id },
      {
        $setOnInsert: {
          ...reply,
          authorId: reply.authorRole === 'admin' ? 'admin-seed' : 'intern-seed',
          createdAt: new Date(reply.createdAt),
          updatedAt: new Date(reply.createdAt),
        },
      },
      { upsert: true, timestamps: false },
    );
  }

  console.log('MongoDB seed completed.');
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectMongo();
  });
