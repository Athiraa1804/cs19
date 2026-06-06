import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { hashPassword } from '../utils/password.js';

const state = vi.hoisted(() => ({
  users: [] as any[],
  queries: [] as any[],
  replies: [] as any[],
  faqs: [] as any[],
}));

vi.mock('../repositories/userRepository.js', () => ({
  userRepository: {
    findById: vi.fn((id) => Promise.resolve(state.users.find((user) => user.id === id))),
    findByEmail: vi.fn((email) =>
      Promise.resolve(state.users.find((user) => user.email === email.toLowerCase())),
    ),
    create: vi.fn((input) => {
      const now = new Date().toISOString();
      const user = { id: `user-${Date.now()}`, createdAt: now, updatedAt: now, ...input };
      state.users.push(user);
      return Promise.resolve(user);
    }),
  },
}));

vi.mock('../repositories/queryRepository.js', () => ({
  queryRepository: {
    findAll: vi.fn(() =>
      Promise.resolve(
        state.queries.map((query) => ({
          ...query,
          replyCount: state.replies.filter((reply) => reply.queryId === query.id).length,
        })),
      ),
    ),
    findById: vi.fn((id) => Promise.resolve(state.queries.find((query) => query.id === id))),
    findByUserId: vi.fn((userId) =>
      Promise.resolve(state.queries.filter((query) => query.createdBy === userId)),
    ),
    create: vi.fn((input) => {
      const now = new Date().toISOString();
      const query = {
        id: `q-${state.queries.length + 1}`,
        status: 'open',
        matchedFaqIds: [],
        createdAt: now,
        updatedAt: now,
        replyCount: 0,
        ...input,
      };
      state.queries.push(query);
      return Promise.resolve(query);
    }),
    update: vi.fn((query) => {
      const index = state.queries.findIndex((item) => item.id === query.id);
      state.queries[index] = { ...query, updatedAt: new Date().toISOString() };
      return Promise.resolve(state.queries[index]);
    }),
  },
}));

vi.mock('../repositories/replyRepository.js', () => ({
  replyRepository: {
    findByQueryId: vi.fn((queryId) =>
      Promise.resolve(state.replies.filter((reply) => reply.queryId === queryId)),
    ),
    findById: vi.fn((id) => Promise.resolve(state.replies.find((reply) => reply.id === id))),
    create: vi.fn((input) => {
      const reply = {
        id: `r-${state.replies.length + 1}`,
        isVerified: false,
        createdAt: new Date().toISOString(),
        ...input,
      };
      state.replies.push(reply);
      return Promise.resolve(reply);
    }),
    update: vi.fn((reply) => {
      const index = state.replies.findIndex((item) => item.id === reply.id);
      state.replies[index] = { ...reply };
      return Promise.resolve(state.replies[index]);
    }),
  },
}));

vi.mock('../repositories/faqRepository.js', () => ({
  faqRepository: {
    findAll: vi.fn(() => Promise.resolve(state.faqs)),
    findById: vi.fn((id) => Promise.resolve(state.faqs.find((faq) => faq.id === id))),
    create: vi.fn((input, source) => {
      const now = new Date().toISOString();
      const faq = {
        id: `faq-${state.faqs.length + 1}`,
        helpfulCount: 0,
        createdAt: now,
        updatedAt: now,
        source,
        ...input,
      };
      state.faqs.push(faq);
      return Promise.resolve(faq);
    }),
    markHelpful: vi.fn((id) => {
      const faq = state.faqs.find((item) => item.id === id);
      if (faq) faq.helpfulCount += 1;
      return Promise.resolve(faq);
    }),
  },
}));

const { default: app } = await import('../app.js');

