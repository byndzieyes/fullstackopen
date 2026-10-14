import { describe, test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import logger from '../utils/logger.js';
import { initialBlogs, blogsInDb } from './test_helper.js';
import Blog from '../models/blog.js';

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe('Blog API tests', () => {
  test('GET /api/blogs returns as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('GET /api/blogs returns all blogs', async () => {
    const response = await api.get('/api/blogs');
    assert.equal(response.body.length, initialBlogs.length);
  });

  test('blog identifier is named id', async () => {
    const response = await api.get('/api/blogs').expect(200);

    assert.ok(response.body.length > 0);

    for (const blog of response.body) {
      assert.equal(typeof blog.id, 'string');
      assert.ok(blog.id.length > 0);
      assert.equal(Object.hasOwn(blog, '_id'), false);
    }
  });

  test('POST /api/blogs creates a new blog', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Some Author',
      url: 'https://example.com',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await blogsInDb();
    assert.equal(blogsAtEnd.length, initialBlogs.length + 1);
    assert.ok(blogsAtEnd.some((blog) => blog.title === newBlog.title));
  });
});

after(async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
});
