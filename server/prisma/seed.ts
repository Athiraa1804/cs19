import 'dotenv/config';
import { prisma } from '../src/db/prisma.js';
import { seedFaqs } from '../src/data/faq.data.js';
import { seedQueries } from '../src/data/query.data.js';
import { seedReplies } from '../src/data/reply.data.js';
import { hashPassword } from '../src/utils/password.js';

async function main() {
  const adminPassword = await hashPassword(process.env.SEED_ADMIN_PASSWORD ?? 'admin12345');
  const internPassword = await hashPassword(process.env.SEED_INTERN_PASSWORD ?? 'intern12345');

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      id: 'admin-seed',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      passwordHash: adminPassword,
    },
  });

  await prisma.user.upsert({
    where: { email: 'intern@example.com' },
    update: {},
    create: {
      id: 'intern-seed',
      name: 'Intern User',
      email: 'intern@example.com',
      role: 'intern',
      passwordHash: internPassword,
    },
  });

  for (const faq of seedFaqs) {
    await prisma.fAQ.upsert({
      where: { id: faq.id },
      update: {},
      create: {
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        tags: faq.tags,
        helpfulCount: faq.helpfulCount,
        source: faq.source === 'existing' ? 'existing' : 'crowd_sourced',
        createdAt: new Date(faq.createdAt),
        updatedAt: new Date(faq.updatedAt),
      },
    });
  }

  for (const query of seedQueries) {
    await prisma.query.upsert({
      where: { id: query.id },
      update: {},
      create: {
        id: query.id,
        title: query.title,
        description: query.description,
        category: query.category,
        tags: query.tags,
        status: query.status,
        createdBy: 'intern-seed',
        latestReplyPreview: query.latestReplyPreview,
        matchedFaqIds: query.matchedFaqIds ?? [],
        verifiedReplyId: query.verifiedReplyId,
        createdAt: new Date(query.createdAt),
        updatedAt: new Date(query.updatedAt),
      },
    });
  }

  for (const reply of seedReplies) {
    const isAdmin = reply.authorRole === 'admin';
    await prisma.reply.upsert({
      where: { id: reply.id },
      update: {},
      create: {
        id: reply.id,
        queryId: reply.queryId,
        body: reply.body,
        authorName: reply.authorName,
        authorRole: reply.authorRole,
        authorId: isAdmin ? 'admin-seed' : 'intern-seed',
        isVerified: reply.isVerified,
        createdAt: new Date(reply.createdAt),
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