describe('API auth and protected flows', () => {
  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.ADMIN_REGISTRATION_CODE = 'admin-code';
    const now = new Date();
    state.users = [
      {
        id: 'intern-1',
        name: 'Intern User',
        email: 'intern@example.com',
        role: 'intern',
        passwordHash: await hashPassword('intern12345'),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        passwordHash: await hashPassword('admin12345'),
        createdAt: now,
        updatedAt: now,
      },
    ];
    state.queries = [
      {
        id: 'q-1',
        title: 'Internship stipend question',
        description: 'I need help understanding the internship stipend schedule.',
        category: 'Stipend',
        tags: ['stipend'],
        status: 'open',
        latestReplyPreview: null,
        matchedFaqIds: [],
        verifiedReplyId: null,
        createdBy: 'intern-1',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'q-empty',
        title: 'Query without replies',
        description: 'This query exists specifically to verify the empty reply state.',
        category: 'Support',
        tags: ['empty'],
        status: 'open',
        matchedFaqIds: [],
        createdBy: 'intern-1',
        createdAt: now,
        updatedAt: now,
      },
    ];
    state.replies = [
      {
        id: 'r-1',
        queryId: 'q-1',
        body: 'The stipend is processed after attendance verification.',
        authorName: 'Admin User',
        authorRole: 'admin',
        authorId: 'admin-1',
        isVerified: false,
        createdAt: now,
      },
    ];
    state.faqs = [];
  });

  async function login(email: string, password: string): Promise<string> {
    const response = await request(app).post('/api/auth/login').send({ email, password });
    return response.body.data.token;
  }

  it('logs in a valid intern', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'intern@example.com', password: 'intern12345' });

    expect(response.status).toBe(200);
    expect(response.body.data.user.role).toBe('intern');
    expect(response.body.data.token).toBeTruthy();
  });

  it('rejects protected routes without a token', async () => {
    const response = await request(app).get('/api/queries');

    expect(response.status).toBe(401);
  });

  it('rejects admin registration when no admin code is configured', async () => {
    delete process.env.ADMIN_REGISTRATION_CODE;

    const response = await request(app).post('/api/auth/register').send({
      name: 'Unexpected Admin',
      email: 'unexpected-admin@example.com',
      password: 'admin12345',
      role: 'admin',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid admin registration code');
  });

  it('creates a query as the authenticated intern', async () => {
    const token = await login('intern@example.com', 'intern12345');

    const response = await request(app)
      .post('/api/queries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Need help with onboarding',
        description: 'I am unable to finish the onboarding document upload step.',
        category: 'Onboarding',
        tags: ['documents'],
      });

    expect(response.status).toBe(201);
    expect(response.body.data.createdBy).toBe('intern-1');
  });

  it('prevents admins from creating intern queries', async () => {
    const token = await login('admin@example.com', 'admin12345');

    const response = await request(app)
      .post('/api/queries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Admin should not create this',
        description: 'This request should be rejected by the intern-only route guard.',
        category: 'Support',
        tags: ['authorization'],
      });

    expect(response.status).toBe(403);
  });

  it("prevents interns from viewing another user's queries", async () => {
    const token = await login('intern@example.com', 'intern12345');

    const response = await request(app)
      .get('/api/users/admin-1/queries')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it('returns an empty reply list for an existing query with no replies', async () => {
    const token = await login('intern@example.com', 'intern12345');

    const response = await request(app)
      .get('/api/queries/q-empty/replies')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });

  it.each([
    ['intern@example.com', 'intern12345', 'intern'],
    ['admin@example.com', 'admin12345', 'admin'],
  ])('creates a reply for an authenticated %s user', async (email, password, role) => {
    const token = await login(email, password);

    const response = await request(app)
      .post('/api/queries/q-empty/replies')
      .set('Authorization', `Bearer ${token}`)
      .send({ body: `A helpful reply posted by the ${role}.` });

    expect(response.status).toBe(201);
    expect(response.body.data.queryId).toBe('q-empty');
    expect(response.body.data.authorRole).toBe(role);
  });

  it('returns not found for replies when the parent query does not exist', async () => {
    const token = await login('intern@example.com', 'intern12345');

    const getResponse = await request(app)
      .get('/api/queries/missing-query/replies')
      .set('Authorization', `Bearer ${token}`);
    const postResponse = await request(app)
      .post('/api/queries/missing-query/replies')
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'This reply should not be created.' });

    expect(getResponse.status).toBe(404);
    expect(postResponse.status).toBe(404);
  });

  it('allows admin status updates and FAQ conversion', async () => {
    const token = await login('admin@example.com', 'admin12345');

    const statusResponse = await request(app)
      .patch('/api/queries/q-1/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'resolved' });

    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body.data.status).toBe('resolved');

    const verifyResponse = await request(app)
      .patch('/api/admin/replies/r-1/verify')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(verifyResponse.status).toBe(200);

    const faqResponse = await request(app)
      .post('/api/admin/replies/r-1/convert-to-faq')
      .set('Authorization', `Bearer ${token}`)
      .send({ question: 'When is the internship stipend processed?' });

    expect(faqResponse.status).toBe(201);
    expect(faqResponse.body.data.source).toBe('crowd-sourced');
  });
});
